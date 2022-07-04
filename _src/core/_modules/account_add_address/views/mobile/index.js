import React from 'react';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native';
import NavBar from '@app/components/NavBar';
import Forms from '@app/components/_Forms/index';
import {formSchema} from '@app/_modules/account_add_address/forms';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PinPoint from '@app/components/PinPoint';
import {FORM_FIELD, TYPE_APPBAR} from '@app/helpers/Constants';
import styles from '@app/_modules/account_add_address/views/mobile/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';

const buttonPinPoint = ({onModalOpen, selectedLocation, t}) => {
  const hasBeenSet = _.get(selectedLocation, 'pinpoint.longitude') !== '0';
  return (
    <Button
      icon={'map-marker-plus'}
      color={hasBeenSet && 'green'}
      mode={'outlined'}
      onPress={() => onModalOpen('pinpoint')}
      style={styles.button}>
      {hasBeenSet
        ? t('account_add_address.label.locationSelected')
        : t('account_add_address.label.addPinPoint')}
    </Button>
  );
};
const AddAddressMobileView = ({
  t,
  isEdit,
  onModalOpen,
  onModalClose,
  modalLocation,
  onSetPinPoint,
  onSelectLocation,
  countryList,
  regionList,
  cityList,
  subdistrictList,
  villageList,
  postCodeList,
  selectedLocation,
  onSaveAddress,
  loading,
}) => {
  const forms = formSchema({
    custom: [
      {
        name: 'country',
        label: t('account_add_address.label.country'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        onPress: onSelectLocation,
        isVisible: true,
        data: countryList,
        defaultValue: isEdit ? 'Indonesia' : '',
        autoCapitalized: 'none',
        rules: {required: 'Required'},
      },
      {
        name: 'region',
        label: t('account_add_address.label.province'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: regionList.length > 0,
        onPress: onSelectLocation,
        data: regionList,
        defaultValue: '',
        autoCapitalized: 'none',
        rules: {required: 'Required'},
      },
      {
        name: 'district',
        label: t('account_add_address.label.district'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: cityList.length > 0,
        onPress: onSelectLocation,
        data: cityList,
        defaultValue: '',
        autoCapitalized: 'none',
        rules: {required: 'Required'},
      },
      {
        name: 'subdistrict',
        label: t('account_add_address.label.subdistrict'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: subdistrictList.length > 0,
        onPress: onSelectLocation,
        data: subdistrictList,
        defaultValue: '',
        autoCapitalized: 'none',
        rules: {required: 'Required'},
      },
      {
        name: 'urbanVillage',
        label: t('account_add_address.label.urbanVillage'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: villageList.length > 0,
        onPress: onSelectLocation,
        data: villageList,
        defaultValue: '',
        autoCapitalized: 'none',
        rules: {required: 'Required'},
      },
      {
        name: 'streetAddress',
        label: t('account_add_address.label.streetAddress'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT,
        defaultValue: isEdit ? isEdit.street : '',
        autoCapitalized: 'words',
        rules: {required: 'Required'},
      },
      {
        name: 'postalCode',
        label: t('account_add_address.label.postalCode'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: postCodeList.length > 0,
        onPress: onSelectLocation,
        data: postCodeList,
        defaultValue: '',
        autoCapitalized: 'none',
        rules: {required: 'Required'},
      },
      {
        name: 'buttonPinpoint',
        type: FORM_FIELD.CUSTOM,
        renderItem: buttonPinPoint({onModalOpen, selectedLocation, t}),
      },
    ],
    defVal: isEdit,
  });

  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_APPBAR}
        title={
          isEdit
            ? t('account_add_address.title.editAddress')
            : t('account_add_address.title.addAddress')
        }
        useBack
      />
      <KeyboardAwareScrollView nestedScrollEnabled>
        <Forms
          fields={forms}
          buttonTitle={t('account_add_address.title.submit')}
          onSubmit={onSaveAddress}
          loading={loading}
        />
      </KeyboardAwareScrollView>
      <PinPoint
        title={t('account_add_address.title.searchLocation')}
        visible={modalLocation.pinpoint}
        dataLocation={''}
        onSelectItem={onSetPinPoint}
        onBackBackButtonPress={() => onModalClose('pinpoint')}
      />
    </SafeAreaView>
  );
};

AddAddressMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // condition for def Value and title
  isEdit: PropTypes.object,
  // function for open modal
  onModalOpen: PropTypes.func,
  // function for close modal
  onModalClose: PropTypes.func,
  // function for submit form
  onSaveAddress: PropTypes.func,
  // function for select item pin point
  onSetPinPoint: PropTypes.func,
  // function form
  onSelectLocation: PropTypes.func,
  // used as data and condition for isVisible in form
  cityList: PropTypes.array,
  // used as data in form
  countryList: PropTypes.array,
  // modal location
  modalLocation: PropTypes.any,
  // used as data and condition for isVisible in form
  postCodeList: PropTypes.array,
  // used as data and condition for isVisible in form
  regionList: PropTypes.array,
  // use to get pin point
  selectedLocation: PropTypes.object,
  // used as data and condition for isVisible in form
  subdistrictList: PropTypes.array,
  // used as data and condition for isVisible in form
  villageList: PropTypes.array,
  // shows loading
  loading: PropTypes.bool,
};

export default AddAddressMobileView;
