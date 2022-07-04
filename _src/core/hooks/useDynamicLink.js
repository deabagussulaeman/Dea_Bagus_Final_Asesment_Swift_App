import {useEffect} from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import _ from 'lodash';
import {modules} from '@root/swift.config';
import {CATEGORY} from '@app/helpers/Constants';
import FirestoreHelper, {firestoreHelper} from '@app/helpers/Firestore';
import {navigateTo} from '@app/helpers/Navigation';

const useDynamicLink = () => {
  /**
   *
   * @param {string} postFix
   * @returns object with config for dynamic link
   */
  const getPath = async postFix => {
    let data = null;
    if (postFix) {
      const FirestoreListener = new FirestoreHelper();
      try {
        const dynamicLinkData = await firestoreHelper(
          FirestoreListener.doc.DYNAMIC_LINK,
        );
        const selectedPath = _.get(dynamicLinkData, '_data.path') === postFix;
        const getDocs = _.get(dynamicLinkData, '_data');
        if (selectedPath) {
          data = getDocs;
        }
      } catch (err) {
        console.log('getPath func on useDynamicLink: ', err);
      }
    }
    return data;
  };

  /**
   *
   * @param {string} categoryId
   * handle navigation to PLP
   */
  const navigateToCategory = categoryId => {
    navigateTo(modules.product_list.enable, modules.product_list.name, {
      variables: {
        type: CATEGORY,
        categoryId: categoryId,
      },
    });
  };

  /**
   *
   * @param {string} link
   * handle link from dynamic link
   */
  const onHandleLink = async link => {
    const url = _.get(link, 'url');
    if (url) {
      try {
        const splitURL = url.split('/');
        const postFix = splitURL[3];
        const objConfig = await getPath(postFix);

        if (objConfig) {
          const idParam = _.get(objConfig, 'id');
          const typeParam = _.get(objConfig, 'type');
          // const ruleParam = _.get(objConfig, 'rules');

          if (typeParam === CATEGORY) {
            navigateToCategory(idParam);
          }
        }
      } catch (err) {
        console.log('handleLink func on useDynamicLink: ', err);
      }
    }
  };

  useEffect(() => {
    //foreground
    const unsub = dynamicLinks().onLink(async link => await onHandleLink(link));
    //background events
    dynamicLinks()
      .getInitialLink()
      .then(async link => await onHandleLink(link));
    return () => unsub();
  }, []);

  return null;
};

export default useDynamicLink;
