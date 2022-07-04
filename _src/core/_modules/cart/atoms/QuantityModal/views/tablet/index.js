import React from 'react';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {useReactiveVar} from '@apollo/client';
import {Button, Colors as ColorsPaper} from 'react-native-paper';
import Label from '@app/components/Label';
import {KeyboardAvoidingView, Modal, StyleSheet, TextInput} from 'react-native';
import Section from '@app/components/Section';
import Icon from 'react-native-vector-icons/AntDesign';
import {rxUserTheme} from '@app/services/cache';
import i18next from 'i18next';
import PropTypes from 'prop-types';

const QuantityModal = ({
  visible = true,
  name,
  quantity = 0,
  onChangeQuantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onSubmit,
  submitLabel = i18next.t('cart.quantity_modal.label.submit'),
  loading,
  onBackBackButtonPress,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const color = getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK;
  return (
    <Modal visible={visible} transparent onRequestClose={onBackBackButtonPress}>
      <Section backgroundColor="rgba(0, 0, 0, 0.6)">
        <Section height={Mixins.MAX_HEIGHT * 0.65} />
        <KeyboardAvoidingView behavior="position">
          <Section
            backgroundColor={ColorsPaper.white}
            paddingBottom={10}
            horizontalCenter
            verticalCenter
            height={Mixins.MAX_HEIGHT * 0.35}
            width={Mixins.MAX_WIDTH}>
            <Section
              marginHorizontal={30}
              style={styles.closeBtnContainer}
              onPress={onBackBackButtonPress}>
              <Icon name="close" size={normalize(20)} />
            </Section>
            <Label large style={{marginBottom: normalize(5)}}>
              {name}
            </Label>
            <Label style={{marginBottom: normalize(5)}}>
              {i18next.t('cart.quantity_modal.view.quantity')}
            </Label>

            <Section
              row
              horizontalCenter
              verticalCenter
              spaceBetween
              width={100}
              marginVertical={20}>
              <Section onPress={onDecreaseQuantity}>
                <Icon name="minuscircleo" size={normalize(20)} color={color} />
              </Section>

              <TextInput
                value={quantity.toString()}
                onChangeText={onChangeQuantity}
                keyboardType="number-pad"
                style={[
                  styles.quantityInput,
                  {
                    color: color,
                    borderColor: color,
                  },
                ]}
              />

              <Section onPress={onIncreaseQuantity}>
                <Icon name="pluscircleo" size={normalize(20)} color={color} />
              </Section>
            </Section>

            <Button
              loading={loading}
              mode="contained"
              onPress={() => onSubmit()}>
              <Label color={ColorsPaper.white}>{submitLabel}</Label>
            </Button>
          </Section>
        </KeyboardAvoidingView>
      </Section>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeBtnContainer: {
    alignSelf: 'flex-end',
  },
  quantityInput: {
    borderBottomWidth: 1,
    textAlign: 'center',
    fontSize: normalize(16),
  },
});

QuantityModal.prototype = {
  // modal state
  visible: PropTypes.bool,
  // name in label
  name: PropTypes.string,
  // quantity
  quantity: PropTypes.number,
  // function change qty from input
  onChangeQuantity: PropTypes.func,
  // function to increase qty
  onIncreaseQuantity: PropTypes.func,
  // function to decrease qty
  onDecreaseQuantity: PropTypes.func,
  // function submit
  onSubmit: PropTypes.func,
  // submit text
  submitLabel: PropTypes.string,
  // loading state for button
  loading: PropTypes.bool,
  // back function
  onBackBackButtonPress: PropTypes.func,
};

export default QuantityModal;
