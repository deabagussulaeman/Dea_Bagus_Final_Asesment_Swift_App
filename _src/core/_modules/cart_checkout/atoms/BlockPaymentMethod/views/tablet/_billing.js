import React, {useEffect, useState, useCallback, useContext} from 'react';
import {TextInput} from 'react-native-paper';
import {onFilterCities} from '@app/components/_AppModal/atoms/ModalShippingAddressForm/index';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';
import {
  _onFormHandleResetRef,
  _onFormHandleValuesRef,
} from '@app/components/_Forms/index';
import {
  FORM_FIELD,
  TYPE_ADDRESS_FORM_COUNTRY,
  TYPE_ADDRESS_FORM_DISTRICT,
  TYPE_ADDRESS_FORM_DISTRICT_SUB,
  TYPE_ADDRESS_FORM_POSTAL,
  TYPE_ADDRESS_FORM_REGION,
  TYPE_ADDRESS_FORM_URBAN,
} from '@app/helpers/Constants';
import {useTranslation} from 'react-i18next';
import {
  GET_COUNTRY_LIST,
  GET_REGION_LIST,
  GET_CITY_LIST,
} from '@app/_modules/account/services/schema';

import Icon from 'react-native-vector-icons/Feather';
import Section from '@app/components/Section/index';
import Forms from '@app/components/_Forms/index';
import useCustomQuery from '@app/hooks/useCustomQuery';
import _ from 'lodash';

