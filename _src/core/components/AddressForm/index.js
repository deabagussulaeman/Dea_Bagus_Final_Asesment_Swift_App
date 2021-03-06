import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {rxAppSnackbar} from '@app/services/cache';
import {
  GET_CITY_LIST,
  GET_COUNTRY_LIST,
  GET_REGION_LIST,
} from '@app/_modules/account/services/schema';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import Views from '@app/components/AddressForm/views';

const AddressForm = ({
  loading = false,
  firstName = '',
  onSetFirstname,
  lastName = '',
  onSetLastName,
  street = '',
  onSetStreet,
  countryId = 'ID',
  onSetCountryId,
  regionName = '',
  onSetRegionName,
  regionId = null,
  onSetRegionId,
  onSetRegionCode,
  city = '',
  onSetCity,
  postCode = '',
  onSetPostCode,
  telephone = '',
  onSetTelephone,
  defaultBilling = false,
  onSetDefaultBilling,
  defaultShipping = false,
  onSetDefaultShipping,
  onSaveAddress: onSaveAddressProp,
  setLocation,
  location,
  formError,
}) => {
  const [countryModal, setCountryModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [pinPointModal, setPinPointModal] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);

  const [kabupatenList, setKabupatenList] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [kabupatenModal, setKabupatenModal] = useState(false);
  const [kecamatanCollection, setKecamatanCollection] = useState({});
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kecamatanModal, setKecamatanModal] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [kelurahanCollection, setKelurahanCollection] = useState({});
  const [kelurahanList, setKelurahanList] = useState([]);
  const [kelurahanModal, setKelurahanModal] = useState(false);
  const [selectedKelurahan, setSelectedKelurahan] = useState('');
  const [postCodeCollection, setPostCodeCollection] = useState({});

  const [countryName, setCountryName] = useState('Indonesia');
  const {t} = useTranslation();

  // Country///////////////////////////////////////////////////
  const {data: countryData} = useCustomQuery({
    schema: GET_COUNTRY_LIST,
    useInitData: true,
  });

  useEffect(() => {
    if (countryData && countryData?.data) {
      const {full_name_locale, id} = countryData?.data.country;
      let countryListTmp = [
        {
          name: full_name_locale,
          country_id: id,
        },
      ];
      setCountryList(countryListTmp);
    }
  }, [countryData]);

  const onOpenCountryModal = () => {
    setCountryModal(true);
  };
  const onSelectCountry = selectedCountry => {
    const {country_id, name} = selectedCountry;
    setCountryName(name);
    onSetCountryId(country_id);
    setCountryModal(false);
  };

  //region//////////////////////////////////////////////////////
  const {data: regionData} = useCustomQuery({
    schema: GET_REGION_LIST,
    useInitData: true,
    variables: {
      country_id: countryId,
    },
  });
  useEffect(() => {
    if (regionData && regionData?.data) {
      const {item} = regionData?.data.getRegions;
      let regionListTmp = [];
      item.forEach(region => {
        const {code: region_code, name, region_id, country_id} = region;
        let regionItem = {
          name,
          country_id,
          region_code,
          region_id,
        };
        regionListTmp.push(regionItem);
      });
      setRegionList(regionListTmp);
    }
  }, [regionData]);

  const onOpenRegionModal = () => {
    if (countryId) {
      setRegionModal(true);
    } else {
      rxAppSnackbar({
        message: t('message.selectCountry'),
      });
    }
  };
  const onSelectRegion = selectedRegion => {
    const {name, region_code, region_id} = selectedRegion;
    onSetRegionName(name);
    onSetRegionCode(region_code);
    onSetRegionId(region_id);
    loadCityData({
      params: {
        region_id: region_id,
      },
    });
    onSetCity(''); //reset City when region is changed

    setSelectedKabupaten('');
    setSelectedKecamatan('');
    setKecamatanList([]);
    setSelectedKelurahan('');
    setKelurahanList([]);

    setRegionModal(false);
  };

  //city//////////////////////////////////////////////////////////
  useEffect(() => {
    const splitCurrentCity = () => {
      if (city) {
        let citySplit = city.split(', ');
        let kabupatenTmp = citySplit[0];
        setSelectedKabupaten(kabupatenTmp);

        let kecamatanTmp = '';
        if (citySplit.length > 1) {
          kecamatanTmp = citySplit[1];
          setSelectedKecamatan(kecamatanTmp);
        }

        let kelurahanTmp = '';
        if (citySplit.length > 2) {
          kelurahanTmp = citySplit[2];
          setSelectedKelurahan(kelurahanTmp);
        }
      }
    };
    splitCurrentCity();
  }, [city]);

  const {data: cityData, onRefetchData: loadCityData} = useCustomQuery({
    schema: GET_CITY_LIST,
  });
  useEffect(() => {
    const populateKabupatenList = cities => {
      let kabupatenListTmp = [];
      let kecamatanCollectionTmp = {};
      let kelurahanCollectionTmp = {};
      let postCodeCollectionTmp = {};

      cities.forEach(cityParam => {
        let citySplit = cityParam.city.split(', ');

        let kabupatenTmp = citySplit[0];
        let kecamatanTmp = citySplit[1];
        let kelurahanTmp = null;
        if (citySplit.length > 2) {
          kelurahanTmp = citySplit[2];
        }

        if (!kabupatenListTmp.includes(kabupatenTmp)) {
          kabupatenListTmp.push(kabupatenTmp);
        }
        //
        if (!kecamatanCollectionTmp[kabupatenTmp]) {
          kecamatanCollectionTmp = {
            ...kecamatanCollectionTmp,
            [kabupatenTmp]: [],
          };
        } else {
          let kecamatanInKabupaten = kecamatanCollectionTmp[kabupatenTmp];
          if (!kecamatanInKabupaten.includes(kecamatanTmp)) {
            kecamatanInKabupaten.push(kecamatanTmp);
          }
          kecamatanCollectionTmp = {
            ...kecamatanCollectionTmp,
            [kabupatenTmp]: kecamatanInKabupaten,
          };
        }
        //
        if (kelurahanTmp) {
          if (!kelurahanCollectionTmp[kecamatanTmp]) {
            kelurahanCollectionTmp = {
              ...kelurahanCollectionTmp,
              [kecamatanTmp]: [],
            };
          } else {
            let kelurahanInKecamatan = kelurahanCollectionTmp[kecamatanTmp];
            if (!kelurahanInKecamatan.includes(kelurahanTmp)) {
              kelurahanInKecamatan.push(kelurahanTmp);
            }
            kelurahanCollectionTmp = {
              ...kelurahanCollectionTmp,
              [kecamatanTmp]: kelurahanInKecamatan,
            };
          }
          //
          if (!postCodeCollectionTmp[kelurahanTmp] && city.postcode) {
            postCodeCollectionTmp = {
              ...postCodeCollectionTmp,
              [kelurahanTmp]: city.postcode,
            };
          }
        }
      });

      setKabupatenList(kabupatenListTmp);
      setKecamatanCollection(kecamatanCollectionTmp);
      setKelurahanCollection(kelurahanCollectionTmp);
      setPostCodeCollection(postCodeCollectionTmp);

      if (selectedKabupaten) {
        setKecamatanList(kecamatanCollectionTmp[selectedKabupaten]);
      }
      if (kelurahanCollectionTmp[selectedKecamatan]) {
        setKelurahanList(kelurahanCollectionTmp[selectedKecamatan]);
      }
      if (postCodeCollectionTmp[selectedKelurahan]) {
        onSetPostCode(postCodeCollectionTmp[selectedKelurahan]);
      }
    };
    //

    if (cityData?.data?.getCityByRegionId?.item.length > 0) {
      const {item} = cityData.data.getCityByRegionId;
      populateKabupatenList(item);
    }
  }, [cityData]);

  const onOpenKabupatenModal = () => {
    if (regionId) {
      setKabupatenModal(true);
    } else {
      rxAppSnackbar({
        message: t('message.selectRegion'),
      });
    }
  };
  const onSelectKabupaten = selectedKabupatenParam => {
    setSelectedKabupaten(selectedKabupatenParam);
    setSelectedKecamatan('');
    setSelectedKelurahan('');
    setKelurahanList([]);
    setKecamatanList(kecamatanCollection[selectedKabupatenParam]);

    onSetCity(`${selectedKabupatenParam}`);

    setKabupatenModal(false);
  };
  const onOpenKecamatanModal = () => {
    if (selectedKabupaten) {
      setKecamatanModal(true);
    } else {
      rxAppSnackbar({
        message: t('message.selectDistrict'),
      });
    }
  };
  const onSelectKecamatan = selectedKecamatanParam => {
    setSelectedKecamatan(selectedKecamatanParam);
    setSelectedKelurahan('');

    if (kelurahanCollection[selectedKecamatanParam]) {
      setKelurahanList(kelurahanCollection[selectedKecamatanParam]);
    }
    onSetCity(`${selectedKabupaten}, ${selectedKecamatanParam}`);

    setKecamatanModal(false);
  };
  const onOpenKelurahanModal = () => {
    if (selectedKecamatan) {
      setKelurahanModal(true);
    } else {
      rxAppSnackbar({
        message: t('message.selectSubDistrict'),
      });
    }
  };
  const onSelectKelurahan = selectedKelurahanParam => {
    // combine the 3 into city and set it
    setSelectedKelurahan(selectedKelurahanParam);
    onSetCity(
      `${selectedKabupaten}, ${selectedKecamatan}, ${selectedKelurahanParam}`,
    );

    onSetPostCode(postCodeCollection[selectedKelurahanParam]);

    setKelurahanModal(false);
  };
  ////////////////////////////////////////////////////

  //Pin Point//////////////////////////////////////////////////////////
  const onOpenPinPointModal = () => {
    setPinPointModal(true);
  };
  const onSelectLocation = dataLocation => {
    setLocation(dataLocation);
    setPinPointModal(false);
  };
  ////////////////////////////////////////////////////

  const onSaveAddress = () => {
    if (!selectedKabupaten && kabupatenList.length) {
      rxAppSnackbar({
        message: t('message.selectDistrict'),
      });
    } else if (!selectedKecamatan && kecamatanList.length) {
      rxAppSnackbar({
        message: t('message.selectSubDistrict'),
      });
    } else if (!selectedKelurahan && kelurahanList.length) {
      rxAppSnackbar({
        message: t('message.selectUrbanVillage'),
      });
    } else {
      onSaveAddressProp();
    }
  };

  return (
    <Views
      loading={loading}
      onSaveAddress={onSaveAddress}
      formError={formError}
      //
      firstName={firstName}
      onSetFirstname={onSetFirstname}
      lastName={lastName}
      onSetLastName={onSetLastName}
      //
      street={street}
      onSetStreet={onSetStreet}
      //
      postCode={postCode}
      onSetPostCode={onSetPostCode}
      //
      telephone={telephone}
      onSetTelephone={onSetTelephone}
      //
      location={location}
      onSelectLocation={onSelectLocation}
      //
      defaultBilling={defaultBilling}
      onSetDefaultBilling={onSetDefaultBilling}
      defaultShipping={defaultShipping}
      onSetDefaultShipping={onSetDefaultShipping}
      //
      countryName={countryName}
      countryModal={countryModal}
      countryList={countryList}
      onOpenCountryModal={onOpenCountryModal}
      onSelectCountry={onSelectCountry}
      setCountryModal={setCountryModal}
      //
      regionName={regionName}
      regionList={regionList}
      regionModal={regionModal}
      onOpenRegionModal={onOpenRegionModal}
      onSelectRegion={onSelectRegion}
      setRegionModal={setRegionModal}
      //
      pinPointModal={pinPointModal}
      onOpenPinPointModal={onOpenPinPointModal}
      setPinPointModal={setPinPointModal}
      //
      selectedKabupaten={selectedKabupaten}
      kabupatenModal={kabupatenModal}
      kabupatenList={kabupatenList}
      onSelectKabupaten={onSelectKabupaten}
      setKabupatenModal={setKabupatenModal}
      onOpenKabupatenModal={onOpenKabupatenModal}
      //
      selectedKecamatan={selectedKecamatan}
      kecamatanModal={kecamatanModal}
      kecamatanList={kecamatanList}
      onSelectKecamatan={onSelectKecamatan}
      setKecamatanModal={setKecamatanModal}
      onOpenKecamatanModal={onOpenKecamatanModal}
      //
      selectedKelurahan={selectedKelurahan}
      kelurahanModal={kelurahanModal}
      kelurahanList={kelurahanList}
      onSelectKelurahan={onSelectKelurahan}
      setKelurahanModal={setKelurahanModal}
      onOpenKelurahanModal={onOpenKelurahanModal}
    />
  );
};

