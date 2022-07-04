import * as React from 'react';
import {rxAppSnackbar} from '@app/services/cache';
import analytics from '@react-native-firebase/analytics';
import i18next from 'i18next';

export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  analytics().logEvent(name);
  navigationRef?.current?.navigate(name, params);
};

export const stackReset = (stacks = []) => {
  navigationRef?.current?.reset({
    index: 0,
    routes: stacks,
  });
};

export const navReset = (name, opts = {}) => {
  const params = opts?.params;
  if (opts?.withDispatch) {
    navigationRef?.current?.dispatch(
      navigationRef?.current?.reset({
        index: 0,
        routes: [{key: name, name, params}],
      }),
    );
  } else {
    navigationRef?.current?.reset({
      index: 0,
      routes: [{key: name, name, params}],
    });
  }
};

export function navigateTo(isEnable, name, params = {}) {
  if (!isEnable) {
    return rxAppSnackbar({
      message: `${name} ${i18next.t('errorBoundary.feature')}`,
    });
  }
  analytics().logEvent(name);
  return navigationRef.current?.navigate(name, params);
}
