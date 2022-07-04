import React from 'react';
import {Modal, StyleSheet} from 'react-native';
import {TYPE_LIST_ADDRESS_CHECKOUT} from '@app/helpers/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import ListShippingAddress from '@app/components/ListShippingAddress';

const styles = StyleSheet.create({
  flex: {flex: 1},
});

const ModalShippingAddressList = ({show, onClose, onCallbackComponent}) => {
  return (
    <Modal visible={show}>
      <SafeAreaView style={styles.flex}>
        <ListShippingAddress
          type={TYPE_LIST_ADDRESS_CHECKOUT}
          onClose={onClose}
          onCallbackComponent={onCallbackComponent}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ModalShippingAddressList;
