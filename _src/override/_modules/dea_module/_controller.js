import {modules} from '@root/swift.config';
import {navigateTo} from '@app/helpers/Navigation';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import Views from '@app/_modules/dea_module/views';
import React, {useEffect, useState} from 'react';
import {GET_CATEGORIES_PARENTS} from '@app/_modules/dea_module/services/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';

const DeaModuleController = ({refreshing = false}) => {
  const [category_list, setCategories] = useState([]);
  const {data} = useCustomQuery({
    schema: GET_CATEGORIES_PARENTS,
    useInitData: true,
  });  

  useEffect(() => {
    if (data && data?.data) {
      setCategories(data?.data?.categoryList[0].children);
    }
  });

  if (!modules.dea_module.enable) {
    return null;
  }

  const onNavigateToProductList = (categoryIdParam, categoryNameParam) => {
    navigateTo(modules.product_list.enable, modules.product_list.name, {
      variables: {
        type: 'category',
        categoryId: categoryIdParam,
        categoryName: categoryNameParam,
      },
    });
  };

  const {t} = useTranslation();

  const controllerProps = {
    t ,
    category_list ,
    onNavigateToProductList ,
  };

  return <Views {...controllerProps} />;
};

DeaModuleController.propTypes = {
  navigation: PropTypes.any,
};

export default DeaModuleController;
