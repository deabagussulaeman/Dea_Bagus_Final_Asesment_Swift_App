import React from 'react';
import {Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';

const AppBarComponent = ({useBack, title, subtitle}) => {
  const navigation = useNavigation();
  return (
    <Appbar.Header style={{elevation: 0}}>
      {useBack && (
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
      )}
      <Appbar.Content title={title} subtitle={subtitle} />
    </Appbar.Header>
  );
};

AppBarComponent.propTypes = {
  // use for displaying back button or not
  useBack: PropTypes.bool,
  // use for displaying title,
  title: PropTypes.string,
  // use for displaying subtitle,
  subtitle: PropTypes.string,
};

export default AppBarComponent;
