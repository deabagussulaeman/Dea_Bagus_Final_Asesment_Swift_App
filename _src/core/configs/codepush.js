import Config from 'react-native-config';
import codePush from 'react-native-code-push';
import {IS_IOS} from '@app/helpers/Constants';

const codePushOptions = {
  deploymentKey: IS_IOS ? Config.CODEPUSH_KEY_IOS : Config.CODEPUSH_KEY_ANDROID,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

export default codePushOptions;
