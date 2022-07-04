import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Modal, StyleSheet} from 'react-native';
import {Colors, Typography, Mixins} from '@app/styles';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {formSchema} from '@app/components/_AppModal/atoms/ModalShippingAddressForm/forms';
import {
  rxCartId,
  rxAppSnackbar,
  rxUserType,
  rxUserTheme,
} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {ActivityIndicator} from 'react-native-paper';
import {isIOS} from '@app/styles/mixins.new';
import {SET_GUEST_EMAIL} from '@app/_modules/cart/services/schema';
import {TouchableRipple, TextInput} from 'react-native-paper';
import {
  FORM_FIELD,
  TYPE_ADDRESS_FORM_COUNTRY,
  TYPE_ADDRESS_FORM_POSTAL,
  TYPE_ADDRESS_FORM_REGION,
  TYPE_ADDRESS_FORM_CITY,
  USER_GUEST,
  BYPASS_ERROR_CHECKOUT_MODAL_SHIPPING_USER_ADDRESS,
} from '@app/helpers/Constants';
import {
  GET_CITY_LIST,
  GET_COUNTRY_LIST,
  GET_REGION_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
} from '@app/_modules/account/services/schema';
import Icon from 'react-native-vector-icons/Feather';
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import SearchGoogleAutocomplete from '@app/components/SearchGoogleAutocomplete';
import Section from '@app/components/Section';
import useCustomMutation from '@app/hooks/useCustomMutation';
import useCustomQuery from '@app/hooks/useCustomQuery';
import NavBarCustom from '@app/components/NavBar/atoms/NavBarCustom';
import CheckBox from '@app/components/CheckBox';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import Forms, {
  _onFormHandleResetRef,
  _onFormHandleValuesRef,
} from '@app/components/_Forms/views/tablet';
import useDataCustomer, {
  TYPES as CUSTOMER_TYPES,
} from '@app/hooks/customer/useDataCustomer';
import _ from 'lodash';
import {guestCheckout} from '@root/swift.config';
import {useSelectShippingAddress} from '@app/hooks/carts/useSelectShippingAddress';
import AppSnackBar from '@app/components/SnackBar';

const styles = StyleSheet.create({
  mapContainerStyle: {height: 250, width: '100%', borderRadius: 6},
  navbarTitleStyle: {fontSize: 14, fontWeight: 'bold', ...Typography.FONT_BOLD},
  navbarStylesContainer: {
    borderBottomColor: Colors.GRAY_DARK4,
    borderBottomWidth: 1,
  },
  mapsFrame: {
    position: 'relative',
  },
  mapsBoxOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
});

/**
 * ---------------------------------------------------- *
 * @component compName
 * @param {callbackAutocomplete} object
 * @summary for render searching google place
 * @returns {component}
 * ---------------------------------------------------- *
 */
const SearchGooglePlace = ({callbackAutocomplete}) => {
  return (
    <SearchGoogleAutocomplete
      key={'search-google'}
      useOnlySearch
      callbackAutocomplete={callbackAutocomplete}
    />
  );
};

/**
 * ---------------------------------------------------- *
 * @component RenderMap
 * @param {refMarker, location, loader} object
 * @param {onRegionChange} object
 * @summary for rendering maps
 * @returns {component}
 * ---------------------------------------------------- *
 */
