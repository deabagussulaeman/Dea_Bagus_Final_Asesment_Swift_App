import React, {useEffect, useRef, useState} from 'react';
import {GET_CATEGORYID_BYURL} from '@app/services/queries/banner';
import {CATEGORY, PRODUCT} from '@app/helpers/Constants';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';
import useCustomQuery from '@app/hooks/useCustomQuery';
import BannerItem from '@app/components/BannerSlider/atoms/_BannerItem/index';

const BannerSliderImage = ({clickable, item, index}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary collections constant for
   * this function
   * ----------------------------------------- *
   */
  const noImageSource = require('@app/assets/images/placeholder.png');
  const splitUrlArray = item.url_redirection.split('/');
  const url = splitUrlArray[splitUrlArray.length - 1];
  const [, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const {data: categoryIdData} = useCustomQuery({
    schema: GET_CATEGORYID_BYURL,
    useInitData: true,
    variables: {url},
  });
  const mount = useRef();
  const {isPressableItem, onPressItemData} = item;

  // ComponentDidMount
  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  /**
   * ----------------------------------------- *
   * @dependency [categoryIdData]
   * @summary onvert url to id
   * category id data change
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (mount.current && categoryIdData?.data) {
      setCategoryId(categoryIdData?.data.categoryList[0]?.id);
    }
  }, [categoryIdData]);

  /**
   * ----------------------------------------- *
   * @function _onImageBannerLoadEnd
   * @summary stop loading when load end
   * ----------------------------------------- *
   */
  const _onImageBannerLoadEnd = () => {
    setLoading(false);
  };

  /**
   * ----------------------------------------- *
   * @function _onImageBannerError
   * @summary stop loading when banner error
   * ----------------------------------------- *
   */
  const _onImageBannerError = () => {
    setLoading(false);
  };

  /**
   * ----------------------------------------- *
   * @condition
   * @summary handle broken image
   * ----------------------------------------- *
   */
  const image_url = item.image_url;
  const imageSource =
    image_url !== null || image_url !== undefined || image_url !== ''
      ? image_url
      : noImageSource;

  /**
   * ----------------------------------------- *
   * @function onPress
   * @summary handle onPress BannerItem
   * ----------------------------------------- *
   */
  const onPress = () => {
    if (clickable) {
      navigateTo(modules.product_list.enable, modules.product_list.name, {
        variables: {
          type: CATEGORY,
          categoryId: categoryId,
        },
      });
    } else {
      // khusus untuk slider magezon clickable-nya false

      if (isPressableItem && onPressItemData && onPressItemData.type !== '') {
        if (onPressItemData.type === CATEGORY) {
          navigateTo(modules.product_list.enable, modules.product_list.name, {
            variables: {
              type: CATEGORY,
              categoryId: onPressItemData.idOrUrl,
            },
          });
        } else if (onPressItemData.type === PRODUCT) {
          navigateTo(
            modules.product_detail.enable,
            modules.product_detail.name,
            {
              productUrlKey: onPressItemData.idOrUrl,
            },
          );
        } else {
          return;
        }
      } else {
        return;
      }
    }
  };

  /**
   * ----------------------------------------- *
   * @condition
   * @summary type of image
   * ----------------------------------------- *
   */

  return (
    <BannerItem
      key={'banner-item-' + index}
      clickable={isPressableItem ? isPressableItem : clickable}
      keyIndex={item.image_id}
      imageSource={imageSource}
      onPress={onPress}
      onError={_onImageBannerError}
      onLoadEnd={_onImageBannerLoadEnd}
      isPressableItem={isPressableItem}
      onPressItemData={onPressItemData}
    />
  );
};

BannerSliderImage.propTypes = {
  // clickable
  clickable: PropTypes.bool,
  // item
  item: PropTypes.any,
  // index
  index: PropTypes.number,
};

export default BannerSliderImage;
