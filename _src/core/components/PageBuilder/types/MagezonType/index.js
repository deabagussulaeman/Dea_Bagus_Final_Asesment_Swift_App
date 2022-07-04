import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import NavBar from '@app/components/NavBar';
import AtomNavBarRight from '@app/_modules/main_home/atoms/NavBarRight';
import {pageBuilder} from '@root/swift.config';
import {ScrollView, RefreshControl} from 'react-native';
import WidgetSliderBanner from '@app/components/PageBuilder/atoms/WidgetSliderBanner';
import WidgetSliderCategory from '@app/components/PageBuilder/atoms/WidgetSliderCategory';
import WidgetProductSlider from '@app/components/PageBuilder/atoms/WidgetProductSlider';
import styles from '@app/components/PageBuilder/types/MagezonType/styles';
import {
  PRODUCT_SLIDER,
  SLIDER,
  CATEGORIES,
  PRODUCT_SORT_BY,
  CATEGORY,
  PRODUCT,
  TYPE_NAVBAR_CUSTOM,
} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';
import PropTypes from 'prop-types';

const RenderElements = ({elements}) => {
  return elements.map((element, index) => {
    const elementType = element.elements[0].elements[0];

    if (elementType.type === PRODUCT_SLIDER) {
      let condition = elementType.condition
        ? JSON.parse(elementType.condition)
        : false;

      const {t} = useTranslation();

      let categoryId = '2';
      let sortBy = {price: 'ASC'};
      let title = t('label.home');

      if (
        condition &&
        condition['1--1'] &&
        condition['1--1'].attribute &&
        condition['1--1'].attribute === 'category_ids'
      ) {
        categoryId = condition['1--1'].value;
      }

      if (elementType.order_by || elementType.orer_by) {
        let sortByKey = elementType.order_by
          ? elementType.order_by
          : elementType.orer_by;

        if (PRODUCT_SORT_BY[sortByKey]) {
          sortBy = PRODUCT_SORT_BY[sortByKey];
        }
      }

      if (elementType.title && elementType.title !== '') {
        title = elementType.title;
      }

      return (
        <WidgetProductSlider
          categoryId={categoryId}
          title={title}
          key={index}
          isProductImage={elementType.product_image}
          isProductName={elementType.product_name}
          isProductPrice={elementType.product_price}
          isProductReview={elementType.product_review}
          isProductWishlist={elementType.product_wishlist}
          isProductAddtocart={elementType.product_addtocart}
          pageSize={elementType.max_items}
          sortBy={sortBy}
        />
      );
    }

    if (elementType.type === SLIDER) {
      let slider_data = [];
      let clickable = false;

      elementType.items.map((item, indexItem) => {
        let onPressItemData = {
          type: '',
          idOrUrl: '',
        };

        if (item.slide_link) {
          let arrayLink = item.slide_link
            .replace('{{mgzlink ', '')
            .replace('}}', '')
            .replaceAll('="', '=')
            .replaceAll('" ', ';')
            .split(';');

          arrayLink.map(link => {
            if (link.includes('type=')) {
              onPressItemData = {
                ...onPressItemData,
                type: link.replace('type=', ''),
              };
            }

            if (onPressItemData.type === CATEGORY && link.includes('id=')) {
              onPressItemData = {
                ...onPressItemData,
                idOrUrl: link.replace('id=', ''),
              };
            }

            if (onPressItemData.type === PRODUCT && link.includes('title=')) {
              onPressItemData = {
                ...onPressItemData,
                idOrUrl: link
                  .replace('title=', '')
                  .replaceAll(' ', '-')
                  .toLowerCase(),
              };
            }
          });
        }

        slider_data.push({
          image_id: indexItem,
          image_url: Config.MEDIA + item.image,
          url_redirection: '',
          isPressableItem: item.slide_link ? true : false,
          onPressItemData: onPressItemData,
        });
      });

      return (
        <WidgetSliderBanner
          key={index}
          data={slider_data}
          autoplay={true}
          autoplayInterval={parseInt(elementType.owl_autoplay_timeout)}
          clickable={clickable}
          pagination={elementType.owl_dots}
        />
      );
    }

    if (elementType.type === CATEGORIES) {
      return <WidgetSliderCategory key={index} />;
    }

    return <React.Fragment key={index} />;
  });
};

const MagezonType = ({content, refreshing, onRefresh}) => {
  let magezon_content = content
    .replace('[mgz_pagebuilder]', '')
    .replace('[/mgz_pagebuilder]', '');

  magezon_content = JSON.parse(magezon_content);

  if (pageBuilder.navbar) {
    return (
      <SafeAreaView>
        <NavBar
          type={TYPE_NAVBAR_CUSTOM}
          useLogo
          childrenRight={<AtomNavBarRight />}
        />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.containerScroll}>
          <RenderElements elements={magezon_content.elements} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return <RenderElements elements={magezon_content.elements} />;
};

MagezonType.propTypes = {
  // content
  content: PropTypes.any,
  // refreshing
  refreshing: PropTypes.any,
  // funct refresh
  onRefresh: PropTypes.func,
};

export default MagezonType;
