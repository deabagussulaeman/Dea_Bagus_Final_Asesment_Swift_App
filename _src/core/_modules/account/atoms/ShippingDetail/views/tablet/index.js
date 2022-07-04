import React, {useState} from 'react';
import {useReactiveVar} from '@apollo/client';
import {WebView} from 'react-native-webview';
import {formatDateTime} from '@app/helpers/General';
import {rxAppSnackbar} from '@app/services/cache';
import {Colors} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {ActivityIndicator} from 'react-native-paper';
import {Modal, SafeAreaView, TouchableOpacity} from 'react-native';
import {rxUserTheme} from '@app/services/cache';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import Button from '@app/components/Button';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '@app/_modules/account/atoms/ShippingDetail/views/tablet/styles';

const LiveTrackingWebView = ({
  liveTrackingUrl,
  showLiveTrackModal,
  setShowLiveTrackModal,
  liveTrackLoading,
  setLiveTrackLoading,
}) => {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showLiveTrackModal}
      onRequestClose={() => {
        setShowLiveTrackModal(false);
      }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE,
        }}>
        <Section verticalCenter horizontalCenter style={{flex: 1}}>
          <Section verticalCenter horizontalCenter style={[styles.container]}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setShowLiveTrackModal(false)}>
              <Icon
                name="ios-arrow-back"
                size={normalize(35)}
                color={Colors.GRAY_DARK}
              />
            </TouchableOpacity>
            <Section style={styles.titleContainer}>
              <Label bold xlarge>
                {t('account.view.liveTracking')}
              </Label>
            </Section>
          </Section>
          <Show when={liveTrackLoading}>
            <Section
              verticalCenter
              horizontalCenter
              style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.PRIMARY} />
            </Section>
          </Show>
          <WebView
            onLoadEnd={() => setLiveTrackLoading(false)}
            onError={() => {
              setLiveTrackLoading(false);
              setShowLiveTrackModal(false);
              rxAppSnackbar({
                message: t('account.error.liveTracking'),
              });
            }}
            source={{uri: liveTrackingUrl}}
            style={{flex: 1}}
          />
        </Section>
      </SafeAreaView>
    </Modal>
  );
};

