import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {Mixins} from '@app/styles';
import {FlatList, Modal, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import Input from '@app/components/Input';
import NavBar from '@app/components/NavBar';
import Label from '@app/components/Label';
import {TYPE_NAVBAR_CUSTOM, TYPE_INPUT_CUSTOM} from '@app/helpers/Constants';

const LocationModal = ({
  visible = false,
  list,
  title = '',
  onSelectItem,
  onBackBackButtonPress,
}) => {
  const [searchText, setSearchText] = useState('');
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    if (list) {
      setResultList(list);
    }
  }, [list]);

  useEffect(() => {
    if (searchText === '') {
      setResultList(list);
    } else {
      let newResult = list.filter(item => {
        return item.name.toLowerCase().search(searchText.toLowerCase()) !== -1;
      });
      setResultList(newResult);
    }
  }, [searchText]);

  const renderItem = ({item}) => {
    return (
      <Section
        horizontalStart
        onPress={() => onSelectItem(item)}
        height={40}
        width={Mixins.MAX_WIDTH}
        paddingHorizontal={20}>
        <Label>{typeof item === 'string' ? item : item.name}</Label>
      </Section>
    );
  };

  return (
    <Modal visible={visible} onRequestClose={onBackBackButtonPress}>
      {/* TODO : fix -> bug : NavBar is blocked in modal, back button can't be clicked */}
      {/* temporary fix : touchable highlight */}
      <TouchableHighlight onPress={onBackBackButtonPress}>
        <NavBar
          type={TYPE_NAVBAR_CUSTOM}
          title={title}
          onBack={onBackBackButtonPress}
        />
      </TouchableHighlight>
      <Section flex horizontalStart verticalCenter>
        <Input
          type={TYPE_INPUT_CUSTOM}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          style={{flex: 1}}
          data={resultList}
          renderItem={renderItem}
          keyExtractor={item => item.name}
          ListEmptyComponent={<ActivityIndicator />}
        />
      </Section>
    </Modal>
  );
};

LocationModal.propTypes = {
  // modal visibility
  visible: PropTypes.bool,
  // list
  list: PropTypes.any,
  // navbar title
  title: PropTypes.string,
  // func select
  onSelectItem: PropTypes.func,
  // func close / back
  onBackBackButtonPress: PropTypes.func,
};

export default LocationModal;
