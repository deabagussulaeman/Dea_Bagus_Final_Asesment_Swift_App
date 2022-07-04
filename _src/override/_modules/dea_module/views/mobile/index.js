import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {SafeAreaView, ScrollView, View, FlatList, Text, Image, StyleSheet, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import Section from '@app/components/Section/index';
import styles from '@app/_modules/dea_module/views/mobile/styles';
import NavBar from '@app/components/NavBar';
import _ from 'lodash';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const Item = ({ data }) => (
  <View style={stylesCustom.item}>
    <Text>{data.name}</Text>
    <Icon name="arrow-right" size={20} /> 
  </View>
);

const DeaModuleMobileView = ({ t, category_list , onNavigateToProductList }) => {
  const renderItem = ({ item }) => (
    <Section onPress={() => onNavigateToProductList(item.id, item.name)}>
      <Item data={item} />
    </Section>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavBar type={TYPE_APPBAR} title={t('dea_module.title.name')} />
      
      <Text style={stylesCustom.title}>List Data Category Use Graphql</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Section style={{paddingHorizontal: 20, marginBottom: 10}}>
          <FlatList
            data={category_list}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

DeaModuleMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // for condition render
  category_list: PropTypes.object , 
  // function for navigate
  onNavigateToProductList: PropTypes.func
};

const stylesCustom = StyleSheet.create({
  item: {
    backgroundColor: '#D7DEEC',
    padding: 13,
    marginVertical: 3,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title:{
    fontSize: 20,
    padding: 15,
  }
});

export default DeaModuleMobileView;