const ShippingDetail = ({shipping_description, shipping_detail}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const {t} = useTranslation();

  const [showLiveTrackModal, setShowLiveTrackModal] = useState(false);
  const [liveTrackLoading, setLiveTrackLoading] = useState(false);

  if (!shipping_detail[0].data_detail) {
    return null;
  }

  if (
    shipping_detail[0]?.data_detail.includes(
      'Sorry, There is no Tracking Available.',
    )
  ) {
    return <Label>{shipping_detail[0]?.data_detail}</Label>;
  }

  const isGosend = shipping_description.toLowerCase().includes('go-send');
  const dataDetail = [];
  shipping_detail.map(detail => {
    const dataDetailString = detail.data_detail
      .replace(/\\t/g, '')
      .replace(/'/g, '"');
    dataDetail.push(JSON.parse(dataDetailString));
  });

  if (isGosend) {
    return (
      <Section>
        {dataDetail.map(data => {
          const {
            orderNo,
            driverId,
            driverName,
            driverPhone,
            driverPhoto,
            vehicleNumber,
            receiverName,
            orderCreatedTime,
            orderDispatchTime,
            orderArrivalTime,
            orderClosedTime,
            sellerAddressName,
            sellerAddressDetail,
            buyerAddressName,
            buyerAddressDetail,
            liveTrackingUrl,
          } = data;

          return (
            <Section
              backgroundColor={
                getRxUserTheme === 'dark' ? Colors.GRAY_DARK : Colors.GRAY_LIGHT
              }>
              <Section
                radius
                horizontalStart
                paddingHorizontal={10}
                paddingVertical={20}
                marginVertical={10}>
                <Section horizontalStart>
                  <Label bold>
                    {t('account.view.orderNo')} {orderNo}
                  </Label>

                  <Show when={driverId}>
                    <Label>
                      {t('account.view.driverId')} {driverId}
                    </Label>
                  </Show>
                  <Show when={driverName}>
                    <Label>
                      {t('account.view.driverName')} {driverName}
                    </Label>
                  </Show>
                  <Show when={driverPhone}>
                    <Label>
                      {t('account.view.driverPhone')} {driverPhone}
                    </Label>
                  </Show>
                  <Show when={driverPhoto}>
                    <Label>
                      {t('account.view.driverPhoto')} {driverPhoto}
                    </Label>
                  </Show>
                  <Show when={vehicleNumber}>
                    <Label>
                      {t('account.view.vehicleNumber')} {vehicleNumber}
                    </Label>
                  </Show>
                  <Show when={receiverName}>
                    <Label>
                      {t('account.view.recivedBy')} {receiverName}
                    </Label>
                  </Show>

                  <Show when={orderCreatedTime}>
                    <Label>
                      {t('account.view.orderCreatedTime')}{' '}
                      {formatDateTime(orderCreatedTime)}
                    </Label>
                  </Show>
                  <Show when={orderDispatchTime}>
                    <Label>
                      {t('account.view.orderDispatchTime')}{' '}
                      {formatDateTime(orderDispatchTime)}
                    </Label>
                  </Show>
                  <Show when={orderArrivalTime}>
                    <Label>
                      {t('account.view.orderArrivalTime')}{' '}
                      {formatDateTime(orderArrivalTime)}
                    </Label>
                  </Show>
                  <Show when={orderClosedTime}>
                    <Label>
                      {t('account.view.orderClosedTime')}{' '}
                      {formatDateTime(orderClosedTime)}
                    </Label>
                  </Show>
                </Section>

                <Section horizontalStart marginVertical={10}>
                  <Label bold>{t('account.view.seller')} </Label>
                  <Label>{sellerAddressName}</Label>
                  <Label>{sellerAddressDetail}</Label>
                </Section>

                <Section horizontalStart marginVertical={10}>
                  <Label bold>{t('account.view.buyer')} </Label>
                  <Label>{buyerAddressName}</Label>
                  <Label>{buyerAddressDetail}</Label>
                </Section>

                <Button
                  label={t('account.btn.trackOrder')}
                  onPress={() => {
                    setLiveTrackLoading(true);
                    setShowLiveTrackModal(true);
                  }}
                  styleProp={styles.trackButton}
                  textStyleProp={{color: Colors.WHITE, fontWeight: 'bold'}}
                />
              </Section>

              <LiveTrackingWebView
                liveTrackingUrl={liveTrackingUrl}
                showLiveTrackModal={showLiveTrackModal}
                setShowLiveTrackModal={setShowLiveTrackModal}
                liveTrackLoading={liveTrackLoading}
                setLiveTrackLoading={setLiveTrackLoading}
              />
            </Section>
          );
        })}
      </Section>
    );
  } else {
    return (
      <Section radius>
        {dataDetail.map(data => {
          return (
            <Section padding={10} radius marginVertical={10} horizontalStart>
              <Label style={[styles.marginSpacingBottom]}>{data.name}</Label>
              <Label style={[styles.marginSpacingBottom]}>
                {data.description}{' '}
              </Label>

              <Section row spaceBetween>
                <Section row>
                  <Label small>{t('account.view.updatedBy')} </Label>
                  <Label small>{data.updatedBy}</Label>
                </Section>
                <Label small>{formatDateTime(data.updateDate)}</Label>
              </Section>
            </Section>
          );
        })}
      </Section>
    );
  }
};

ShippingDetail.propTypes = {
  // used to determinate isGosend bool
  shipping_description: PropTypes.string,
  // array used as condition and as data detail
  shipping_detail: PropTypes.array,
};

export default ShippingDetail;
