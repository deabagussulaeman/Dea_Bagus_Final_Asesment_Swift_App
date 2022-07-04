import {LogBox, Text, TextInput} from 'react-native';
import {GLOBAL} from '@root/swift.config';

LogBox.ignoreAllLogs(true);
import('@app/configs/reactotron').then(() =>
  console.log('[success] reactotron configured'),
);

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

/**
 * @const {configLinking}
 * @summary this constant use for config navigation
 * on index Navigation
 * ---------------------------------------------------- *
 */
export const linking = {
  prefixes: [GLOBAL.APP_DEEPLINK.prefix],
  config: {screens: GLOBAL.APP_DEEPLINK.scheme},
};
