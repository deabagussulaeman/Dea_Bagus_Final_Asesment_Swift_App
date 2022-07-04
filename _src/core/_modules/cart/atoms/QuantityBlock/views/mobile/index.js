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
      horizontalCenter
      verticalCenter
      backgroundColor={Colors.WHITE}
      style={styles.quantityContainer}>
      <Section style={styles.quantityWrapper}>
        <Section verticalCenter horizontalCenter>
          <Label
            center
            onPress={onDecreaseQuantity}
            style={styles.quantityInput}
            color={Colors.PRIMARY}>
            -
          </Label>
        </Section>
        <TextInput
          value={quantity.toString()}
          onChangeText={onChangeQuantity}
          keyboardType="number-pad"
          style={styles.numberInput}
        />
        <Section verticalCenter horizontalCenter>
          <Label
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
    borderWidth: 1,
    borderColor: '#DFDFDF',
    flex: 1,
  },
  quantityWrapper: {
    display: 'flex',
    borderWidth: 3,
    borderColor: '#DFDFDF',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    marginVertical: normalize(5),
  },
  closeBtnContainer: {
    alignSelf: 'flex-end',
  },
  quantityInput: {
    borderColor: '#DFDFDF',
    paddingHorizontal: normalize(14),
    fontWeight: 'bold',
  },
  numberInput: {
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#DFDFDF',
    paddingHorizontal: normalize(20),
    textAlign: 'center',
    fontSize: normalize(21),
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
