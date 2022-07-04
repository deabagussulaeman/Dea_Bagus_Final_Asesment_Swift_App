import React from 'react';
import {Colors, Mixins} from '@app/styles';
import {Modal, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Section from '@app/components/Section';
import Icon from 'react-native-vector-icons/AntDesign';
import i18next from 'i18next';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import Accordion from '@app/components/Accordion';
import CheckBox from '@app/_modules/product_list/atoms/Checkbox';
import _ from 'lodash';
import {CATEGORY_ID} from '@app/helpers/Constants';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';

const QuantityModal = ({
  visible = true,
  dataFilter,
  onBackBackButtonPress,
  filters,
  setFilters,
  onApplyFilter,
  onClearFilter,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  /**
   * ----------------------------------------- *
   * @function onPressCheckbox
   * @summary  add filter data
   * ----------------------------------------- *
   */
  const onPressCheckbox = ({item, option}) => {
    let tmpFilter = filters;
    if (
      tmpFilter[item.attribute_code]?.length > 0 &&
      tmpFilter[item.attribute_code]?.find(filter => filter === option.value)
    ) {
      const index = tmpFilter[item.attribute_code]?.findIndex(
        filter => filter === option.value,
      );
      tmpFilter[item.attribute_code]?.splice(index, 1);
      setFilters(tmpFilter);
    } else {
      tmpFilter[item.attribute_code]?.push(option.value);
      setFilters(tmpFilter);
    }
  };

  /**
   * ----------------------------------------- *
   * @function RenderItem
   * @summary render available filter data
   * ----------------------------------------- *
   */
  const RenderItem = ({item}) => {
    const {attribute_code} = item;
    return (
      <Section>
        <Show when={item.count !== 0 && attribute_code !== CATEGORY_ID}>
          <Section
            paddingHorizontal={20}
            paddingBottom={10}
            borderColor={
              getRxUserTheme === 'dark' ? Colors.BLACK : Colors.GRAY_LIGHT
            }
            style={{borderBottomWidth: 1}}>
            <Accordion item={item}>
              {item?.options?.map(option => (
                <Section row horizontalCenter key={option.value}>
                  <CheckBox
                    checkedColor={Colors.PRIMARY}
                    selected={filters[attribute_code]?.find(
                      filter => filter === option.value,
                    )}
                    onPress={() => onPressCheckbox({item, option})}
                    size={20}
                  />
                  <Label medium style={{marginLeft: 10}}>
                    {_.startCase(option.label)}
                  </Label>
                </Section>
              ))}
            </Accordion>
          </Section>
        </Show>
      </Section>
    );
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onBackBackButtonPress}>
      <Section
        height={Mixins.MAX_HEIGHT}
        paddingBottom={100}
        backgroundColor={
          getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE
        }>
        <SafeAreaView edges={['top']} />
        <Section
          row
          spaceBetween
          padding={20}
          borderColor={
            getRxUserTheme === 'dark' ? Colors.BLACK : Colors.GRAY_LIGHT
          }
          style={{borderBottomWidth: 1}}>
          <Label bold xlarge style={{textTransform: 'uppercase'}}>
            {i18next.t('product_list.view.filterAndSort')}
          </Label>
          <Icon onPress={onBackBackButtonPress} name="close" size={25} />
        </Section>
        <Section paddingBottom={60}>
          <FlatList
            renderItem={RenderItem}
            data={dataFilter}
            keyExtractor={item => {
              return item.attribute_code;
            }}
          />
        </Section>
        <Section
          backgroundColor={
            getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE
          }
          verticalCenter
          width="100%"
          borderColor={
            getRxUserTheme === 'dark' ? Colors.BLACK : Colors.GRAY_LIGHT
          }
          height={100}
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            borderTopWidth: 1,
          }}>
          <Section row spaceBetween padding={20} marginBottom={10}>
            <Section
              backgroundColor={Colors.PRIMARY}
              paddingVertical={10}
              borderRadius={5}
              paddingHorizontal={20}
              onPress={() => onApplyFilter()}>
              <Label xlagre color={Colors.WHITE}>
                {i18next.t('product_list.view.apply')}
              </Label>
            </Section>
            <Section
              horizontalCenter
              verticalCenter
              onPress={() => onClearFilter()}>
              <Label color={Colors.PRIMARY} underline>
                {i18next.t('product_list.view.clearAll')}
              </Label>
            </Section>
          </Section>
        </Section>
      </Section>
    </Modal>
  );
};

export default QuantityModal;
