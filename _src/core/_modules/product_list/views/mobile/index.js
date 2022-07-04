import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Colors, Mixins} from '@app/styles';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import PropTypes from 'prop-types';
import BannerSlider from '@app/components/BannerSlider';
import Show from '@app/components/Show';
import RenderItemList from '@app/components/RenderItem';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import FastImage from 'react-native-fast-image';
import CategorySlider from '@app/components/CategorySlider';
import NavBar from '@app/components/NavBar';
import Shimmer from '@app/components/_Shimmer';
import AnalyticsHelper from '@app/helpers/Analytics';
import {thumborProductList} from '@app/helpers/Thumbor';
import {numberFormat} from '@app/helpers/General';
import styles from '@app/_modules/product_list/views/mobile/styles';
import {rxUserTheme} from '@app/services/cache';
import {sort, TYPE_APPBAR, TYPE_MODAL_SORT} from '@app/helpers/Constants';
import FilterAndSort from '@app/_modules/product_list/atoms/FilterAndSort/index';
import Icon from 'react-native-vector-icons/Ionicons';
import AppModal from '@app/components/_AppModal';

const ProductListMobileView = ({
  t,
  loading,
  products,
  totalCount,
  onLoadMore,
  noMoreData,
  categoryId = null,
  categoryName = '',
  attributeId = '',
  onNavigateToProductDetail,
  bannerSlider,
  useSliderBanner,
  filters,
  dataFilter,
  setFilters,
  visibleFilter,
  onPressCloseFilter,
  onPressVisibleFilter,
  onClearFilter,
  onApplyFilter,
  onPressVisibleSort,
  visibleSort,
  selectedSort,
  onSelectSort,
}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary collections constant
   * ----------------------------------------- *
   */
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const [displaySlider, setDisplaySlider] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const mount = useRef();

  /**
   * ----------------------------------------- *
   * @function onLogCategoryToAnalytics
   * @summary log product list to analytics
   * ----------------------------------------- *
   */
  const onLogCategoryToAnalytics = () => {
    let item = {
      item_list_id: attributeId
        ? attributeId.toString()
        : categoryId.toString(),
      item_list_name: categoryName.toString(),
    };
    // console.log('HERE', item);
    AnalyticsHelper.eventViewItemList(item);
  };

  /**
   * ----------------------------------------- *
   * @dependency []
   * @summary component did mount
   * ----------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    return () => (mount.current = false);
  }, []);

  /**
   * ----------------------------------------- *
   * @dependency [categoryId]
   * @summary for display slider
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (categoryId && mount.current) {
      setDisplaySlider(true);
      onLogCategoryToAnalytics();
    }
  }, [categoryId]);

  /**
   * ----------------------------------------- *
   * @function HeaderElement
   * @dependency [
   * bannerSlider,
   * categoryId,
   * products.length
   * ]
   * @summary for display header element
   * @returns Component
   * ----------------------------------------- *
   */
  const HeaderElement = useCallback(() => {
    if (mount.current) {
      return (
        <Section>
          <Show when={displaySlider}>
            <Section>
              <BannerSlider
                styleFrame={styles.bannerFrame}
                autoplay={true}
                data={bannerSlider}
                clickable={true}
              />
              <CategorySlider categoryId={categoryId} />
            </Section>
          </Show>
          <Show when={!loading}>
            <Section
              width={Mixins.MAX_WIDTH}
              paddingHorizontal={20}
              marginBottom={20}
              horizontalEnd>
              <TouchableOpacity
                onPress={() => onPressVisibleSort(true)}
                style={[styles.pickerStyle]}>
                <Section
                  row
                  horizontalCenter
                  spaceBetween
                  paddingHorizontal={5}>
                  <Label>Sort</Label>
                  <Icon
                    name="chevron-down-outline"
                    size={16}
                    color={Colors.GRAY_DARK}
                  />
                </Section>
              </TouchableOpacity>
            </Section>
          </Show>
          <Section height={30} horizontalCenter verticalCenter>
            <Label center>
              {t('product_list.view.showing')} {products.length}{' '}
              {t('product_list.view.of')} {totalCount}
            </Label>
          </Section>
        </Section>
      );
    } else {
      return <></>;
    }
  }, [bannerSlider, categoryId, products.length]);

  /**
   * ----------------------------------------- *
   * @function FooterElement
   * @summary for display footer element
   * @returns Component
   * ----------------------------------------- *
   */
  const FooterElement = () => {
    if (loading) {
      return <ActivityIndicator />;
    } else {
      return (
        <Section margin={20}>
          <Show when={noMoreData}>
            <Label>{t('product_list.view.noMoreData')}</Label>
          </Show>
        </Section>
      );
    }
  };

  const ListEmptyComponent = () => {
    if (!loading) {
      return <Label center>{t('label.noData')}</Label>;
    } else {
      return null;
    }
  };

  /**
   * ----------------------------------------- *
   * @function RenderItem
   * @param {object} item
   * @summary for display single item product
   * @returns Component
   * ----------------------------------------- *
   */
  const RenderItem = ({item, index}) => {
    const price_range = item?.price_range;
    const price_max = price_range?.maximum_price;
    const price_final = price_max?.final_price;

    let imageSourceCondition =
      item.small_image !== null &&
      item.small_image.url !== '' &&
      item.small_image !== undefined;
    if (imageErrors[item.url_key]) {
      imageSourceCondition = false;
    }

    return (
      <RenderItemList itemKey={index}>
        <Section
          onPress={() => onNavigateToProductDetail(item.url_key)}
          style={styles.itemContainer}>
          <Show when={imageSourceCondition}>
            <FastImage
              key={item.url_key}
              style={styles.itemImage}
              source={{
                uri: thumborProductList(item.small_image.url.toString()),
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              resizeMode={FastImage.resizeMode.contain}
              onError={() => {
                const newImageErrors = {
                  ...imageErrors,
                  [item.url_key]: true,
                };
                setImageErrors(newImageErrors);
              }}
            />
          </Show>
          <Show when={!imageSourceCondition}>
            <Image
              source={require('@app/assets/images/placeholder.png')}
              style={styles.itemImage}
            />
          </Show>

          <Section width={'100%'} paddingHorizontal={10} horizontalStart>
            <Label small left>
              {item.name}
            </Label>
            <Label small bold>
              {numberFormat({
                prefix: price_final.currency,
                value: price_final.value,
              })}
            </Label>
          </Section>
        </Section>
      </RenderItemList>
    );
  };

  if (!mount.current) {
    return (
      <>
        <NavBar type={TYPE_APPBAR} useBack />
        <Show when={useSliderBanner ?? true}>
          <Section marginHorizontal={20}>
            <Section marginVertical={20}>
              <Shimmer wrapperStyle={{height: 160}} />
            </Section>
            <Shimmer wrapperStyle={{height: 75}} />
          </Section>
        </Show>
        <Section marginHorizontal={20}>
          <Section row spaceBetween marginVertical={20}>
            <Shimmer
              wrapperStyle={{
                height: 200,
                width: Mixins.MAX_WIDTH * 0.44,
                flex: 1,
              }}
            />
            <Shimmer
              wrapperStyle={{
                height: 200,
                width: Mixins.MAX_WIDTH * 0.44,
                flex: 1,
              }}
            />
          </Section>
        </Section>
      </>
    );
  } else {
    return (
      <>
        <NavBar type={TYPE_APPBAR} useBack />
        <FlatList
          renderItem={RenderItem}
          ListHeaderComponent={HeaderElement}
          ListHeaderComponentStyle={{alignSelf: 'center'}}
          ListFooterComponent={FooterElement}
          ListFooterComponentStyle={{alignSelf: 'center'}}
          ListEmptyComponent={ListEmptyComponent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          numColumns={2}
          data={products}
          keyExtractor={item => item.id.toString()}
          style={{
            width: Mixins.MAX_WIDTH,
            backgroundColor:
              getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE,
          }}
        />
        <Show when={!loading}>
          <Section
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={5}
            backgroundColor={
              getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE
            }
            style={styles.buttonFilter}
            onPress={onPressVisibleFilter}>
            <Section row horizontalCenter verticalCenter>
              <Label
                bold
                color={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.DARK}>
                {t('product_list.view.filterAndSort')}
              </Label>
            </Section>
          </Section>
        </Show>
        <FilterAndSort
          visible={visibleFilter}
          onBackBackButtonPress={onPressCloseFilter}
          dataFilter={dataFilter}
          filters={filters}
          setFilters={setFilters}
          onApplyFilter={onApplyFilter}
          onClearFilter={onClearFilter}
        />
        <AppModal
          type={TYPE_MODAL_SORT}
          show={visibleSort}
          data={sort}
          selectedSort={selectedSort}
          onPressVisibleSort={onPressVisibleSort}
          onSelectSort={onSelectSort}
        />
      </>
    );
  }
};

ProductListMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // loading state
  loading: PropTypes.bool,
  // data products
  products: PropTypes.any,
  // total count
  totalCount: PropTypes.number,
  // function to load more data
  onLoadMore: PropTypes.func,
  // condition no more data
  noMoreData: PropTypes.bool,
  // category id
  categoryId: PropTypes.any,
  // category name
  categoryName: PropTypes.string,
  // attribute id
  attributeId: PropTypes.any,
  // navigate to product detail
  onNavigateToProductDetail: PropTypes.func,
  // banner slider
  bannerSlider: PropTypes.array,
  // use slider banner
  useSliderBanner: PropTypes.any,
};

export default ProductListMobileView;
