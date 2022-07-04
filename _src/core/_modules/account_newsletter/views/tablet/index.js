import React from 'react';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';
import {ActivityIndicator} from 'react-native-paper';
import {TYPE_APPBAR} from '@app/helpers/Constants';
import {Button} from 'react-native-paper';
import {Colors} from '@app/styles';
import {MAX_WIDTH} from '@app/styles/mixins';
import PropTypes from 'prop-types';
import NavBar from '@app/components/NavBar';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Show from '@app/components/Show';

const NewsletterTabletView = ({t, loading, onSubmit, isSubscribed}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const subscriptionStatusMessage = isSubscribed
    ? t('account_newsletter.message.subscribing')
    : t('account_newsletter.message.notSubscribing');
  const buttonLabel = isSubscribed
    ? t('account_newsletter.label.unsubscribe')
    : t('account_newsletter.label.subscribe');

  return (
    <>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_newsletter.title.newsletter')}
      />
      <Section paddingTop={40} paddingHorizontal={(MAX_WIDTH * 0.25) / 2}>
        <Show when={loading}>
          <ActivityIndicator />
        </Show>
        <Show when={!loading}>
          <Label>{subscriptionStatusMessage}</Label>
        </Show>
        <Button
          mode="contained"
          style={{
            backgroundColor:
              getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK,
            marginTop: 30,
            paddingVertical: 5,
          }}
          onPress={onSubmit}
          loading={loading}>
          {buttonLabel}
        </Button>
      </Section>
    </>
  );
};

NewsletterTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // shows loading
  loading: PropTypes.bool,
  // function for submit form
  onSubmit: PropTypes.func,
  // as condition
  isSubscribed: PropTypes.bool,
};

export default NewsletterTabletView;
