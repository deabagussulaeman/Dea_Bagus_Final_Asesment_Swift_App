import {Picker} from '@react-native-community/picker';
import React from 'react';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {useReactiveVar} from '@apollo/client';
import {Colors} from '@app/styles';
import {rxUserTheme} from '@app/services/cache';
import PropTypes from 'prop-types';

const CustomPicker = ({
  pickerData,
  selectedValue,
  setSelectedValue,
  enabled = true,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  return (
    <Section
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Label>{pickerData.name} : </Label>
      <Picker
        enabled={enabled}
        selectedValue={selectedValue}
        style={{
          height: 50,
          flex: 1,
          backgroundColor:
            getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
          color: getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK,
        }}
        itemStyle={{fontSize: 10}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        {pickerData.items.map(item => (
          <Picker.Item label={item.label} value={item.value} key={item.label} />
        ))}
      </Picker>
    </Section>
  );
};

CustomPicker.propTypes = {
  // picker data
  pickerData: PropTypes.any,
  // selected value
  selectedValue: PropTypes.any,
  // set selected value
  setSelectedValue: PropTypes.func,
  // enable
  enabled: PropTypes.bool,
};

export default CustomPicker;
