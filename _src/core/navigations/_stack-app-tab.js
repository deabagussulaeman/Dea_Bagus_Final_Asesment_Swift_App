import React, {useEffect, useState} from 'react';
import Label from '@app/components/Label';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {modules} from '@root/swift.config';
import {Colors} from '@app/styles';
import {normalize, isBigDevice} from '@app/styles/mixins';
import {navigateTo} from '@app/helpers/Navigation';
import useNavAppInitialize from '@app/hooks/_useNavAppInitialize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainHome from '@app/_modules/main_home';
import MainCategories from '@app/_modules/main_categories/index';
import Cart from '@app/_modules/cart';
import AccountWishlist from '@app/_modules/account_wishlist';
import Account from '@app/_modules/account';
import {useReactiveVar} from '@apollo/client';
import {
  rxCartDataItem,
  rxCartInitLoading,
  rxUserTheme,
} from '@app/services/cache';
import {DARK} from '@app/helpers/Constants';
import Circle from '@app/components/Circle';
import Show from '@app/components/Show';

const styles = {
  mobile: {
    paddingHorizontal: normalize(25),
  },
  tablet: {
    width: normalize(20),
  },
};

const Tab = createBottomTabNavigator();

const StackAppTab = () => {
  /**
   * ---------------------------------------------------- *
   * @function useNavAppInitialize
   * @summary this use for initialize top of stack app
   * ---------------------------------------------------- *
   */
  useNavAppInitialize();
  const [cartCount, setCartCount] = useState(0);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const iconSize = isBigDevice ? normalize(20) : normalize(25);
  const style = isBigDevice ? styles.tablet : styles.mobile;
  const getRxCartDataItem = useReactiveVar(rxCartDataItem);
  const getRxCartInitLoading = useReactiveVar(rxCartInitLoading);
  let focusedTabColor = getRxUserTheme === DARK ? Colors.WHITE : Colors.PRIMARY;
  const tabBarOptions = {showLabel: false, keyboardHidesTabBar: true};

  useEffect(() => {
    if (getRxCartDataItem) {
      let qtyCounter = 0;
      const itemInCartNoHide = getRxCartDataItem?.filter(item => !item.hide);
      itemInCartNoHide.map(item => (qtyCounter += item.quantity));
      setCartCount(qtyCounter);
    }
  }, [getRxCartDataItem]);

  return (
    <Tab.Navigator tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name={modules.main_home.name}
        key={modules.main_home.name}
        component={MainHome}
        listeners={() => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigateTo(modules.main_home.enable, modules.main_home.name);
          },
        })}
        options={{
          tabBarLabel: ({focused}) => (
            <Label
              style={{
                color: focused ? focusedTabColor : Colors.GRAY_DARK,
                fontWeight: 'bold',
              }}>
              {modules.main_home.name}
            </Label>
          ),
          tabBarIcon: ({focused}) => (
            <Icon
              name={'home'}
              style={style}
              size={iconSize}
              color={focused ? focusedTabColor : Colors.GRAY_DARK}
            />
          ),
        }}
      />
      <Tab.Screen
        name={modules.main_categories.name}
        key={modules.main_categories.name}
        component={MainCategories}
        listeners={() => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigateTo(
              modules.main_categories.enable,
              modules.main_categories.name,
            );
          },
        })}
        options={{
          tabBarLabel: ({focused}) => (
            <Label
              style={{
                color: focused ? focusedTabColor : Colors.GRAY_DARK,
                fontWeight: 'bold',
              }}>
              {modules.main_categories.name}
            </Label>
          ),
          tabBarIcon: ({focused}) => (
            <Icon
              name={'microsoft'}
              style={style}
              size={iconSize}
              color={focused ? focusedTabColor : Colors.GRAY_DARK}
            />
          ),
        }}
      />
      <Tab.Screen
        name={modules.cart.name}
        key={modules.cart.name}
        component={Cart}
        listeners={() => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigateTo(modules.cart.enable, modules.cart.name);
          },
        })}
        options={{
          tabBarLabel: ({focused}) => (
            <Label
              style={{
                color: focused ? focusedTabColor : Colors.GRAY_DARK,
                fontWeight: 'bold',
              }}>
              {modules.cart.name}
            </Label>
          ),
          tabBarIcon: ({focused}) => (
            <>
              <Icon
                name={'cart'}
                style={style}
                size={iconSize}
                color={focused ? focusedTabColor : Colors.GRAY_DARK}
              />
              <Show when={cartCount || getRxCartInitLoading}>
                <Circle
                  color={focused ? Colors.GRAY_DARK : Colors.PRIMARY}
                  number={cartCount}
                  textColor={Colors.WHITE}
                  textSize={isBigDevice ? 12 : cartCount < 100 ? 10 : 9}
                  size={isBigDevice ? 25 : 18}
                  topPosition={0}
                  rightPosition={isBigDevice ? -10 : 20}
                  loading={getRxCartInitLoading}
                />
              </Show>
            </>
          ),
        }}
      />
      <Tab.Screen
        name={modules.account_wishlist.name}
        key={modules.account_wishlist.name}
        component={AccountWishlist}
        listeners={() => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigateTo(
              modules.account_wishlist.enable,
              modules.account_wishlist.name,
            );
          },
        })}
        options={{
          tabBarLabel: ({focused}) => (
            <Label
              style={{
                color: focused ? focusedTabColor : Colors.GRAY_DARK,
                fontWeight: 'bold',
              }}>
              {modules.account_wishlist.name}
            </Label>
          ),
          tabBarIcon: ({focused}) => (
            <Icon
              name={'heart'}
              style={style}
              size={iconSize}
              color={focused ? focusedTabColor : Colors.GRAY_DARK}
            />
          ),
        }}
      />
      <Tab.Screen
        name={modules.account.name}
        key={modules.account.name}
        component={Account}
        listeners={() => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigateTo(modules.account.enable, modules.account.name);
          },
        })}
        options={{
          tabBarLabel: ({focused}) => (
            <Label
              style={{
                color: focused ? focusedTabColor : Colors.GRAY_DARK,
                fontWeight: 'bold',
              }}>
              {modules.account.name}
            </Label>
          ),
          tabBarIcon: ({focused}) => (
            <Icon
              name={'account'}
              style={style}
              size={iconSize}
              color={focused ? focusedTabColor : Colors.GRAY_DARK}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StackAppTab;