AddressForm.propTypes = {
  // loading state
  loading: PropTypes.bool,
  // first name
  firstName: PropTypes.string,
  // func set first name
  onSetFirstname: PropTypes.func,
  // last name
  lastName: PropTypes.string,
  // func set last name
  onSetLastName: PropTypes.func,
  // street
  street: PropTypes.string,
  // func set street
  onSetStreet: PropTypes.func,
  // country id
  countryId: PropTypes.string,
  // func set country id
  onSetCountryId: PropTypes.func,
  // region name
  regionName: PropTypes.string,
  // func set region name
  onSetRegionName: PropTypes.func,
  // region id
  regionId: PropTypes.any,
  // func set region id
  onSetRegionId: PropTypes.func,
  // func set region code
  onSetRegionCode: PropTypes.func,
  // city
  city: PropTypes.string,
  // func set city
  onSetCity: PropTypes.func,
  // post code
  postCode: PropTypes.string,
  // func set post code
  onSetPostCode: PropTypes.func,
  // telephone
  telephone: PropTypes.string,
  // func set telephone
  onSetTelephone: PropTypes.func,
  // bool default bill
  defaultBilling: PropTypes.bool,
  // set default bill
  onSetDefaultBilling: PropTypes.func,
  // default shipping
  defaultShipping: PropTypes.bool,
  // funct set default shipping
  onSetDefaultShipping: PropTypes.func,
  // func save address
  onSaveAddress: PropTypes.func,
  // func set location
  setLocation: PropTypes.func,
  // location
  location: PropTypes.any,
  // form error
  formError: PropTypes.any,
};

export default AddressForm;
