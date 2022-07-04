import i18next from 'i18next';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {Mixins, Colors} from '@app/styles';
import RNRestart from 'react-native-restart';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  errorDetailContainer: {
    borderRadius: 10,
    borderColor: Colors.BLACK,
    borderWidth: 0.5,
    marginTop: 10,
  },
  frameError: {
    backgroundColor: '#fafafa',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    height: Mixins.MAX_HEIGHT * 0.3,
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 40,
  },
  textSubTitle: {
    marginVertical: 20,
  },
  textError: {
    ...Mixins.padding(10, 10, 10, 10),
    ...Mixins.margin(10, 0, 0, 0),
  },
});

const ErrorBoundaryView = ({error}) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <Section style={styles.frameError}>
      <Image
        style={styles.image}
        source={require('@app/assets/images/oops.png')}
        resizeMode={'contain'}
      />
      <Label center xlarge bold>
        {i18next.t('errorBoundary.title')}
      </Label>
      <Label xlarge style={styles.textSubTitle}>
        {i18next.t('errorBoundary.subTitle')}
      </Label>

      <TouchableOpacity onPress={() => setShowDetail(!showDetail)}>
        <Label>{showDetail ? 'Hide Error Detail' : 'Show Error Detail'}</Label>
      </TouchableOpacity>

      {showDetail ? (
        <Section style={styles.errorDetailContainer}>
          <Label center style={styles.textError}>
            {error.toString()}
          </Label>
        </Section>
      ) : null}

      <TouchableOpacity
        style={styles.restartButton}
        onPress={() => RNRestart.Restart()}>
        <Label white>{i18next.t('errorBoundary.restart')}</Label>
      </TouchableOpacity>
    </Section>
  );
};

ErrorBoundaryView.propTypes = {
  // error
  error: PropTypes.any,
};

export default ErrorBoundaryView;
