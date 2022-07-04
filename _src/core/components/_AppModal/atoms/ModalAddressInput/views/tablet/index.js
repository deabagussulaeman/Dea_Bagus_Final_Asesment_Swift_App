import React, {useRef, useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Typography} from '@app/styles/index';
import NavBar from '@app/components/NavBar';
import {FlatList} from 'react-native';
import {TextInput, TouchableRipple} from 'react-native-paper';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {Colors, Mixins} from '@app/styles';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import Show from '@app/components/Show';
import CheckBox from '@app/components/CheckBox';
import Button from '@app/components/Button';

const styles = StyleSheet.create({
  flex: {flex: 1},
});

const ModalAddressInput = ({
  show,
  onClose,
  title,
  dataList,
  onChange,
  onPress,
  fieldName,
  multiselect = false,
  onSaveMultiselect,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const {t} = useTranslation();
  const ref = useRef();
  const [dataFilter, setDataFilter] = useState(dataList);
  const [text, setText] = useState('');
  const labelColor = getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK;
  const backgroundColor = getRxUserTheme === 'dark' ? Colors.DARK : null;
  const [multiselectData, setMultiselectData] = useState(
    multiselect ? dataList : [],
  );
  const [multiselectDataFilter, setMultiselectDataFilter] = useState(
    multiselect ? dataList : [],
  );

  const onCheckMultiSelect = name => {
    let multiselectDataTemp = [];
    let multiselectDataFilterTemp = [];
    multiselectData.map(item => {
      if (item.name === name) {
        multiselectDataTemp.push({...item, selected: !item.selected});
      } else {
        multiselectDataTemp.push(item);
      }
    });
    multiselectDataFilter.map(item => {
      if (item.name === name) {
        multiselectDataFilterTemp.push({...item, selected: !item.selected});
      } else {
        multiselectDataFilterTemp.push(item);
      }
    });
    setMultiselectData(multiselectDataTemp);
    setMultiselectDataFilter(multiselectDataFilterTemp);
  };

  const renderItem = ({item}) => (
    <Section>
      <Show when={!multiselect}>
        <TouchableRipple
          borderless
          style={{
            padding: 10,
            margin: 5,
          }}
          onPress={() => {
            onChange(item.name);
            onPress({selected: item, fieldName: fieldName});
            onClose();
          }}>
          <Label color={labelColor}>{item.name}</Label>
        </TouchableRipple>
      </Show>
      <Show when={multiselect}>
        <Section
          row
          style={{
            padding: 10,
            margin: 5,
          }}>
          <CheckBox
            onPress={() => {
              onCheckMultiSelect(item.name);
            }}
            selected={item.selected}
          />
          <Section marginLeft={10}>
            <Label color={labelColor}>{item.name}</Label>
          </Section>
        </Section>
      </Show>
    </Section>
  );

  const emptyComponent = () => {
    return (
      <Section padding={10} margin={5}>
        <Label color={labelColor}>{t('noData')}</Label>
      </Section>
    );
  };

  const onChangeSearch = value => {
    if (multiselect) {
      let filter = multiselectData.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      setMultiselectDataFilter(filter);
    } else {
      let filter = dataList.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      setDataFilter(filter);
    }
    setText(value);
  };

  return (
    <Modal visible={show}>
      <SafeAreaView
        style={[
          styles.flex,
          {
            backgroundColor,
          },
        ]}>
        <NavBar
          type={TYPE_NAVBAR_CUSTOM}
          center
          useClose
          useWhite
          useShadow={false}
          useBackPress={onClose}
          title={title}
          titleStyle={{...Typography.FONT_BOLD, fontWeight: 'bold'}}
        />

        <TextInput
          ref={ref}
          label={t('textPlaceholder.search')}
          onChangeText={onChangeSearch}
          value={text}
        />
        <FlatList
          nestedScrollEnabled
          data={multiselect ? multiselectDataFilter : dataFilter}
          keyExtractor={item => item.name}
          renderItem={renderItem}
          ListEmptyComponent={emptyComponent}
        />
        <Show when={multiselect}>
          <Button
            label={t('label.save')}
            width={Mixins.MAX_WIDTH}
            styleProp={{
              backgroundColor: Colors.PRIMARY,
              height: 50,
            }}
            textStyleProp={{color: Colors.WHITE}}
            borderRadius={0}
            mode={'contained'}
            onPress={() => onSaveMultiselect(multiselectData)}
          />
        </Show>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalAddressInput;
