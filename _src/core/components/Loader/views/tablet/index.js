import React from 'react';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';
import {Modal} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import {rxAppLoading} from '@app/services/cache';
import {Colors, Mixins} from '@app/styles';

const Loader = ({loading: loadingProp = null}) => {
  const getRxAppLoading = useReactiveVar(rxAppLoading);
  const loadingStatus = loadingProp !== null ? loadingProp : getRxAppLoading;

  return (
    <Modal visible={loadingStatus} transparent>
      <Section
        flex
        horizontalCenter
        verticalCenter
        width={Mixins.MAX_WIDTH}
        backgroundColor="#00000040">
        <Section
          horizontalCenter
          verticalCenter
          borderRadius={15}
          width={100}
          height={100}>
          <ActivityIndicator color={Colors.PRIMARY} />
        </Section>
      </Section>
    </Modal>
  );
};

Loader.propTypes = {
  // loading
  loading: PropTypes.any,
};

export default Loader;
