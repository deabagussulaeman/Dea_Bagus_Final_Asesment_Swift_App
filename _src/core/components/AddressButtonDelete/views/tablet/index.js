import React, {useState} from 'react';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {ActivityIndicator} from 'react-native-paper';
import {DELETE_ADDRESS} from '@app/_modules/account/services/schema';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';
import {Colors} from '@app/styles';
import {DARK} from '@app/helpers/Constants';

const AddressButtonDelete = ({addressId, styleProp = {}}) => {
  const [loading, setLoading] = useState(false);
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const {onRefetchData: deleteAddressHook} = useCustomMutation({
    schema: DELETE_ADDRESS,
  });

  const onDeleteAddress = async () => {
    try {
      setLoading(true);
      await deleteAddressHook({
        params: {
          id: addressId,
        },
        paramsOpt: {isReturn: true},
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Section
          onPress={onDeleteAddress}
          borderColor={getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK}
          borderRadius={15}
          paddingHorizontal={10}
          paddingVertical={3}
          style={[styleProp]}>
          <Label small>Del</Label>
        </Section>
      )}
    </>
  );
};

AddressButtonDelete.propTypes = {
  // id address
  addressId: PropTypes.number,
  // style props
  styleProp: PropTypes.object,
};

export default AddressButtonDelete;
