import React from 'react';
import {FlatList, Image} from 'react-native';
import PropTypes from 'prop-types';

import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Foundation';
import {useTranslation} from 'react-i18next';
import styles from '@app/components/CategorySlider/views/tablet/styles';
import {Mixins, Colors} from '@app/styles';
import {
  WHATS_NEW,
  WOMEN,
  MEN,
  GEAR,
  SALE,
  TRAINING,
} from '@app/helpers/Constants';
import Shimmer from '@app/components/_Shimmer';

/**
 * @const {checkIcon}
 * @summary this constant use for define
 * Icon Name from react-native-vector-icons at Category List
 * ---------------------------------------------------- *
 */

const checkIcon = name => {
  if (name === WHATS_NEW) {
    return 'burst-new';
  } else if (name === WOMEN) {
    return 'female';
  } else if (name === MEN) {
    return 'male';
  } else if (name === GEAR) {
    return 'widget';
  } else if (name === SALE) {
    return 'burst-sale';
  } else if (name === TRAINING) {
    return 'target';
  } else {
    return null;
  }
};

const CategorySliderView = ({loading, categories, onNavigateToProductList}) => {
  const {t} = useTranslation();

  return (
    <Section
      horizontalCenter
      verticalCenter
      height={150}
      style={styles.mainContainer}>
      <Show when={loading}>
        <Section width={Mixins.MAX_WIDTH} horizontalCenter verticalCenter>
          <Shimmer wrapperStyle={{height: 80}} />
        </Section>
      </Show>
      <Show when={!loading && categories?.length < 1}>
        <Section width={Mixins.MAX_WIDTH} horizontalCenter verticalCenter>
          <Label>{t('label.noCategoryChildren')}</Label>
        </Section>
      </Show>
      <Show when={!loading && categories?.length > 0}>
        <FlatList
          horizontal
          data={categories}
          style={styles.listContainer}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            if (item.level !== 2 || item.include_in_menu) {
              const imageSourceCondition = item.category_icon !== null;
              const iconName = checkIcon(item.name);
              return (
                <Section
                  onPress={() => onNavigateToProductList(item.id)}
                  style={styles.categoryImageContainer}>
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
                      backgroundColor={Colors.DARK}
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
                  <Label xsmall style={styles.categoryTitle}>
                    {item.name}
                  </Label>
                </Section>
              );
            }
          }}
        />
      </Show>
    </Section>
  );
};

CategorySliderView.propTypes = {
  // loading state
  loading: PropTypes.bool,
  // categories
  categories: PropTypes.any,
  // function navigate
  onNavigateToProductList: PropTypes.func,
};

export default CategorySliderView;
