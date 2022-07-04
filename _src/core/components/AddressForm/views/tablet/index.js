import Button from '@app/components/Button';
import CheckBox from '@app/components/CheckBox';
import Input from '@app/components/Input';
import Loader from '@app/components/Loader';
import NavBar from '@app/components/NavBar';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import {normalize} from '@app/styles/mixins';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import LocationModal from '@app/components/LocationModal';
import PinPoint from '@app/components/PinPoint';
import styles from '@app/components/AddressForm/views/tablet/styles';
import {TYPE_NAVBAR_CUSTOM, TYPE_INPUT_CUSTOM} from '@app/helpers/Constants';

const AddressFormView = ({
  loading = false,
  formError = {},

  firstName = '',
  onSetFirstname,
  lastName = '',
  onSetLastName,
  street = '',
  onSetStreet,
  regionName = '',
  postCode = '',
  onSetPostCode,
  telephone = '',
  onSetTelephone,
  defaultBilling = false,
  onSetDefaultBilling,
  defaultShipping = false,
  onSetDefaultShipping,
  onSaveAddress,

  countryModal,
  regionModal,
  pinPointModal,
  countryList,
  regionList,
  countryName,
  location,
  onSelectLocation,

  onOpenCountryModal,
  onSelectCountry,
  setCountryModal,
  onOpenRegionModal,
  onSelectRegion,
  setRegionModal,
  onOpenPinPointModal,
  setPinPointModal,

  //
  selectedKabupaten,
  kabupatenModal,
  kabupatenList = [],
  onSelectKabupaten,
  setKabupatenModal,
  onOpenKabupatenModal,
  //
  selectedKecamatan,
  kecamatanModal,
  kecamatanList = [],
  onSelectKecamatan,
  setKecamatanModal,
  onOpenKecamatanModal,
  //
  selectedKelurahan,
  kelurahanModal,
  kelurahanList = [],
  onSelectKelurahan,
  setKelurahanModal,
  onOpenKelurahanModal,
}) => {
  const {t} = useTranslation();

  return (
    <Section horizontalCenter verticalCenter flex>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={t('account.menu.addressInformation')}
      />
      <Loader loading={loading} />
      <ScrollView style={styles.subContainer}>
        <Input
          type={TYPE_INPUT_CUSTOM}
          label="First Name"
          placeholder={t('textPlaceholder.firstName')}
          value={firstName}
          onChangeText={onSetFirstname}
        />
        <Input
          type={TYPE_INPUT_CUSTOM}
          label="Last Name"
          placeholder={t('textPlaceholder.lastName')}
          value={lastName}
          onChangeText={onSetLastName}
        />
        <Input
          type={TYPE_INPUT_CUSTOM}
          label="Street Address"
          placeholder={t('textPlaceholder.address')}
          value={street}
          onChangeText={onSetStreet}
        />
        <Section onPress={onOpenCountryModal}>
          <Input
            type={TYPE_INPUT_CUSTOM}
            value={countryName}
            label="Country"
            placeholder={t('textPlaceholder.country')}
            editable={false}
          />
        </Section>
        <Section onPress={onOpenRegionModal}>
          <Input
            type={TYPE_INPUT_CUSTOM}
            value={regionName}
            label="State/Province"
            placeholder={t('textPlaceholder.state')}
            editable={false}
          />
        </Section>
        <Section onPress={onOpenKabupatenModal}>
          <Input
            type={TYPE_INPUT_CUSTOM}
            value={selectedKabupaten}
            label="Kabupaten"
            placeholder={t('textPlaceholder.kabupaten')}
            editable={false}
          />
        </Section>
        <Show when={kecamatanList?.length || selectedKecamatan}>
          <Section onPress={onOpenKecamatanModal}>
            <Input
              type={TYPE_INPUT_CUSTOM}
              value={selectedKecamatan}
              label="Kecamatan"
              placeholder={t('textPlaceholder.kecamatan')}
              editable={false}
            />
          </Section>
        </Show>
        <Show when={kelurahanList?.length || selectedKelurahan}>
          <Section onPress={onOpenKelurahanModal}>
            <Input
              type={TYPE_INPUT_CUSTOM}
              value={selectedKelurahan}
              label="Kelurahan"
              placeholder={t('textPlaceholder.kelurahan')}
              editable={false}
            />
          </Section>
        </Show>
        <Section horizontalCenter verticalCenter onPress={onOpenPinPointModal}>
          <Label center underline style={styles.pinPointButtonText}>
            {`${
              location && location.latitude
                ? t('label.changePin')
                : t('label.addPin')
            }`}
          </Label>
        </Section>
        <Input
          type={TYPE_INPUT_CUSTOM}
          label="Zip/Postal Code"
          placeholder={t('textPlaceholder.zip')}
          value={postCode}
          onChangeText={onSetPostCode}
          error={formError.postCode}
          keyboardType="number-pad"
        />
        <Input
          type={TYPE_INPUT_CUSTOM}
          label="Mobile Phone"
          placeholder={t('textPlaceholder.phone')}
          value={telephone}
          onChangeText={onSetTelephone}
          error={formError.phone}
          keyboardType="phone-pad"
        />

        <Section row>
          <Section
            onPress={onSetDefaultBilling}
            style={styles.defaultAddressSubContainer}>
            <CheckBox selected={defaultBilling} />
            <Label style={styles.defaultAddressText}>
              {t('account_add_address.label.defaultBillingAddress')}
            </Label>
          </Section>
        </Section>
        <Section row>
          <Section
            onPress={onSetDefaultShipping}
            style={styles.defaultAddressSubContainer}>
            <CheckBox selected={defaultShipping} />
            <Label style={styles.defaultAddressText}>
              {t('account_add_address.label.defaultShippingAddress')}
            </Label>
          </Section>
        </Section>

        <Button
          width={normalize(120)}
          label="Save Address"
          onPress={onSaveAddress}
          styleProp={styles.saveAddressButton}
        />
      </ScrollView>

      <LocationModal
        title="Country"
        visible={countryModal}
        list={countryList}
        onSelectItem={onSelectCountry}
        onBackBackButtonPress={() => setCountryModal(false)}
      />
      <LocationModal
        title="Region"
        visible={regionModal}
        list={regionList}
        onSelectItem={onSelectRegion}
        onBackBackButtonPress={() => setRegionModal(false)}
      />
      <LocationModal
        title="Kabupaten"
        visible={kabupatenModal}
        list={kabupatenList}
        onSelectItem={onSelectKabupaten}
        onBackBackButtonPress={() => setKabupatenModal(false)}
      />
      <LocationModal
        title="Kecamatan"
        visible={kecamatanModal}
        list={kecamatanList}
        onSelectItem={onSelectKecamatan}
        onBackBackButtonPress={() => setKecamatanModal(false)}
      />
      <LocationModal
        title="Kelurahan"
        visible={kelurahanModal}
        list={kelurahanList}
        onSelectItem={onSelectKelurahan}
        onBackBackButtonPress={() => setKelurahanModal(false)}
      />
      <PinPoint
        title="Search Location..."
        visible={pinPointModal}
        dataLocation={location}
        onSelectItem={onSelectLocation}
        onBackBackButtonPress={() => setPinPointModal(false)}
      />
    </Section>
  );
};

