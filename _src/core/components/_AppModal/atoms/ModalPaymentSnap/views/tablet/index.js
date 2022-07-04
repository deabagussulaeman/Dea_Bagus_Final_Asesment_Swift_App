import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {ActivityIndicator} from 'react-native-paper';
import {IS_IOS} from '@app/helpers/Constants';
import {MAX_HEIGHT} from '@app/styles/mixins.new';
import {rxCartSnapUrl} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '@app/styles/index';

import NavBar from '@app/components/NavBar/index';
import Show from '@app/components/Show';
import Section from '@app/components/Section/index';

const styles = StyleSheet.create({
  displayFlex: {
    flex: MAX_HEIGHT,
  },
  loadingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ModalPaymentSnap = ({
  show,
  showWebviewLoader,
  onWebviewLoad,
  onWebviewClose,
  onWebviewError,
  onWebviewNavigationStateChange,
}) => {
  const {t} = useTranslation();
  const getRxCartSnapUrl = useReactiveVar(rxCartSnapUrl);
  const webviewRef = useRef();
  const safeStyle = IS_IOS ? {height: MAX_HEIGHT + 50} : {flex: 1};
  const webviewStyle = {
    top: IS_IOS ? -50 : 0,
    position: 'relative',
  };
  return (
    <Modal visible={show} onRequestClose={onWebviewClose}>
      <SafeAreaView style={safeStyle}>
        <Show when={IS_IOS}>
          <NavBar
            title={t('cart_checkout.title.payment')}
            useBack
            useBackPress={onWebviewClose}
          />
        </Show>
        <View style={[styles.displayFlex]}>
          <WebView
            ref={webviewRef}
            onLoad={onWebviewLoad}
            onNavigationStateChange={onWebviewNavigationStateChange}
            source={{uri: getRxCartSnapUrl}}
            style={webviewStyle}
            onError={onWebviewError}
          />
          <Show when={showWebviewLoader}>
            <Section style={styles.loadingCenter}>
              <ActivityIndicator
                size="large"
                color={Colors.PRIMARY}
                style={styles.activityIndicator}
              />
            </Section>
          </Show>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalPaymentSnap;
