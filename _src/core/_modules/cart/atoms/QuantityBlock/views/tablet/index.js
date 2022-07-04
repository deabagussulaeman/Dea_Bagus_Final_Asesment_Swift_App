import React from 'react';
import {Colors} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import Label from '@app/components/Label';
import {StyleSheet, TextInput} from 'react-native';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';

const QuantityBlock = ({
  name,
  quantity = 0,
  onChangeQuantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  return (
    <Section
      flex
      horizontalCenter
      verticalCenter
      backgroundColor={Colors.WHITE}
      style={styles.quantityContainer}>
      <Section style={styles.quantityWrapper}>
        <Section flex verticalCenter horizontalCenter>
          <Label
            size={normalize(20)}
            onPress={onDecreaseQuantity}
            style={styles.quantityInput}
            color={Colors.PRIMARY}>
            -
          </Label>
        </Section>
        <TextInput
          size={normalize(20)}
          value={quantity.toString()}
          onChangeText={onChangeQuantity}
          keyboardType="number-pad"
          style={styles.numberInput}
        />
        <Section flex verticalCenter horizontalCenter>
          <Label
            size={normalize(20)}
            onPress={onIncreaseQuantity}
            style={styles.quantityInput}
            color={Colors.PRIMARY}>
            +
          </Label>
        </Section>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    borderWidth: 2,
    borderColor: '#DFDFDF',
    flex: 1,
    paddingHorizontal: normalize(25),
  },
  quantityWrapper: {
    borderWidth: 3,
    borderColor: '#DFDFDF',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: normalize(4),
    marginVertical: normalize(5),
  },
  closeBtnContainer: {
    alignSelf: 'flex-end',
  },
  quantityInput: {
    display: 'flex',
    borderColor: '#DFDFDF',
    paddingHorizontal: normalize(14),
    textAlign: 'center',
    fontWeight: 'normal',
  },
  numberInput: {
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#DFDFDF',
    paddingHorizontal: normalize(20),
    textAlign: 'center',
    fontSize: normalize(16),
  },
});

QuantityBlock.propTypes = {
  // name
  name: PropTypes.any,
  // as a value in text Input
  quantity: PropTypes.number,
  // function to change text input
  onChangeQuantity: PropTypes.func,
  // function to increase qty
  onIncreaseQuantity: PropTypes.func,
  // function to decrease qty
  onDecreaseQuantity: PropTypes.func,
};

export default QuantityBlock;
