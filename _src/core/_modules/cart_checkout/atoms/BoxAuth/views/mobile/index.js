import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors, MixinsNew} from '@app/styles';
import {useTranslation} from 'react-i18next';
import {TouchableRipple} from 'react-native-paper';
import Section from '@app/components/Section';
import Label from '@app/components/Label';

const styles = StyleSheet.create({
  btnOutline: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderColor: Colors.GRAY_DARK2,
    borderWidth: 1,
    borderRadius: 50,
  },
});

const BoxAuth = ({onPressAuth}) => {
  const {t} = useTranslation();
  return (
    <Section
      border={1}
      borderColor={Colors.GRAY_DARK}
      borderRadius={5}
      paddingHorizontal={10}
      paddingVertical={20}
      marginBottom={20}
      width={MixinsNew.MAX_WIDTH - 30}>
      <Section>
        <Label center bold>
          {t('cart_checkout.signInForExpressCheckout')}
        </Label>
      </Section>
      <Section horizontalCenter marginTop={20}>
        <TouchableRipple onPress={onPressAuth} style={styles.btnOutline}>
          <Label bold>{t('login.title')}</Label>
        </TouchableRipple>
      </Section>
    </Section>
  );
};

export default BoxAuth;
