import DateTimePicker from '@react-native-community/datetimepicker';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import React, {useState} from 'react';
import DateHelper from '@app/helpers/Date';
import {DARK} from '@app/helpers/Constants';
import {Colors} from '@app/styles';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import PropTypes from 'prop-types';

const DatePicker = ({label = '', mode = 'date', callback}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    callback(DateHelper.convert(currentDate, '/', {reverse: true}));
  };

  return (
    <Section
      row
      spaceBetween
      width="100%"
      paddingHorizontal={10}
      paddingVertical={10}
      horizontalCenter
      verticalCenter>
      <Label>{label}</Label>
      <Section
        borderColor={getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK}
        borderRadius={15}
        paddingVertical={5}
        paddingHorizontal={10}
        onPress={() => setShow(true)}>
        <Label>{DateHelper.convert(date, ' ', {useMonthString: true})}</Label>
      </Section>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display="default"
          onChange={onDateChange}
        />
      )}
    </Section>
  );
};

DatePicker.propTypes = {
  // label
  label: PropTypes.string,
  // mode
  mode: PropTypes.string,
  // func callback
  callback: PropTypes.func,
};

export default DatePicker;
