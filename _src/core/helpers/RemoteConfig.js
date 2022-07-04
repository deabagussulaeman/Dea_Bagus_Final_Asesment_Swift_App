import remoteConfig from '@react-native-firebase/remote-config';
import {TYPE_BOOLEAN, TYPE_NUMBER, TYPE_STRING} from '@app/helpers/Constants';

/**
 * ----------------------------------------- *
 * @function getParameterValue
 * @param {String} parameter - parameter name
 * @param {String} type - parameter's data type (string/number/booelan)
 * @summary parameter value
 * ----------------------------------------- *
 */
export const getParameterValue = ({parameter = null, type = 'string'}) => {
  if (parameter !== null) {
    const parameterData = remoteConfig().getValue(parameter);
    switch (type) {
      case TYPE_BOOLEAN:
        return parameterData.asBoolean();
      case TYPE_NUMBER:
        return parameterData.asNumber();
      case TYPE_STRING:
        return parameterData.asString();
      default:
        break;
    }
    return null;
  }
  return null;
};
