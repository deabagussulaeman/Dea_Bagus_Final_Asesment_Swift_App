import React from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Mixins} from '@app/styles';

import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';

const ModalSort = ({
  show,
  data,
  selectedSort,
  onPressVisibleSort,
  onSelectSort,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const selectedIndex = selectedSort !== '' ? selectedSort : 0;
  return (
    <Modal
      visible={show}
      transparent={true}
      onRequestClose={() => onPressVisibleSort(false)}>
      <Section
        flex
        verticalCenter
        horizontalCenter
        backgroundColor={'rgba(0, 0, 0, 0.5)'}
        onPress={() => onPressVisibleSort(false)}>
        <Section
          column
          borderRadius={2}
          borderColor={
            getRxUserTheme === 'dark' ? Colors.BLACK : Colors.GRAY_LIGHT
          }
          backgroundColor={
            getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE
          }
          style={{borderWidth: 1, minWidth: Mixins.MAX_WIDTH / 2}}>
          {data.items.map((item, index) => {
            return (
              <TouchableOpacity onPress={() => onSelectSort(index)}>
                <Section
                  row
                  spaceBetween
                  padding={5}
                  borderColor={
                    getRxUserTheme === 'dark' ? Colors.BLACK : Colors.GRAY_LIGHT
                  }
                  style={{borderBottomWidth: 1}}>
                  <Label large>{item.label}</Label>
                  <Show when={selectedIndex === index}>
                    <Icon
                      name="checkmark-outline"
                      size={20}
                      color={Colors.GRAY_MEDIUM}
                      style={{marginRight: 5}}
                    />
                  </Show>
                </Section>
              </TouchableOpacity>
            );
          })}
        </Section>
      </Section>
    </Modal>
  );
};

export default ModalSort;
