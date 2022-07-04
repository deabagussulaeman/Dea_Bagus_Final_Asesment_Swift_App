import React, {useState} from 'react';
import {useReactiveVar} from '@apollo/client';
import PropTypes from 'prop-types';
import {invalidPhone, invalidZip} from '@app/helpers/Validation';
import {useTextInputValidator} from '@app/hooks/useTextInputValidator';
import {rxAppSnackbar, rxUserType} from '@app/services/cache';
import AddressForm from '@app/components/AddressForm';

const AddAddress = ({navigation}) => {
  const getRxUserType = useReactiveVar(rxUserType);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [countryId, setCountryId] = useState('ID');
  const [regionName, setRegionName] = useState('');
  const [regionCode, setRegionCode] = useState('');
  const [regionId, setRegionId] = useState(null);
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [telephone, setTelephone] = useState('');
  const [location, setLocation] = useState({
    longitude: '0',
    latitude: '0',
  });
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);

  const [formError, validateTextInput] = useTextInputValidator();

  // End of TODO

  const onSetPhone = text => {
    validateTextInput(
      text,
      'phone',
      setTelephone,
      invalidPhone,
      'Invalid Phone',
    );
  };

  const onSetPostCode = text => {
    validateTextInput(
      text,
      'postCode',
      setPostCode,
      invalidZip,
      'Invalid Post Code',
    );
  };

  const onSaveAddress = async () => {
    if (getRxUserType === 'guest') {
      try {
        setLoading(true);
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        console.log('HERE', error);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        rxAppSnackbar({message: error.graphQLErrors[0].message});
        setLoading(false);
      }
    }
  };

  return (
    <AddressForm
      loading={loading}
      onSaveAddress={onSaveAddress}
      formError={formError}
      firstName={firstName}
      onSetFirstname={setFirstName}
      lastName={lastName}
      onSetLastName={setLastName}
      street={street}
      onSetStreet={setStreet}
      countryId={countryId}
      onSetCountryId={setCountryId}
      regionName={regionName}
      onSetRegionName={setRegionName}
      regionId={regionId}
      onSetRegionId={setRegionId}
      regionCode={regionCode}
      onSetRegionCode={setRegionCode}
      city={city}
      onSetCity={setCity}
      location={location}
      setLocation={setLocation}
      postCode={postCode}
      onSetPostCode={onSetPostCode}
      telephone={telephone}
      onSetTelephone={onSetPhone}
      defaultBilling={defaultBilling}
      onSetDefaultBilling={() => setDefaultBilling(!defaultBilling)}
      defaultShipping={defaultShipping}
      onSetDefaultShipping={() => setDefaultShipping(!defaultShipping)}
    />
  );
};

AddAddress.propTypes = {
  // navigation
  navigation: PropTypes.any,
};

export default AddAddress;
