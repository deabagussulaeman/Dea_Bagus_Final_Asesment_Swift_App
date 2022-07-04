import React from 'react';
import {guestCheckout, modules, tabsApp} from '@root/swift.config';
import {Stack} from '@app/navigations';

import DeaModule from '@app/_modules/dea_module';
import AuthLanding from '@app/_modules/auth_landing';
import AuthLogin from '@app/_modules/auth_signin';
import AuthRegister from '@app/_modules/auth_signup';
import TabStackApp from '@app/navigations/_stack-app-tab';
import Blank from '@app/_modules/_blank';
import BlogDetail from '@app/_modules/blog_detail';
import BlogList from '@app/_modules/blog_list';
import ProductDetail from '@app/_modules/product_detail';
import ProductList from '@app/_modules/product_list';
import MainSearch from '@app/_modules/main_search';
import Cart from '@app/_modules/cart';
import CartCheckout from '@app/_modules/cart_checkout';
import CartCheckoutPwa from '@app/_modules/cart_checkout_pwa';
import CartThankYou from '@app/_modules/cart_thankyou';
import AccountAddAddress from '@app/_modules/account_add_address';

const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const renderGuestCheckout = () =>
  guestCheckout.enable ? (
    <Stack.Screen
      key={modules.cart_checkout.name}
      name={modules.cart_checkout.name}
      component={CartCheckout}
    />
  ) : (
    <></>
  );

const renderGuestCheckoutPWA = () =>
  guestCheckout.enable ? (
    <Stack.Screen
      key={modules.cart_checkout_pwa.name}
      name={modules.cart_checkout_pwa.name}
      component={CartCheckoutPwa}
    />
  ) : (
    <></>
  );
export const StackAuth = () => {
  return (
    <>
      <Stack.Screen
        key={modules.auth_landing.name}
        name={modules.auth_landing.name}
        component={AuthLanding}
      />
      <Stack.Screen
        key={modules.dea_module.name}
        name={modules.dea_module.name}
        component={DeaModule}
      />
      <Stack.Screen
        key={modules.auth_signin.name}
        name={modules.auth_signin.name}
        component={AuthLogin}
      />
      <Stack.Screen
        key={modules.auth_signup.name}
        name={modules.auth_signup.name}
        component={AuthRegister}
      />
      <Stack.Screen
        key={tabsApp.name}
        name={tabsApp.name}
        component={TabStackApp}
      />
      <Stack.Screen
        key={modules.main_search.name}
        name={modules.main_search.name}
        component={MainSearch}
        options={{cardStyleInterpolator: forFade}}
      />
      <Stack.Screen
        key={modules.blank.name}
        name={modules.blank.name}
        component={Blank}
      />
      <Stack.Screen
        key={modules.blog_detail.name}
        name={modules.blog_detail.name}
        component={BlogDetail}
      />
      <Stack.Screen
        key={modules.blog_list.name}
        name={modules.blog_list.name}
        component={BlogList}
      />
      <Stack.Screen
        key={modules.product_detail.name}
        name={modules.product_detail.name}
        component={ProductDetail}
      />
      <Stack.Screen
        key={modules.product_list.name}
        name={modules.product_list.name}
        component={ProductList}
      />
      {renderGuestCheckout()}
      {renderGuestCheckoutPWA()}
      <Stack.Screen
        key={modules.cart.name_alt}
        name={modules.cart.name_alt}
        component={Cart}
      />
      <Stack.Screen
        key={modules.cart_thankyou.name}
        name={modules.cart_thankyou.name}
        component={CartThankYou}
      />
      <Stack.Screen
        key={modules.account_address_add.name}
        name={modules.account_address_add.name}
        component={AccountAddAddress}
      />
    </>
  );
};
