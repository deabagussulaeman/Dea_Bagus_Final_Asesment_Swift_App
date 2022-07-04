import NavBar from '@app/components/NavBar';
import WebViewContent from '@app/components/WebViewContent';
import {ActivityIndicator} from 'react-native-paper';
import PropTypes from 'prop-types';
import React from 'react';
import NoData from '@app/components/NoData';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const ContactUsView = ({t, loading, title, contactCMS}) => {
  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <NavBar type={TYPE_APPBAR} useBack title={t('account.menu.contactUs')} />
      {!contactCMS ? (
        <NoData />
      ) : (
        <WebViewContent htmlBlock={contactCMS} title={title} />
      )}
    </>
  );
};

ContactUsView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // shows loading
  loading: PropTypes.bool,
  // shows title
  title: PropTypes.string,
  //shows htmlblock
  contactCMS: PropTypes.string,
};

export default ContactUsView;
