import React from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {navigateTo} from '@app/helpers/Navigation';
import {
  GET_CATEGORIES,
  GET_CATEGORIES_VES_MENU,
} from '@app/_modules/main_categories/services/schema';
import Config from 'react-native-config';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import Views from '@app/_modules/main_categories/views';

const CategoriesController = () => {
  if (!modules.main_categories.enable) {
    return null;
  }
  const {t} = useTranslation();
  const {data, loading} = useCustomQuery({
    schema: Config.IS_VESMENU ? GET_CATEGORIES_VES_MENU : GET_CATEGORIES,
    useInitData: true,
  });

  const onPressCategory = (categoryId, categoryName) => {
    navigateTo(modules.product_list.enable, modules.product_list.name, {
      variables: {
        type: 'category',
        categoryId,
        categoryName,
        useSliderBanner: false,
      },
    });
  };

  const controllerProps = {
    t,
    loading,
    vesMenu: Config.IS_VESMENU,
    categories: Config.IS_VESMENU
      ? data?.data?.vesMenu
      : data?.data?.categoryList[0],
    onPress: onPressCategory,
    onPressCategory,
  };

  return <Views {...controllerProps} />;
};

export default CategoriesController;
