import React from 'react';
import {FlatList, Image} from 'react-native';
import Label from '@app/components/Label';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import Shimmer from '@app/components/_Shimmer';
import FastImage from 'react-native-fast-image';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import styles from '@app/components/BrandSlider/views/tablet/styles';

const BrandSliderView = ({brands, loading, onNavigateToProductList}) => {
  const {t} = useTranslation();

  const ListEmptyComponent = () => {
    return <Label center>{t('label.noData')}</Label>;
  };

  return (
    <Section height={210} horizontalCenter verticalCenter>
      <Section row spaceBetween width="100%" paddingHorizontal={10}>
        <Label style={styles.headerText}>{t('label.shopByBrand')}</Label>
      </Section>
      <Show when={loading}>
        <Shimmer wrapperStyle={{height: 100}} />
      </Show>
      <Show when={!loading}>
        <FlatList
          horizontal
          data={brands}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={item => item.attribute_id.toString()}
          renderItem={({item}) => {
            const imageSourceCondition =
              item.logo !== null && item.logo !== '' && item.logo !== undefined;
            return (
              <Section
                onPress={() =>
                  onNavigateToProductList(item.attribute_id, item.name)
                }
                style={styles.brandIconContainer}>
                <Show when={imageSourceCondition}>
                  <FastImage
                    key={item.attribute_id}
                    style={styles.brandIconImage}
                    resizeMode={FastImage.resizeMode.contain}
                    source={{
                      uri: item.logo,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  />
                </Show>
                <Show when={!imageSourceCondition}>
                  <Image
                    source={require('@app/assets/images/placeholder.png')}
                    style={styles.brandIconImage}
                  />
                </Show>
                <Label small style={styles.brandIconTitle}>
                  {item.name}
                </Label>
              </Section>
            );
          }}
        />
      </Show>
    </Section>
  );
};

BrandSliderView.propTypes = {
  // data
  brands: PropTypes.any,
  // loading state
  loading: PropTypes.bool,
  // func navigate
  onNavigateToProductList: PropTypes.func,
};

export default BrandSliderView;
