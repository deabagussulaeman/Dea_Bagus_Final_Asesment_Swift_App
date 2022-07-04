import React from 'react';
import {Snackbar} from 'react-native-paper';
import {rxAppSnackbar} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {normalize} from '@app/styles/mixins';

const SnackBar = () => {
  const getRxAppSnackbar = useReactiveVar(rxAppSnackbar);

  if (!getRxAppSnackbar) {
    return null;
  }
  return (
    <Snackbar
      style={{marginBottom: normalize(60)}}
      visible={getRxAppSnackbar}
      onDismiss={() => rxAppSnackbar(null)}
      duration={getRxAppSnackbar.duration ? getRxAppSnackbar.duration : 2000}>
      {getRxAppSnackbar.message}
    </Snackbar>
  );
};

export default SnackBar;