const RenderMap = ({
  t,
  refMarker,
  location,
  loader,
  isConfirmPinLocation,
  setIsConfirmPinLocation,
  onRegionChange,
}) => {
  const getCoordinate = {
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  };
  const getIntialRegion = {
    ...getCoordinate,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  if (loader) {
    return (
      <Section marginTop={15} horizontalCenter>
        <ActivityIndicator size="large" />
      </Section>
    );
  }

  return (
    <Section marginTop={15} style={styles.mapsFrame}>
      <Show when={!isConfirmPinLocation}>
        <Section
          padding={10}
          horizontalCenter
          verticalCenter
          style={styles.mapsBoxOverlay}>
          <Section bg={Colors.WHITE} padding={10} borderRadius={5}>
            <TouchableRipple onPress={() => setIsConfirmPinLocation(true)}>
              <Section row>
                <CheckBox
                  checkedColor={Colors.PRIMARY}
                  selected={false}
                  onPress={() => setIsConfirmPinLocation(true)}
                  size={16}
                />
                <Section flex={1} marginLeft={10} verticalCenter>
                  <Label>
                    {t('cart_checkout.label.pleaseConfirmLocation')}
                  </Label>
                </Section>
              </Section>
            </TouchableRipple>
            <Section marginBottom={10}>
              <Section marginTop={10} marginBottom={10}>
                <Label color={Colors.GRAY_DARK}>
                  {t('cart_checkout.label.byClickConfirm')}
                </Label>
              </Section>
              <Label color={Colors.GRAY_DARK} small>
                - {t('cart_checkout.label.agreeThatAddress')}
              </Label>
              <Label color={Colors.GRAY_DARK} small>
                - {t('cart_checkout.label.anyShippingError')}
              </Label>
            </Section>
          </Section>
        </Section>
      </Show>
      <MapView
        ref={refMarker}
        showsUserLocation
        showsMyLocationButton
        style={[styles.mapContainerStyle]}
        initialRegion={getIntialRegion}
        onRegionChangeComplete={region => onRegionChange(region)}
        provider="google"
        onMapReady={() => {}}>
        <MapView.Marker title={t('yourPosition')} coordinate={getCoordinate} />
      </MapView>
    </Section>
  );
};

/**
 * ---------------------------------------------------- *
 * @function onFilterCities
 * @param {cities, include, filterBy, indexReturn} object
 * @summary for filter cities based on needed object
 * ---------------------------------------------------- *
 */
export const onFilterCities = ({cities, include, filterBy, indexReturn}) => {
  const getFilterValue = _.filter(cities, item =>
    _.includes(item.city, include),
  ).map(item => {
    const getDataSplit = _.split(item[filterBy], ', ');
    if (getDataSplit[indexReturn]) {
      return {...item, name: getDataSplit[indexReturn]};
    }
  });

  return getFilterValue;
};

const AtomModalShippingAddressForm = ({
  show,
  onClose,
  isEdit,
  onRefetchDataAddress,
}) => {
  const {t} = useTranslation();
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxCartId = useReactiveVar(rxCartId);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const isGuest = getRxUserType === USER_GUEST;
  const editMode = !_.isEmpty(isEdit);
  const refMarker = useRef();
  const mount = useRef();
  const {setShippingToCartGuestCheckout, setBillingToCartGuestCheckout} =
    useSelectShippingAddress();
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [postCodeList, setPostCodeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);
  const [isConfirmPinLocation, setIsConfirmPinLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    country: null,
    region: null,
    city: null,
    postalCode: null,
    pinpoint: {
      longitude: 106.841036, // default
      latitude: -6.173292, // default
    },
  });

  const [defaultValue, setDefaultValue] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    region: '',
    city: '',
    postalCode: '',
    streetAddress: '',
    phoneNumber: '',
    defaultShipping: false,
  });

  const {onRefetchData: setGuestEmailHook} = useCustomMutation({
    schema: SET_GUEST_EMAIL,
  });
  const {onRefetchData: addAddressHook} = useCustomMutation({
    schema: ADD_ADDRESS,
  });
  const {onRefetchData: updateAddressHook} = useCustomMutation({
    schema: UPDATE_ADDRESS,
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
  const {setDataResponse: getUserAddress} = useDataCustomer({
    initialized: false,
    type: CUSTOMER_TYPES.USER_ADDRESS,
    configErr: {
      logSource: BYPASS_ERROR_CHECKOUT_MODAL_SHIPPING_USER_ADDRESS,
      isBypass: guestCheckout.enable && isGuest ? true : false,
    },
  });

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary for first init
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      setLoadingMap(true);
      const mapConfig = isIOS
        ? {enableHighAccuracy: true, timeout: 20000, maximumAge: 3600000}
        : {};
      Geolocation.getCurrentPosition(
        async info => {
          const {longitude, latitude} = info.coords;
          setSelectedLocation({
            ...selectedLocation,
            pinpoint: {longitude, latitude},
          });
          setLoadingMap(false);
        },
        async () => setLoadingMap(false),
        mapConfig,
      );
    }
  }, []);

  /**
   * ---------------------------------------------------- *
   * @dependency [show]
   * @summary for detection show variable
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (show) {
      setIsConfirmPinLocation(false);
    }
    if (show && !editMode) {
      setSelectedLocation({
        ...selectedLocation,
        country: null,
        region: null,
        city: null,
        postalCode: null,
      });
      onResetDataDropdown({
        region: true,
        city: true,
        postalCode: true,
        log: 0,
      });
    }
  }, [show]);

  /**
   * ---------------------------------------------------- *
   * @function getPostCode
   * @param {cities, include} object
   * @summary for get postcode from urban village
   * ---------------------------------------------------- *
   */
  const getPostCode = useCallback(
    city => {
      const postCode = [{name: city.postcode}];
      setPostCodeList(postCode);
    },
    [isEdit],
  );

  /**
   * ---------------------------------------------------- *
   * @dependency [isEdit]
   * @summary for get regions and cities
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    if (editMode) {
      const getRegionAndCityAddress = async () => {
        // const var = customer || guest

        const country_id = isEdit?.country_id || isEdit?.country?.code;
        const region_id = isEdit?.region_id || isEdit?.region?.region_id;

        if (country_id) {
          await getRegions({params: {country_id}});
        }

        if (region_id) {
          const getCityData = await getCities({
            paramsOpt: {isReturn: true},
            params: {region_id},
          });

          const {id} = countryData?.data.country;
          const getCountryId = {country_id: id};
          const getCityAddress = _.get(isEdit, 'city');
          const cities = _.get(getCityData, 'data.getCityByRegionId.item');
          const tempCities = cities.map(item => {
            return {...item, name: item.city};
          });
          const selectedCity = tempCities.find(
            city => city.city === getCityAddress,
          );

          let getLatitude = 106.841036; //default
          let getLongitude = -6.173292; //default
          // customer only --- guest belum bisa pin
          if (!isGuest) {
            const getCustomAttr = _.get(isEdit, 'custom_attributes');
            if (getCustomAttr) {
              getLatitude = _.find(
                getCustomAttr,
                item => item.attribute_code === 'latitude',
              )?.value;
              getLongitude = _.find(
                getCustomAttr,
                item => item.attribute_code === 'longitude',
              )?.value;
            }
          }

          setCityList(tempCities);
          getPostCode(selectedCity);
          setSelectedLocation({
            country: getCountryId,
            region: {
              region_code: isGuest ? isEdit?.region?.code : isEdit?.region_code,
              region_id: isGuest
                ? isEdit?.region?.region_id
                : isEdit?.region_id,
            },
            city: selectedCity,
            postalCode: isEdit?.postcode,
            pinpoint: {
              longitude: getLongitude, // default
              latitude: getLatitude, // default
            },
          });
          const onReset = _onFormHandleResetRef.current;
          const getValues = _onFormHandleValuesRef.current;
          const country = country_id === 'ID' ? 'Indonesia' : '';
          const regionValue = isEdit
            ? isEdit.region.label || isEdit.region
            : '';

          const valueEdit = {
            ...getValues(),
            firstName: isEdit ? isEdit.firstname : '',
            lastName: isEdit ? isEdit.lastname : '',
            country: country,
            region: regionValue,
            city: isEdit ? isEdit.city : '',
            postalCode: isEdit ? isEdit.postcode : '',
            streetAddress: isEdit.street
              ? Array.isArray(isEdit.street)
                ? isEdit.street[0]
                : isEdit.street
              : '',
            phoneNumber: isEdit ? isEdit.telephone : '',
            defaultShipping: isEdit.default_shipping
              ? isEdit.default_shipping
              : false,
          };

          if (isGuest) {
            setDefaultValue({
              ...defaultValue,
              ...valueEdit,
              email: isEdit ? isEdit.email : '',
            });
          } else {
            onReset(valueEdit);
          }
        }
      };
      getRegionAndCityAddress();
    }
  }, [isEdit]);

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
      setSelectedLocation({...selectedLocation, country: getCountryId});
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
        return {...item, name: item.city};
      });
      setCityList(tempCities);
      setLoading(false);
    }
  }, [cityData]);

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
    const isResetCity = props?.city;
    const isResetPostalCode = props?.postalCode;

    if (isResetRegion) {
      setRegionList([]);
    }
    if (isResetCity) {
      setCityList([]);
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
    const getValues = _onFormHandleValuesRef.current;
    const onReset = _onFormHandleResetRef.current;

    switch (fieldName) {
      case TYPE_ADDRESS_FORM_COUNTRY:
        onReset({
          ...getValues(),
          region: '',
          city: '',
          postalCode: '',
        });
        onResetDataDropdown({
          region: true,
          city: true,
          postalCode: true,
          log: 1,
        });
        getRegions({params: {country_id: selected.country_id}});
        break;
      case TYPE_ADDRESS_FORM_REGION:
        onReset({
          ...getValues(),
          city: '',
          postalCode: '',
        });
        onResetDataDropdown({
          city: true,
          postalCode: true,
          log: 2,
        });
        getCities({params: {region_id: selected.region_id}});
        break;
      case TYPE_ADDRESS_FORM_CITY:
        onReset({
          ...getValues(),
          postalCode: '',
        });
        onResetDataDropdown({
          postalCode: true,
          log: 3,
        });
        getPostCode(selected);
        break;
      case TYPE_ADDRESS_FORM_POSTAL:
        setLoading(false);
        break;
    }
    setSelectedLocation(valList);
  };

  /**
   * ---------------------------------------------------- *
   * @function onSaveAddress
   * @param {data} object
   * @summary functionDesc
   * @returns something
   * ---------------------------------------------------- *
   */
  const onSaveAddress = async data => {
    setLoading(true);

    const latitude = _.get(selectedLocation, 'pinpoint.latitude').toString();
    const longitude = _.get(selectedLocation, 'pinpoint.longitude').toString();
    const addressData = {
      city: _.get(selectedLocation, 'city.city'),
      country_code: _.get(selectedLocation, 'country.country_id'),
      firstname: data.firstName,
      lastname: data.lastName,
      street: data.streetAddress,
      postcode: data.postalCode,
      region: data.region,
      region_id: _.get(selectedLocation, 'region.region_id'),
      telephone: data.phoneNumber,
    };

    if (isGuest) {
      try {
        const addressDataGuest = {
          ...addressData,
          latitude,
          longitude,
          region: _.get(selectedLocation, 'region.code'),
        };
        // set email guest
        await setGuestEmailHook({
          params: {input: {cart_id: getRxCartId, email: data.email}},
        });
        // set selected shipping & billing address
        await setShippingToCartGuestCheckout(addressDataGuest);
        await setBillingToCartGuestCheckout(addressDataGuest);
        await onRefetchDataAddress();
        setLoading(false);
        rxAppSnackbar({message: t('message.successSaveAddress')});
        onClose();
      } catch (err) {
        console.log('[err] set email guest & set shipping method guest', err);
        setLoading(false);
      }
    } else {
      const pinPointData = [
        {
          attribute_code: 'latitude',
          value: latitude,
        },
        {
          attribute_code: 'longitude',
          value: longitude,
        },
      ];

      const addressDataUser = {
        ...addressData,
        default_billing: data.defaultShipping,
        default_shipping: data.defaultShipping,
        region_code: _.get(selectedLocation, 'region.code'),
        custom_attributes: pinPointData,
      };

      try {
        if (editMode) {
          const res = await updateAddressHook({
            paramsOpt: {isReturn: true},
            params: {
              id: isEdit.addressId,
              ...addressDataUser,
            },
          });
          const customerAddress = _.get(res, 'data.updateCustomerAddress');
          if (customerAddress) {
            await getUserAddress();
            setLoading(false);
            rxAppSnackbar({message: t('message.successSaveAddress')});
            onClose();
          } else {
            rxAppSnackbar({message: t('account_add_address.error.message')});
            setLoading(false);
          }
        }

        if (!editMode) {
          const res = await addAddressHook({
            paramsOpt: {isReturn: true},
            params: addressDataUser,
          });

          const customerAddress = _.get(res, 'data.createCustomerAddress');
          if (customerAddress) {
            await getUserAddress();
            setLoading(false);
            rxAppSnackbar({message: t('message.successSaveAddress')});
            onClose();
          } else {
            rxAppSnackbar({message: t('account_add_address.error.message')});

            setLoading(false);
          }
        }
      } catch (err) {
        console.log('[err] save address', err);
        setLoading(false);
      }
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onRegionChange
   * @param {latitude, longitude} region
   * @summary for set selected region when location change
   * ---------------------------------------------------- *
   */
  const onRegionChange = async region => {
    setSelectedLocation({
      ...selectedLocation,
      pinpoint: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    });
  };

  /**
   * ---------------------------------------------------- *
   * @function mapAnimateCamera
   * @param {object} newCoordinate
   * @summary for set camera within map view
   * ---------------------------------------------------- *
   */
  const mapAnimateCamera = newCoordinate => {
    if (refMarker) {
      refMarker.current.animateCamera({center: newCoordinate, zoom: 15}, 1000);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function callbackSearchPlace
   * @param {location.lat, location.lng} item
   * @summary for callback while search place
   * ---------------------------------------------------- *
   */
  const callbackSearchPlace = item => {
    const {lat, lng} = item.location;
    const dataCoordinate = {latitude: lat, longitude: lng};
    setSelectedLocation({...selectedLocation, pinpoint: dataCoordinate});
    mapAnimateCamera(dataCoordinate);
  };
  /**
   * ---------------------------------------------------- *
   * @const {forms}
   * @summary schema for form builder
   * ---------------------------------------------------- *
   */
  const forms = formSchema({
    custom: [
      {
        name: TYPE_ADDRESS_FORM_COUNTRY,
        label: t('account_add_address.label.country'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        data: countryList,
        isVisible: countryList.length > 0,
        autoCapitalized: 'none',
        rules: {required: t('formError.required.country')},
        onPress: onSelectLocation,
        defaultValue: defaultValue.country,
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
                    city: null,
                    postalCode: null,
                  });
                  setSelectedLocation({
                    ...selectedLocation,
                    country: null,
                    region: null,
                    city: null,
                    postalCode: null,
                  });
                  onResetDataDropdown({
                    region: true,
                    city: true,
                    postalCode: true,
                    log: 6,
                  });
                }}
              />
            )}
          />
        ),
      },
      {
        name: TYPE_ADDRESS_FORM_REGION,
        label: t('account_add_address.label.province'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: regionList.length > 0 && selectedLocation.country !== null,
        onPress: onSelectLocation,
        data: regionList,
        defaultValue: defaultValue.region,
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
                    city: null,
                    postalCode: null,
                  });
                  setSelectedLocation({
                    ...selectedLocation,
                    region: null,
                    city: null,
                    postalCode: null,
                  });
                  onResetDataDropdown({
                    city: true,
                    postalCode: true,
                    log: 7,
                  });
                }}
              />
            )}
          />
        ),
      },
      {
        name: TYPE_ADDRESS_FORM_CITY,
        label: t('account_add_address.label.city'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: cityList.length > 0 && selectedLocation.region !== null,
        onPress: onSelectLocation,
        data: cityList,
        defaultValue: defaultValue.city,
        autoCapitalized: 'none',
        rules: {required: t('formError.required.city')},
        isDisabled: selectedLocation.city !== null,
        inputRightCustom: selectedLocation.city !== null && (
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
                    city: null,
                    postalCode: null,
                  });
                  setSelectedLocation({
                    ...selectedLocation,
                    city: null,
                    postalCode: null,
                  });
                  onResetDataDropdown({
                    postalCode: true,
                    log: 8,
                  });
                }}
              />
            )}
          />
        ),
      },
      {
        name: TYPE_ADDRESS_FORM_POSTAL,
        label: t('account_add_address.label.postalCode'),
        textContentType: 'address',
        type: FORM_FIELD.INPUT_DROPDOWN,
        isVisible: postCodeList.length > 0 && selectedLocation.city !== null,
        onPress: onSelectLocation,
        data: postCodeList,
        autoCapitalized: 'none',
        defaultValue: defaultValue.postalCode,
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
        defaultValue: defaultValue.streetAddress,
        autoCapitalized: 'words',
        rules: {required: t('formError.required.address')},
      },
      {
        name: 'map',
        type: FORM_FIELD.CUSTOM,
        renderItem: RenderMap({
          t,
          location: selectedLocation.pinpoint,
          loader: loadingMap,
          refMarker,
          isConfirmPinLocation,
          onRegionChange,
          setIsConfirmPinLocation,
        }),
      },
      {
        name: 'buttonPinpoint',
        type: FORM_FIELD.CUSTOM,
        isVisible: isConfirmPinLocation,
        renderItem: SearchGooglePlace({
          callbackAutocomplete: callbackSearchPlace,
        }),
      },
      {
        name: 'phoneNumber',
        label: t('cart_checkout.label.phoneNumber'),
        textContentType: 'telephoneNumber',
        keyboardType: 'phone-pad',
        type: FORM_FIELD.INPUT,
        defaultValue: defaultValue.phoneNumber,
        affixLabel: '+62',
        rules: {required: t('formError.required.phoneNumber')},
      },
      {
        name: 'defaultShipping',
        label: t('cart_checkout.label.useDefaultShippingAddress'),
        type: FORM_FIELD.CHECKBOX,
        defaultValue: defaultValue.defaultShipping,
        rules: {},
      },
    ],
    defVal: defaultValue,
    isGuest: isGuest,
  });

  const loadingMessage = () => {
    return rxAppSnackbar({
      message: t('cart_checkout.error.loadingMessage'),
    });
  };

  return (
    <Modal visible={show}>
      <NavBarCustom
        center
        useClose
        useWhite
        useShadow={false}
        useBackPress={loading ? loadingMessage : onClose}
        titleStyle={styles.navbarTitleStyle}
        stylesContainer={styles.navbarStylesContainer}
        title={
          _.isEmpty(isEdit)
            ? t('account_add_address.title.addAddress')
            : t('account_add_address.title.editAddress')
        }
      />
      <KeyboardAwareScrollView
        nestedScrollEnabled
        style={{
          paddingTop: 30,
          backgroundColor: getRxUserTheme === 'dark' ? Colors.DARK : null,
          width: Mixins.MAX_WIDTH,
          paddingHorizontal: (Mixins.MAX_WIDTH * 0.25) / 2,
          alignSelf: 'center',
        }}>
        <Forms
          fields={forms}
          buttonTitle={t('account_add_address.title.submit')}
          buttonLabelColor={Colors.WHITE}
          buttonStyle={{backgroundColor: Colors.PRIMARY, borderRadius: 40}}
          onSubmit={onSaveAddress}
          loading={loading}
        />
      </KeyboardAwareScrollView>
      <AppSnackBar />
    </Modal>
  );
};

export default AtomModalShippingAddressForm;
