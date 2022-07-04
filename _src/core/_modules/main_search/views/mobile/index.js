import React from 'react';
import {FlatList} from 'react-native';
import {TouchableRipple, ActivityIndicator} from 'react-native-paper';
import {modules} from '@root/swift.config';
import Label from '@app/components/Label';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import styles from '@app/_modules/main_search/views/mobile/styles';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

/**
 * ---------------------------------------------------- *
 * @components Views
 * @summary this is expample views
 * ---------------------------------------------------- *
 */
const MainSearchMobileView = ({
  data,
  loading,
  searchText,
  onSearchTextChange,
  onNavigateProductDetail,
}) => {
  if (!modules.main_search.enable) {
    return null;
  }
  return (
    <Section>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        useBack
        useSearch
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        searchInputStyle={{height: 33, paddingVertical: 5, marginVertical: 2}}
      />
      <Show when={loading}>
        <ActivityIndicator style={{marginTop: 50}} />
      </Show>
      <Show when={!loading}>
        <FlatList
          style={styles.resultContainer}
          data={data?.data?.products?.items || []}
          keyExtractor={item => item.name}
          renderItem={({item}) => {
            const getFinalPrice = item?.price_range?.maximum_price?.final_price;
            return (
              <TouchableRipple onPress={() => onNavigateProductDetail(item)}>
                <Section style={styles.resultItemContainer}>
                  <Section>
                    <FastImage
                      key={item.url_key}
                      style={styles.resultImage}
                      resizeMode={FastImage.resizeMode.contain}
                      source={{
                        uri: item.small_image.url,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                      }}
                    />
                  </Section>
                  <Section>
                    <Label style={{marginHorizontal: 15, fontWeight: 'bold'}}>
                      {item.name}
                    </Label>
                    <Label style={{marginHorizontal: 15}}>
                      {getFinalPrice.currency} {getFinalPrice.value}
                    </Label>
                  </Section>
                </Section>
              </TouchableRipple>
            );
          }}
        />
      </Show>
    </Section>
  );
};

MainSearchMobileView.propTypes = {
  // use for handler loading
  loading: PropTypes.bool.isRequired,
  // data for search result to display
  // data: PropTypes.array.isRequired,
  // event for search text change
  onSearchTextChange: PropTypes.func.isRequired,
  // event to navigate to product detail
  onNavigateProductDetail: PropTypes.func,
  // text to search
  searchText: PropTypes.string,
};

export default MainSearchMobileView;
