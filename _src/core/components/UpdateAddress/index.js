import React, {useEffect, useState} from 'react';
import {invalidPhone, invalidZip} from '@app/helpers/Validation';
import {useTextInputValidator} from '@app/hooks/useTextInputValidator';
import {rxAppSnackbar} from '@app/services/cache';
import PropTypes from 'prop-types';
import AddressForm from '@app/components/AddressForm';

const UpdateAddress = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  // const [addressId, setAddressId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [countryId, setCountryId] = useState('ID');
  const [regionName, setRegionName] = useState('');
  const [regionCode, setRegionCode] = useState('');
  const [regionId, setRegionId] = useState(null);
  const [city, setCity] = useState('');
  const [location, setLocation] = useState({
    longitude: '0',
    latitude: '0',
  });
  const [postCode, setPostCode] = useState('');
  const [telephone, setTelephone] = useState('');
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);

  const [formError, validateTextInput] = useTextInputValidator();

  useEffect(() => {
    if (route.params.addressData) {
      const address = route.params.addressData;
      // setAddressId(address.addressId);
      setFirstName(address.firstname);
      setLastName(address.lastname);
      setStreet(address.street);
      setCountryId(address.country_id);
      setRegionName(address.region);
      setRegionCode(address.region_code);
      setRegionId(address.region_id);
      setCity(address.city);
      setPostCode(address.postcode);
      setTelephone(address.telephone);
      setDefaultBilling(address.default_billing);
      setDefaultShipping(address.default_shipping);
      setLocation({
        latitude: parseFloat(address.custom_attributes[0].value),
        longitude: parseFloat(address.custom_attributes[1].value),
      });
    }
  }, [route]);

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
    try {
      setLoading(true);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      rxAppSnackbar({message: error.graphQLErrors[0].message});
      setLoading(false);
    }
  };

  return (
    <AddressForm
      loading={loading}
      onSaveAddress={onSaveAddress}
      formError={formError}
      //
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
      //
    />
  );
};

UpdateAddress.propTypes = {
  // navigation
  navigation: PropTypes.any,
  // route
  route: PropTypes.any,
};

export default UpdateAddress;
