import React from 'react';
import Core from '@app/index';
import useDynamicLink from '@app/hooks/useDynamicLink';
import codePush from 'react-native-code-push';
import codePushOptions from '@app/configs/codepush';

import '@app/configs/global';

const App = () => {
  useDynamicLink();
  return <Core />;
};

export default codePush(codePushOptions)(App);