const CheckoutBillingForm = () => {
  const {t} = useTranslation();
  const ctxCheckout = useContext(CheckoutContext);
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [subdistrictList, setSubdistrictList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [postCodeList, setPostCodeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    country: null,
    region: null,
    district: null,
    subdistrict: null,
    urbanVillage: null,
    postalCode: null,
  });

  const {data: countryData} = useCustomQuery({
    schema: GET_COUNTRY_LIST,
    useInitData: true,
  });
  const {data: regionData, onRefetchData: getRegions} = useCustomQuery({
    schema: GET_REGION_LIST,
  });
  const {data: cityData, onRefetchData: getCities} = useCustomQuery({
    schema: GET_CITY_LIST,
  });

  /**
   * ---------------------------------------------------- *
   * @function getSubDistrict
   * @param {cities, include} object
   * @summary for get subdistrict from district
   * ---------------------------------------------------- *
   */
  const getSubDistrict = useCallback((cities, include = null) => {
    const tempSubdistrict = onFilterCities({
      filterBy: 'city',
      include,
      indexReturn: 1,
      cities,
    });
    const uniqSubdistrict = _.uniqBy(tempSubdistrict, 'name');
    setSubdistrictList(uniqSubdistrict);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function getUrbanVillage
   * @param {cities, include} object
   * @summary for get urban village from subdistrict
   * ---------------------------------------------------- *
   */
  const getUrbanVillage = useCallback((cities, include = null) => {
    const tempVillages = onFilterCities({
      filterBy: 'city',
      include,
      indexReturn: 2,
      cities,
    });
    const uniqVillage = _.uniqBy(tempVillages, 'name');
    setVillageList(uniqVillage);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function getPostCode
   * @param {cities, include} object
   * @summary for get postcode from urban village
   * ---------------------------------------------------- *
   */
  const getPostCode = useCallback((cities, include = null) => {
    const tempPostCode = onFilterCities({
      filterBy: 'postcode',
      include,
      indexReturn: 0,
      cities,
    });
    const uniqPostCode = _.uniqBy(tempPostCode, 'postcode');
    setPostCodeList(uniqPostCode);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @dependency [countryData]
   * @summary for get country data and regions
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (countryData && countryData.data) {
      const {full_name_locale, id} = countryData?.data.country;
      const getCountryId = {country_id: id};
      const countryListTmp = [{name: full_name_locale, ...getCountryId}];
      setCountryList(countryListTmp);
      setLoading(false);
      getRegions({params: getCountryId});
    }
  }, [countryData]);

  /**
   * ---------------------------------------------------- *
   * @dependency [regionData]
   * @summary for get regions list
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const regions = _.get(regionData, 'data.getRegions.item');
    if (regions) {
      setRegionList(regions);
    }
    setLoading(false);
  }, [regionData]);

  /**
   * ---------------------------------------------------- *
   * @dependency [cityData]
   * @summary for get city list
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const cities = _.get(cityData, 'data.getCityByRegionId.item');
    if (cities) {
      const tempCities = cities.map(item => {
        const name = _.split(item.city, ', ');
        if (name[0]) {
          return {...item, name: name[0]};
        }
      });
      const uniqCities = _.uniqBy(tempCities, 'name');
      setCityList(uniqCities);
      setLoading(false);
    }
  }, [cityData]);

  /**
   * ---------------------------------------------------- *
   * @dependency [selectedLocation.district]
   * @summary for get district value
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const cities = _.get(cityData, 'data.getCityByRegionId.item');
    const selectedDistrict = _.get(selectedLocation, 'district.name');
    if (selectedDistrict) {
      getSubDistrict(cities, selectedDistrict);
      setLoading(false);
    }
  }, [selectedLocation.district]);

  /**
   * ---------------------------------------------------- *
   * @dependency [selectedLocation.subdistrict]
   * @summary for get subdistrict value
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const cities = _.get(cityData, 'data.getCityByRegionId.item');
    const selSubdistrict = _.get(selectedLocation, 'subdistrict.name');
    if (selSubdistrict) {
      getUrbanVillage(cities, selSubdistrict);
      setLoading(false);
    }
  }, [selectedLocation.subdistrict]);

  /**
   * ---------------------------------------------------- *
   * @dependency [selectedLocation.urbanVillage]
   * @summary for get urban village & postal code
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    const cities = _.get(cityData, 'data.getCityByRegionId.item');
    const selVillage = _.get(selectedLocation, 'urbanVillage.name');
    if (selVillage) {
      getPostCode(cities, selVillage);
      setLoading(false);
    }
  }, [selectedLocation.urbanVillage]);

  /**
   * ---------------------------------------------------- *
   * @function onResetDataDropdown
   * @param {region, district, subdistrict} props
   * @param {urbanVillage, postalCode} props
   * @summary for reset input dropdown
   * ---------------------------------------------------- *
   */
  const onResetDataDropdown = useCallback(props => {
    const isResetRegion = props?.region;
    const isResetDistrict = props?.district; // city
    const isResetSubDistrict = props?.subdistrict;
    const isResetUrbanVillage = props?.urbanVillage;
    const isResetPostalCode = props?.postalCode;
    if (isResetDistrict) {
      setCityList([]);
    }
    if (isResetRegion) {
      setRegionList([]);
    }
    if (isResetSubDistrict) {
      setSubdistrictList([]);
    }
    if (isResetUrbanVillage) {
      setVillageList([]);
    }
    if (isResetPostalCode) {
      setPostCodeList([]);
    }
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function onSelectLocation
   * @param {selected, fieldName} object
   * @summary for selected location country | region | city
   * ---------------------------------------------------- *
   */
  const onSelectLocation = ({selected, fieldName}) => {
    setLoading(true);
    const valList = _.set({...selectedLocation}, fieldName, selected);
    switch (fieldName) {
      case TYPE_ADDRESS_FORM_COUNTRY:
        onResetDataDropdown({
          region: true,
          district: true,
          subdistrict: true,
          urbanVillage: true,
          postalCode: true,
        });
        getRegions({params: {country_id: selected.country_id}});
        break;
      case TYPE_ADDRESS_FORM_REGION:
        onResetDataDropdown({
          district: true,
          subdistrict: true,
          urbanVillage: true,
          postalCode: true,
        });
        getCities({params: {region_id: selected.region_id}});
        break;
      case TYPE_ADDRESS_FORM_DISTRICT:
        onResetDataDropdown({
          subdistrict: true,
          urbanVillage: true,
          postalCode: true,
        });
        break;
      case TYPE_ADDRESS_FORM_DISTRICT_SUB:
        onResetDataDropdown({
          urbanVillage: true,
          postalCode: true,
        });
        break;
      case TYPE_ADDRESS_FORM_URBAN:
        onResetDataDropdown({postalCode: true});
        break;
      case TYPE_ADDRESS_FORM_POSTAL:
        setLoading(false);
        break;
    }
    setSelectedLocation(valList);
  };

  /**
   * ---------------------------------------------------- *
   * @const {forms}
   * @summary schema for form builder
   * ---------------------------------------------------- *
   */
  const forms = [
    {
      name: 'firstName',
      label: t('cart_checkout.label.firstName'),
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      autoCapitalized: 'words',
      textContentType: 'givenName',
      rules: {required: t('formError.required.firstName')},
    },
    {
      name: 'lastName',
      label: t('cart_checkout.label.lastName'),
      textContentType: 'familyName',
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      autoCapitalized: 'words',
      rules: {required: t('formError.required.lastName')},
    },
    {
      name: 'country',
      label: t('account_add_address.label.country'),
      textContentType: 'address',
      type: FORM_FIELD.INPUT_DROPDOWN,
      data: countryList,
      autoCapitalized: 'none',
      rules: {required: t('formError.required.country')},
      onPress: onSelectLocation,
      defaultValue: '',
      isDisabled: selectedLocation.country !== null,
      inputRightCustom: selectedLocation.country !== null && (
        <TextInput.Icon
          name={() => (
            <Icon
              name={'x'}
              size={20}
              onPress={() => {
                const getValues = _onFormHandleValuesRef.current;
                const onReset = _onFormHandleResetRef.current;
                onReset({
                  ...getValues(),
                  country: null,
                  region: null,
                  district: null,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                setSelectedLocation({
                  ...selectedLocation,
                  country: null,
                  region: null,
                  district: null,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                onResetDataDropdown({
                  region: true,
                  district: true,
                  subdistrict: true,
                  urbanVillage: true,
                  postalCode: true,
                });
              }}
            />
          )}
        />
      ),
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
      rules: {required: t('formError.required.region')},
      isDisabled: selectedLocation.region !== null,
      inputRightCustom: selectedLocation.region !== null && (
        <TextInput.Icon
          name={() => (
            <Icon
              name={'x'}
              size={20}
              onPress={() => {
                const getValues = _onFormHandleValuesRef.current;
                const onReset = _onFormHandleResetRef.current;
                onReset({
                  ...getValues(),
                  region: null,
                  district: null,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                setSelectedLocation({
                  ...selectedLocation,
                  region: null,
                  district: null,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                onResetDataDropdown({
                  district: true,
                  subdistrict: true,
                  urbanVillage: true,
                  postalCode: true,
                });
              }}
            />
          )}
        />
      ),
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
      rules: {required: t('formError.required.district')},
      isDisabled: selectedLocation.district !== null,
      inputRightCustom: selectedLocation.district !== null && (
        <TextInput.Icon
          name={() => (
            <Icon
              name={'x'}
              size={20}
              onPress={() => {
                const getValues = _onFormHandleValuesRef.current;
                const onReset = _onFormHandleResetRef.current;
                onReset({
                  ...getValues(),
                  district: null,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                setSelectedLocation({
                  ...selectedLocation,
                  district: null,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                onResetDataDropdown({
                  subdistrict: true,
                  urbanVillage: true,
                  postalCode: true,
                });
              }}
            />
          )}
        />
      ),
    },
    {
      name: 'subdistrict',
      label: t('account_add_address.label.subdistrict'),
      textContentType: 'address',
      type: FORM_FIELD.INPUT_DROPDOWN,
      isVisible: subdistrictList?.length && subdistrictList?.length > 0,
      onPress: onSelectLocation,
      data: subdistrictList,
      defaultValue: '',
      autoCapitalized: 'none',
      rules: {required: t('formError.required.subDistrict')},
      isDisabled: selectedLocation.subdistrict !== null,
      inputRightCustom: selectedLocation.subdistrict !== null && (
        <TextInput.Icon
          name={() => (
            <Icon
              name={'x'}
              size={20}
              onPress={() => {
                const getValues = _onFormHandleValuesRef.current;
                const onReset = _onFormHandleResetRef.current;
                onReset({
                  ...getValues(),
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                setSelectedLocation({
                  ...selectedLocation,
                  subdistrict: null,
                  urbanVillage: null,
                  postalCode: null,
                });
                onResetDataDropdown({
                  urbanVillage: true,
                  postalCode: true,
                });
              }}
            />
          )}
        />
      ),
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
      rules: {required: t('formError.required.urbanVillage')},
      isDisabled: selectedLocation.urbanVillage !== null,
      inputRightCustom: selectedLocation.urbanVillage !== null && (
        <TextInput.Icon
          name={() => (
            <Icon
              name={'x'}
              size={20}
              onPress={() => {
                const getValues = _onFormHandleValuesRef.current;
                const onReset = _onFormHandleResetRef.current;
                onReset({
                  ...getValues(),
                  urbanVillage: null,
                  postalCode: null,
                });
                setSelectedLocation({
                  ...selectedLocation,
                  urbanVillage: null,
                  postalCode: null,
                });
                onResetDataDropdown({postalCode: true});
              }}
            />
          )}
        />
      ),
    },
    {
      name: 'streetAddress',
      label: t('account_add_address.label.streetAddress'),
      textContentType: 'address',
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      autoCapitalized: 'words',
      rules: {required: t('formError.required.address')},
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
      rules: {required: t('formError.required.postalCode')},
      isDisabled: selectedLocation.postalCode !== null,
      inputRightCustom: selectedLocation.postalCode !== null && (
        <TextInput.Icon
          name={() => (
            <Icon
              name={'x'}
              size={20}
              onPress={() => {
                const getValues = _onFormHandleValuesRef.current;
                const onReset = _onFormHandleResetRef.current;
                onReset({...getValues(), postalCode: null});
                setSelectedLocation({...selectedLocation, postalCode: null});
                setSelectedLocation({
                  ...selectedLocation,
                  postalCode: null,
                });
              }}
            />
          )}
        />
      ),
    },
    {
      name: 'phoneNumber',
      label: t('cart_checkout.label.phoneNumber'),
      textContentType: 'telephoneNumber',
      keyboardType: 'phone-pad',
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      affixLabel: '+62',
      rules: {required: t('formError.required.phoneNumber')},
    },
  ];

  return (
    <Section>
      <Forms
        fields={forms}
        loading={loading}
        useFormExternal={ctxCheckout?.useFormExternal}
      />
    </Section>
  );
};

export default CheckoutBillingForm;