AddressFormView.propTypes = {
  // loading state
  loading: PropTypes.bool,
  // error
  formError: PropTypes.object,
  // first name
  firstName: PropTypes.string,
  // func change fisrt name
  onSetFirstname: PropTypes.func,
  // last name
  lastName: PropTypes.string,
  // func change last name
  onSetLastName: PropTypes.func,
  // street name
  street: PropTypes.string,
  // func change street name
  onSetStreet: PropTypes.func,
  // region name
  regionName: PropTypes.string,
  // post code
  postCode: PropTypes.string,
  // set post code
  onSetPostCode: PropTypes.func,
  // telepohone
  telephone: PropTypes.string,
  // set telephone
  onSetTelephone: PropTypes.func,
  // def billing
  defaultBilling: PropTypes.bool,
  // setdef billing
  onSetDefaultBilling: PropTypes.func,
  // def shipping
  defaultShipping: PropTypes.bool,
  // set def shipping
  onSetDefaultShipping: PropTypes.func,
  // func save address
  onSaveAddress: PropTypes.func,
  // country modal
  countryModal: PropTypes.bool,
  // region modal
  regionModal: PropTypes.bool,
  // pin point modal
  pinPointModal: PropTypes.bool,
  // country list
  countryList: PropTypes.array,
  // region list
  regionList: PropTypes.array,
  // country name
  countryName: PropTypes.string,
  // location
  location: PropTypes.any,
  // func select location
  onSelectLocation: PropTypes.func,
  // func country modal
  onOpenCountryModal: PropTypes.func,
  // func select country
  onSelectCountry: PropTypes.func,
  // func country modal
  setCountryModal: PropTypes.func,
  // func region modal
  onOpenRegionModal: PropTypes.func,
  // func select region
  onSelectRegion: PropTypes.func,
  // func region modal
  setRegionModal: PropTypes.any,
  // func open pin point modal
  onOpenPinPointModal: PropTypes.func,
  // set pin point
  setPinPointModal: PropTypes.func,
  // kabupaten
  selectedKabupaten: PropTypes.string,
  // kabupaten modal
  kabupatenModal: PropTypes.bool,
  // list kabupaten
  kabupatenList: PropTypes.array,
  // select kabupaten
  onSelectKabupaten: PropTypes.func,
  // func set kabupaten
  setKabupatenModal: PropTypes.func,
  // func open modal kabupaten
  onOpenKabupatenModal: PropTypes.func,
  // kecamatan
  selectedKecamatan: PropTypes.string,
  // kecamatan modal
  kecamatanModal: PropTypes.bool,
  // list kecamatan
  kecamatanList: PropTypes.array,
  // select kecamatan
  onSelectKecamatan: PropTypes.func,
  // func set kecamatan
  setKecamatanModal: PropTypes.func,
  // func open modal kecamatan
  onOpenKecamatanModal: PropTypes.func,
  // kelurahan
  selectedKelurahan: PropTypes.string,
  // kelurahan modal
  kelurahanModal: PropTypes.bool,
  // kelurahan list
  kelurahanList: PropTypes.array,
  // select keluruahan
  onSelectKelurahan: PropTypes.func,
  // func se kelurahan
  setKelurahanModal: PropTypes.func,
  // func open modal kelurahan
  onOpenKelurahanModal: PropTypes.func,
};

export default AddressFormView;
