import React from 'react';
import {IS_IOS} from '@app/helpers/Constants';
import {Colors} from '@app/styles';
import {Image} from 'react-native';
import {checkIcon} from '@app/components/CategorySlider/views/tablet';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';

import CategorySlider from '@app/components/CategorySlider';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Foundation';
import styles from '@app/components/PageBuilder/atoms/WidgetSliderCategory/views/tablet/styles';

const WidgetSliderCategory = ({data}) => {
  if (!data) {
    return <CategorySlider />;
  }

  const dataLength = data?.length || 0;
  const dataItemWidth = 100 / dataLength;
  /**
   * ----------------------------------------- *
   * @function onNavigateToProductList
   * @param {object} item
   * @summary navigate to product list
   * ----------------------------------------- *
   */
  const onNavigateToProductList = (categoryIdParam, categoryNameParam) => {
    navigateTo(modules.main_categories.enable, modules.main_categories.name, {
      variables: {
        type: 'category',
        categoryId: categoryIdParam,
        categoryName: categoryNameParam,
      },
    });
  };
  if (!IS_IOS) {
    return <CategorySlider categorySliderData={data} />;
  }
  return (
    <Section row horizontalCenter marginBottom={30}>
      {data.map((item, index) => {
        if (item.level !== 2 || item.include_in_menu) {
          const imageSourceCondition = item.category_icon !== null;
          const iconName = checkIcon(item.name);
          return (
            <Section
              key={'category-' + index}
              onPress={() => onNavigateToProductList(item.id)}
              style={styles.categoryImageContainer}
              width={`${dataItemWidth}%`}>
              <Show when={imageSourceCondition}>
                <FastImage
                  key={item.id}
                  style={styles.categoryImage}
                  source={{
                    uri: item.category_icon,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </Show>
              <Show when={!imageSourceCondition && iconName}>
                <Section
                  horizontalCenter
                  verticalCenter
                  style={styles.categoryImage}>
                  <Icon name={iconName} size={40} color={Colors.WHITE} />
                </Section>
              </Show>
              <Show when={!imageSourceCondition && !iconName}>
                <Image
                  source={require('@app/assets/images/placeholder.png')}
                  style={styles.categoryImage}
                />
              </Show>
              <Label style={styles.categoryTitle}>{item.name}</Label>
            </Section>
          );
        }
      })}
    </Section>
  );
};

WidgetSliderCategory.propTypes = {
  // data
  data: PropTypes.any,
};

export default WidgetSliderCategory;
