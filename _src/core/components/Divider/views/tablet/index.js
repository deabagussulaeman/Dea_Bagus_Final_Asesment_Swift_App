import React from 'react';
import {StyleSheet} from 'react-native';
import {Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {Colors as ColorsPaper} from 'react-native-paper';
import Section from '@app/components/Section';

const Divider = () => {
  return <Section style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    width: Mixins.MAX_WIDTH,
    borderColor: ColorsPaper.grey200,
    borderBottomWidth: normalize(2),
    // marginVertical: normalize(10),
  },
});

export default Divider;
