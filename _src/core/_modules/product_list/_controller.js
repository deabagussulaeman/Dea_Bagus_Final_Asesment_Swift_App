import React, {useEffect, useState, useRef} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_BANNER_SLIDER} from '@app/services/queries/banner';
import {NAME, setMetricStart, setMetricEnd} from '@app/helpers/Performance';
import {navigateTo} from '@app/helpers/Navigation';
import {
  GET_PRODUCTS_BY_BRAND,
  GET_PRODUCTS_BY_CATEGORIES,
} from '@app/_modules/product_list/services/schema';
import {modules} from '@root/swift.config';
import {BRAND, CATEGORY, PRICE, sort} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import Views from '@app/_modules/product_list/views';
import {GET_PRODUCT_FILTER_PRODUCT_LIST} from '@app/_modules/product_list/services/schema';
import _ from 'lodash';

const ProductListController = ({route}) => {
  if (!modules.product_list.enable) {
    return null;
  }
  /**
   * ----------------------------------------- *
   * @constant
   * @summary list of constant local state
   * ----------------------------------------- *
   */

  const params = route.params;
  const variables = params?.variables;
  const type = params?.type;
  const id = params?.id;
  const useSliderBanner = params?.useSliderBanner;
  const refFirebaseList = useRef();
  const {t} = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [query, setQuery] = useState(
    type === CATEGORY ? GET_PRODUCTS_BY_CATEGORIES : GET_PRODUCTS_BY_BRAND,
  );
  const [queryVariables, setQueryVariables] = useState(null);
  const [bannerSlider, setBannerSlider] = useState([]);
  const [filters, setFilters] = useState({});
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [visibleSort, setVisibleSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState('');

  const {data: bannerSliderData} = useCustomQuery({
    schema: GET_BANNER_SLIDER,
    useInitData: true,
  });

  const {data, onRefetchData} = useCustomQuery({
    schema: query,
  });

  const {data: dataFilter} = useCustomQuery({
    schema: GET_PRODUCT_FILTER_PRODUCT_LIST,
    useInitData: true,
    variables: {
      categoryIdFilter: {eq: id},
    },
  });

  /**
   * ----------------------------------------- *
   * @dependency [route]
   * @summary set initialize data
   * ----------------------------------------- *
   */
  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    setNoMoreData(false);
  }, [route]);

  /**
   * ----------------------------------------- *
   * @dependency [bannerSliderData]
   * @summary set banner slider from remote
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (bannerSliderData && bannerSliderData?.data) {
      setBannerSlider(bannerSliderData?.data.getHomepageSlider.images);
    }
  }, [bannerSliderData]);

  /**
   * ----------------------------------------- *
   * @dependency [variables]
   * @summary control query and queryVariables
   * based on product list to be displayed
   * (e.g. : by category, by brand, by search keyword)
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (variables) {
      let queryVariablesTmp = {};
      switch (variables?.type) {
        case BRAND:
          setQuery(GET_PRODUCTS_BY_BRAND);
          queryVariablesTmp = {
            filters: {
              brand: {eq: variables?.attribute_id},
            },
          };
          break;
        case CATEGORY:
          setQuery(GET_PRODUCTS_BY_CATEGORIES);
          queryVariablesTmp = {
            filters: {
              category_id: {eq: variables?.categoryId},
            },
          };
          break;
      }
      queryVariablesTmp = {
        ...queryVariablesTmp,
        currentPage: currentPage,
        pageSize: 6,
        sortBy: {price: 'ASC'},
      };
      setQueryVariables(queryVariablesTmp);
      onRefetchData({params: queryVariablesTmp});
    } else if (route.params) {
      let queryVariablesTmp = {};
      switch (type) {
        case BRAND:
          setQuery(GET_PRODUCTS_BY_BRAND);
          queryVariablesTmp = {
            filters: {
              brand: {eq: route.params?.attribute_id},
            },
          };
          break;
        case CATEGORY:
          setQuery(GET_PRODUCTS_BY_CATEGORIES);
          queryVariablesTmp = {
            filters: {
              category_id: {eq: route.params?.id},
            },
          };
          break;
      }
      queryVariablesTmp = {
        ...queryVariablesTmp,
        currentPage: currentPage,
        pageSize: 6,
        sortBy: {price: 'ASC'},
      };
      setQueryVariables(queryVariablesTmp);
      onRefetchData({params: queryVariablesTmp});
    }
  }, [variables]);

  /**
   * ----------------------------------------- *
   * @dependency [data]
   * @summary set product from remote and
   * set total all product
   * ----------------------------------------- *
   */
  useEffect(() => {
    const getProductListData = async () => {
      if (data === undefined) {
        await setMetricStart({
          name: NAME.PRODUCT_LIST,
          refFirebase: refFirebaseList,
        });
      } else {
        if (data && data?.data && queryVariables) {
          const items = _.get(data, 'data.products.items');
          const total_count = _.get(data, 'data.products.total_count');
          const currentProducts = products;
          const newProducts = [...currentProducts, ...items];
          setProducts(newProducts);
          setTotalCount(total_count);
          setLoading(false);
          await setMetricEnd({refFirebase: refFirebaseList});
        }
      }
    };
    getProductListData();
  }, [data]);

  useEffect(() => {
    let tmpFilter = {};
    if (dataFilter && dataFilter?.data) {
      tmpFilter = _.chain(_.get(dataFilter, 'data.products.aggregations'))
        .keyBy('attribute_code')
        .mapValues(() => {
          return [];
        })
        .value();
      setFilters(tmpFilter);
    }
  }, [dataFilter]);

  /**
   * ----------------------------------------- *
   * @function onLoadMore
   * @summary get more product from remote
   * ----------------------------------------- *
   */
  const onLoadMore = () => {
    if (!loading) {
      const total_count = _.get(data, 'data.products.total_count');
      if (products.length !== total_count) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);

        const queryVariablesTmp = {
          ...queryVariables,
          currentPage: newPage,
        };
        setQueryVariables(queryVariablesTmp);
        onRefetchData({params: queryVariablesTmp});
      } else {
        setNoMoreData(true);
      }
    }
  };

  /**
   * ----------------------------------------- *
   * @function onNavigateToProductDetail
   * @summary navigate to product detail
   * ----------------------------------------- *
   */
  const onNavigateToProductDetail = productUrlKey => {
    navigateTo(modules.product_detail.enable, modules.product_detail.name, {
      productUrlKey,
    });
  };

  /**
   * ----------------------------------------- *
   * @function onClearFilter
   * @summary clear filter data
   * ----------------------------------------- *
   */
  const onClearFilter = () => {
    setFilters({brand: [], price: []});
  };

  /**
   * ----------------------------------------- *
   * @function onApplyFilter
   * @summary on press apply filter
   * ----------------------------------------- *
   */
  const onApplyFilter = () => {
    setProducts([]);
    setLoading(true);
    if (variables) {
      let queryVariablesTmp = {};
      let tmpSort = {price: 'ASC'};
      let brand;
      let price;
      let anotherFilter = {};
      switch (variables.type) {
        case BRAND:
          setQuery(GET_PRODUCTS_BY_BRAND);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                const min = Math.min(...filters?.price);
                const max = Math.max(...filters?.price);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          if (selectedSort !== 'placeholder') {
            tmpSort = sort?.items[selectedSort]?.value;
          } else {
            tmpSort = {price: 'ASC'};
          }
          queryVariablesTmp = {
            filters: {
              brand: {eq: variables.attribute_id},
              price,
              ...anotherFilter,
            },
          };
          break;
        case CATEGORY:
          setQuery(GET_PRODUCTS_BY_CATEGORIES);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                const min = Math.min(...filters?.price);
                const max = Math.max(...filters?.price);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          if (selectedSort !== 'placeholder') {
            tmpSort = sort?.items[selectedSort]?.value;
          } else {
            tmpSort = {price: 'ASC'};
          }
          queryVariablesTmp = {
            filters: {
              category_id: {eq: variables.categoryId},
              brand,
              price,
              ...anotherFilter,
            },
          };
          break;
      }
      queryVariablesTmp = {
        ...queryVariablesTmp,
        currentPage: 1,
        pageSize: 6,
        sort: {...tmpSort},
      };
      setQueryVariables(queryVariablesTmp);
      onRefetchData({params: queryVariablesTmp});
    } else if (route.params) {
      let queryVariablesTmp = {};
      let tmpSort = {price: 'ASC'};
      let brand;
      let price;
      let anotherFilter = {};
      switch (type) {
        case BRAND:
          setQuery(GET_PRODUCTS_BY_BRAND);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                let tmpPrice = [];
                for (let o = 0; o < filters.price.length; o++) {
                  tmpPrice.push(filters.price[o].split('_'));
                }
                tmpPrice = [].concat.apply([], tmpPrice);
                const min = Math.min(...tmpPrice);
                const max = Math.max(...tmpPrice);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          if (selectedSort !== 'placeholder') {
            tmpSort = sort?.items[selectedSort]?.value;
          } else {
            tmpSort = {price: 'ASC'};
          }
          queryVariablesTmp = {
            filters: {
              brand: {eq: route.params?.attribute_id},
              price,
              ...anotherFilter,
            },
          };
          break;
        case CATEGORY:
          setQuery(GET_PRODUCTS_BY_CATEGORIES);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                let tmpPrice = [];
                for (let o = 0; o < filters.price.length; o++) {
                  tmpPrice.push(filters.price[o].split('_'));
                }
                tmpPrice = [].concat.apply([], tmpPrice);
                const min = Math.min(...tmpPrice);
                const max = Math.max(...tmpPrice);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          if (selectedSort !== 'placeholder') {
            tmpSort = sort?.items[selectedSort]?.value;
          } else {
            tmpSort = {price: 'ASC'};
          }
          queryVariablesTmp = {
            filters: {
              category_id: {eq: route.params?.id},
              brand,
              price,
              ...anotherFilter,
            },
          };
          break;
      }
      queryVariablesTmp = {
        ...queryVariablesTmp,
        currentPage: 1,
        pageSize: 6,
        sort: {...tmpSort},
      };
      setQueryVariables(queryVariablesTmp);
      onRefetchData({params: queryVariablesTmp});
    }
    setVisibleFilter(false);
  };

  /**
   * ----------------------------------------- *
   * @function onSelectSort
   * @summary set sort data
   * ----------------------------------------- *
   */
  const onSelectSort = value => {
    setVisibleSort(false);
    setSelectedSort(value);
    setLoading(true);
    setProducts([]);
    if (variables) {
      let queryVariablesTmp = {};
      let tmpSort;
      let brand;
      let price;
      let anotherFilter = {};
      switch (variables.type) {
        case BRAND:
          setQuery(GET_PRODUCTS_BY_BRAND);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                let tmpPrice = [];
                for (let o = 0; o < filters.price.length; o++) {
                  tmpPrice.push(filters.price[o].split('_'));
                }
                tmpPrice = [].concat.apply([], tmpPrice);
                const min = Math.min(...tmpPrice);
                const max = Math.max(...tmpPrice);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          queryVariablesTmp = {
            filters: {
              brand: {eq: variables?.attribute_id},
              price,
              ...anotherFilter,
            },
          };
          break;
        case CATEGORY:
          setQuery(GET_PRODUCTS_BY_CATEGORIES);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                let tmpPrice = [];
                for (let o = 0; o < filters.price.length; o++) {
                  tmpPrice.push(filters.price[o].split('_'));
                }
                tmpPrice = [].concat.apply([], tmpPrice);
                const min = Math.min(...tmpPrice);
                const max = Math.max(...tmpPrice);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          queryVariablesTmp = {
            filters: {
              category_id: {eq: variables?.categoryId},
              brand,
              price,
              ...anotherFilter,
            },
          };
          break;
      }
      if (value !== 'placeholder') {
        tmpSort = sort?.items[value]?.value;
      } else {
        tmpSort = {price: 'ASC'};
      }
      queryVariablesTmp = {
        ...queryVariablesTmp,
        currentPage: 1,
        pageSize: 6,
        sort: {...tmpSort},
      };
      setQueryVariables(queryVariablesTmp);
      onRefetchData({params: queryVariablesTmp});
    } else if (route.params) {
      let queryVariablesTmp = {};
      let tmpSort;
      let brand;
      let price;
      let anotherFilter = {};
      switch (type) {
        case BRAND:
          setQuery(GET_PRODUCTS_BY_BRAND);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                let tmpPrice = [];
                for (let o = 0; o < filters.price.length; o++) {
                  tmpPrice.push(filters.price[o].split('_'));
                }
                tmpPrice = [].concat.apply([], tmpPrice);
                const min = Math.min(...tmpPrice);
                const max = Math.max(...tmpPrice);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          queryVariablesTmp = {
            filters: {
              brand: {eq: route.params?.attribute_id},
              price,
              ...anotherFilter,
            },
          };
          break;
        case CATEGORY:
          setQuery(GET_PRODUCTS_BY_CATEGORIES);
          setCurrentPage(1);
          if (filters) {
            let name = Object.keys(filters);
            for (let i = 0; i < name.length; i++) {
              if (name[i] === BRAND && filters?.brand?.length > 0) {
                brand = {in: filters.brand};
              } else if (name[i] === PRICE && filters?.price?.length > 0) {
                let tmpPrice = [];
                for (let o = 0; o < filters.price.length; o++) {
                  tmpPrice.push(filters.price[o].split('_'));
                }
                tmpPrice = [].concat.apply([], tmpPrice);
                const min = Math.min(...tmpPrice);
                const max = Math.max(...tmpPrice);
                price = {from: min, to: max};
              } else {
                if (filters[name[i]].length === 1) {
                  anotherFilter[name[i]] = {eq: filters[name[i]].join('')};
                } else if (filters[name[i]].length > 1) {
                  anotherFilter[name[i]] = {in: filters[name[i]]};
                }
              }
            }
          }
          queryVariablesTmp = {
            filters: {
              category_id: {eq: route.params?.id},
              brand,
              price,
              ...anotherFilter,
            },
          };
          break;
      }
      if (value !== 'placeholder') {
        tmpSort = sort?.items[value]?.value;
      } else {
        tmpSort = {price: 'ASC'};
      }
      queryVariablesTmp = {
        ...queryVariablesTmp,
        currentPage: 1,
        pageSize: 6,
        sort: {...tmpSort},
      };
      setQueryVariables(queryVariablesTmp);
      onRefetchData({params: queryVariablesTmp});
    }
  };

  /**
   * ----------------------------------------- *
   * @function onPressVisibleFilter
   * @summary set modal filter visible
   * ----------------------------------------- *
   */
  const onPressVisibleFilter = () => {
    setVisibleFilter(true);
  };

  /**
   * ----------------------------------------- *
   * @function onPressCloseFilter
   * @summary set modal filter hide
   * ----------------------------------------- *
   */
  const onPressCloseFilter = () => {
    setVisibleFilter(false);
  };

  /**
   * ----------------------------------------- *
   * @function onPressVisibleSort
   * @summary set modal sort visible
   * ----------------------------------------- *
   */
  const onPressVisibleSort = e => {
    setVisibleSort(e);
  };

  const controllerProps = {
    t,
    products,
    totalCount,
    loading,
    noMoreData,
    bannerSlider,
    useSliderBanner,
    categoryId: variables?.categoryId || (type === CATEGORY && id),
    attributeId: variables?.attribute_id || (type === BRAND && id),
    categoryName: variables?.categoryName,
    onNavigateToProductDetail,
    onLoadMore,
    filters,
    visibleFilter,
    onPressCloseFilter,
    onPressVisibleFilter,
    dataFilter: _.get(dataFilter, 'data.products.aggregations'),
    onApplyFilter,
    onClearFilter,
    setFilters,
    onPressVisibleSort,
    visibleSort,
    selectedSort,
    onSelectSort,
  };

  return <Views {...controllerProps} />;
};

ProductListController.propTypes = {
  // route
  route: PropTypes.any,
};

export default ProductListController;
