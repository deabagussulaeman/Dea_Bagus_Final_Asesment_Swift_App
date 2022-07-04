import React from 'react';
import {Button} from 'react-native-paper';
import {Image} from 'react-native';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import Show from '@app/components/Show';

const AuthLandingView = ({t, onSkip}) => {
  return (
    <Section flex verticalCenter horizontalCenter>
      <Show when={modules.auth_signin.enable}>
        <Section marginBottom={50}>
          <Image source={require('@app/assets/images/swift-logo.png')} />
        </Section>
        <Section marginVertical={10}>
          <Button
            mode="contained"
            style={{width: 150}}
            onPress={() =>
              navigateTo(modules.auth_signin.enable, modules.auth_signin.name)
            }>
            {t('auth_landing.btn.signin')}
          </Button>
        </Section>
      </Show>

      <Show when={modules.auth_signup.enable}>
        <Section marginVertical={10}>
          <Button
            mode="contained"
            style={{width: 150}}
            onPress={() =>
              navigateTo(modules.auth_signup.enable, modules.auth_signup.name)
            }>
            {t('auth_landing.btn.signup')}
          </Button>
        </Section>
      </Show>

      <Section style={{marginTop: 10}}>
        <Button mode="text" onPress={onSkip}>
          {t('auth_landing.btn.skip')}
        </Button>
      </Section>
    </Section>
  );
};

AuthLandingView.propTypes = {
  // translation for any labels
  t: PropTypes.func,
  // function for button to skip
  onSkip: PropTypes.func,
};

export default AuthLandingView;
