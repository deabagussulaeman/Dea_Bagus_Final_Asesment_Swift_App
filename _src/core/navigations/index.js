import React, {useState, useMemo, useRef, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigationRef} from '@app/helpers/Navigation';
import {useReactiveVar} from '@apollo/client';
import {rxAppMaintenance, rxUserTheme, rxUserToken} from '@app/services/cache';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {StackAuth} from '@app/navigations/_stack-auth';
import {StackApp} from '@app/navigations/_stack-app';
import {NavigatorContext} from '@app/helpers/Context';
import {Provider as PaperProvider, ActivityIndicator} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {Colors} from '@app/styles/index';
import {modules} from '@root/swift.config';
import {Storage} from '@app/helpers/Storage';
import {DARK, LIGHT} from '@app/helpers/Constants';
import {linking} from '@app/configs/global';
import {Appearance} from 'react-native';

import CustomDarkTheme from '@app/styles/themes/dark';
import CustomLightTheme from '@app/styles/themes/light';
import AppLoader from '@app/components/Loader/index';
import AppSnackBar from '@app/components/SnackBar/index';
import DialogUpdate from '@app/components/DialogUpdate';
import Label from '@app/components/Label';
import useAppInitialize from '@app/hooks/_useAppInitialize';
import MaintenanceMode from '@app/_modules/maintenance_mode';
import SplashScreen from 'react-native-splash-screen';

export const Stack = createStackNavigator();

const AppNavigator = () => {
  const {updates, loadingUser, content} = useAppInitialize();

  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const [, setIsDarkTheme] = useState(false);
  const themeScheme = Appearance.getColorScheme();
  const getRxUserToken = useReactiveVar(rxUserToken);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const getRxAppMaintenance = useReactiveVar(rxAppMaintenance);
  const routeNameRef = useRef();
  const isThemeDark = getRxUserTheme === DARK || themeScheme === DARK;
  const theme = isThemeDark ? CustomDarkTheme : CustomLightTheme;
  const {t} = useTranslation();

  /**
   * ---------------------------------------------------- *
   * @function {useEffect}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);

  useEffect(async () => {
    const themeLocal = await Storage.get(Storage.name.USER_THEME);
    if (themeLocal) {
      rxUserTheme(themeLocal);
    }
  }, []);

  useEffect(() => {
    const themeStyle = isThemeDark ? DARK : LIGHT;
    rxUserTheme(themeStyle);
  }, [getRxUserTheme]);

  /**
   * ---------------------------------------------------- *
   * @function {useMemo}
   * ---------------------------------------------------- *
   */
  const navigatorContext = useMemo(
    () => ({
      toggleTheme: () => {
        setIsDarkTheme(isDarkThemeNew => !isDarkThemeNew);
      },
    }),
    [],
  );

  /**
   * ---------------------------------------------------- *
   * @function onNavigatorContainerStateChange
   * on navigator state change
   * ---------------------------------------------------- *
   */
  const onNavigatorContainerStateChange = () => {
    try {
      const currentRouteName =
        navigationRef?.current.getCurrentRoute() === undefined
          ? ''
          : navigationRef?.current.getCurrentRoute().name;

      routeNameRef.current = currentRouteName;
    } catch (e) {
      console.log('[err] navigator container state change', e);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onNavigatorReady
   * on navigator ready
   * ---------------------------------------------------- *
   */
  const onNavigatorReady = () => {
    try {
      routeNameRef.current = navigationRef.current.getCurrentRoute().name;
    } catch (err) {
      console.log('[err] navigator on ready', err);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onScreenSwitchMain
   * @summary switch main screen between app | auth
   * ---------------------------------------------------- *
   */
  const onScreenSwitchMain = () => {
    return getRxUserToken === null ? StackAuth() : StackApp();
  };

  /**
   * ---------------------------------------------------- *
   * @returns {render}
   * ---------------------------------------------------- *
   */
  if (loadingUser) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={Colors.PRIMARY} size="large" />
        <Label style={{marginTop: 20}}> {t('label.pleaseWait') + '...'}</Label>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaperProvider theme={theme}>
        <NavigatorContext.Provider value={navigatorContext}>
          <NavigationContainer
            theme={theme}
            linking={linking}
            ref={navigationRef}
            onStateChange={onNavigatorContainerStateChange}
            onReady={onNavigatorReady}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              {/* SCREEN MAIN */}
              {!getRxAppMaintenance && onScreenSwitchMain()}

              {/* SCREEN MAINTENANCE */}
              {getRxAppMaintenance && (
                <Stack.Screen
                  key={modules.maintenance_mode.name}
                  name={modules.maintenance_mode.name}
                  component={MaintenanceMode}
                />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </NavigatorContext.Provider>

        {/* FORCE UPDATE */}
        <DialogUpdate visible={updates} content={content} />
        <AppLoader />
        <AppSnackBar />
      </PaperProvider>
    </SafeAreaView>
  );
};

export default AppNavigator;
