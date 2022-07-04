import crashlytics from '@react-native-firebase/crashlytics';
import {STACKTRACE_DETAIL} from '@app/helpers/Constants';

export const errorHandler = (error, stackTrace) => {
  crashlytics().log(error.toString());
  crashlytics().setAttribute(STACKTRACE_DETAIL, stackTrace);
  crashlytics().recordError(new Error(error), error.toString());
};
