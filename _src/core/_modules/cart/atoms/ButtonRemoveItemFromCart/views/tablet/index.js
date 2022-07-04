import React, {useContext, useState} from 'react';
import Label from '@app/components/Label';
import {ActivityIndicator} from 'react-native-paper';
import useCarts from '@app/hooks/carts/useCarts';
import Section from '@app/components/Section';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {CartContext} from '@app/_modules/cart/_controller';

const ButtonRemoveItemFromCart = ({
  cartItemId,
  product,
  children,
  item,
  propStyle = {},
}) => {
  const [loading] = useState(false);
  const {removeFromCart} = useCarts({
    initialized: false,
  });

  const {t} = useTranslation();
  const ctxCart = useContext(CartContext);

  /**
   * ----------------------------------------- *
   * @function onRemoveCartItem
   * @summary remove item on cart
   * ----------------------------------------- *
   */
  const onRemoveCartItem = async () => {
    ctxCart?.setCartContextProps({
      ...ctxCart?.cartContextProps,
      loading: true,
    });

    await removeFromCart({item});

    ctxCart?.setCartContextProps({
      ...ctxCart?.cartContextProps,
      loading: false,
    });
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <Section
      onPress={ctxCart?.cartContextProps?.loading ? () => {} : onRemoveCartItem}
      style={propStyle}>
      {children ? (
        children
      ) : (
        <Label>{t('cart.button_remove_item_from_cart.view.delete')}</Label>
      )}
    </Section>
  );
};

ButtonRemoveItemFromCart.propTypes = {
  // cart item id
  cartItemId: PropTypes.any,
  // product
  product: PropTypes.any,
  // children
  children: PropTypes.any,
  // the item that want to remove from cart
  item: PropTypes.any,
  // style props
  propStyle: PropTypes.object,
};

export default ButtonRemoveItemFromCart;
