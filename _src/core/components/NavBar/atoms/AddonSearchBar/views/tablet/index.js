import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, Modal} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Colors} from '@app/styles';
import {debounce} from 'lodash';
import {SEARCH_PRODUCTS} from '@app/components/NavBar/atoms/AddonSearchBar/services/schema';
import {navigateTo} from '@app/helpers/Navigation';
import {useTranslation} from 'react-i18next';
import {modules} from '@root/swift.config';
import useCustomQuery from '@app/hooks/useCustomQuery';
import Button from '@app/components/Button';
import Section from '@app/components/Section';
import InputSearch from '@app/components/NavBar/atoms/AddonSearchBar/atoms/InputSearch/index';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import FastImage from 'react-native-fast-image';
import styles from '@app/components/NavBar/atoms/AddonSearchBar/views/mobile/styles';
import AnalyticsHelper from '@app/helpers/Analytics';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const [variables, setVariables] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const {
    data: searchResultData,
    loading,
    onRefetchData,
  } = useCustomQuery({
    schema: SEARCH_PRODUCTS,
  });
  const {t} = useTranslation();

  useEffect(() => {
    const search = debounce(text => {
      setVariables({
        search: text,
        currentPage: 1,
        pageSize: 7,
        sortBy: {price: 'ASC'},
      });
    }, 100);

    if (searchText !== '') {
      search(searchText);
    } else {
      setVisible(false);
    }
  }, [searchText]);

  useEffect(() => {
    onRefetchData({params: variables});
  }, [variables]);

  useEffect(() => {
    if (searchResultData?.data?.products) {
      setSearchResult(searchResultData?.data.products.items);
      AnalyticsHelper.eventSearch(searchText.toString());
    }
  }, [searchResultData]);

  return (
    <>
      <Button
        label={t('textPlaceholder.search')}
        styleProp={styles.searchButton}
        onPress={() => setVisible(true)}
      />

      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <SafeAreaView>
          <InputSearch
            placeholder={t('textPlaceholder.search')}
            styleProp={styles.searchInput}
            textStyleProp={{paddingHorizontal: 20}}
            placeholderTextColor={Colors.BLACK}
            onChangeText={setSearchText}
            value={searchText}
            autoFocus={true}
          />
        </SafeAreaView>
        <Show when={!loading}>
          <FlatList
            style={styles.resultContainer}
            data={searchResult}
            keyExtractor={item => item.name}
            renderItem={({item}) => {
              const {
                price_range: {
                  maximum_price: {final_price},
                },
              } = item;
              return (
                <Section
                  style={styles.resultItemContainer}
                  onPress={() => {
                    navigateTo(
                      modules.product_detail.enable,
                      modules.product_detail.name,
                      {productUrlKey: item.url_key},
                    );
                    setVisible(false);
                    setSearchText('');
                    setSearchResult([]);
                  }}>
                  <FastImage
                    key={item.url_key}
                    style={styles.resultImage}
                    source={{
                      uri: item.small_image.url,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Section row spaceBetween flex>
                    <Label style={{marginHorizontal: 15}}>{item.name}</Label>
                    <Label style={{marginHorizontal: 15}}>
                      {final_price.currency} {final_price.value}
                    </Label>
                  </Section>
                </Section>
              );
            }}
          />
        </Show>
        <Show when={loading}>
          <ActivityIndicator />
        </Show>
      </Modal>
    </>
  );
};

export default SearchBar;
