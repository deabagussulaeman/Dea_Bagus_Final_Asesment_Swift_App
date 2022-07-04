import React, {useContext, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {TextInput} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';
import {Colors} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import Section from '@app/components/Section';
import styles from '@app/_modules/cart/atoms/CustomInputQty/views/mobile/styles';
import {CartContext} from '@app/_modules/cart/_controller';
import useCarts from '@app/hooks/carts/useCarts';
import PropTypes from 'prop-types';

/**
 * ----------------------------------------- *
 * CustomInputQuantity
 * it will be rendered only if
 * (modules.cart.atoms.update_item_qty_input.enable)
 * is true (enabled)
 * @param {initialQuantity, cartItemId}
 * ----------------------------------------- *
 */
const CustomInputQty = ({initialQuantity = 0, cartItemId, item}) => {
  const {updateQuantity} = useCarts({
    initialized: false,
  });

  const [loading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const ctxCart = useContext(CartContext);
  /**
   * ----------------------------------------- *
   * call color hooks fro theme (dark mode)
   * @return color, getRxUserTheme
   * ----------------------------------------- *
   */
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const color = getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK;
  const mount = useRef();

  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      setQuantity(initialQuantity);
    }
    return () => {
      mount.current = false;
    };
  }, []);

  useEffect(() => {
    if (mount.current) {
      setQuantity(initialQuantity);
    }
  }, [initialQuantity]);
  /**
   * ----------------------------------------- *
   * @function onIncreaseQuantity
   * this function will be called when
   * we incrase the qty of an item on cart page
   * then will trigger onUpdateCartItem
   * function to run which will be update qty
   * item by one up (addition)
   * ----------------------------------------- *
   */
  const onIncreaseQuantity = async () => {
    ctxCart?.setCartContextProps({
      ...ctxCart?.cartContextProps,
      loading: true,
    });

    await updateQuantity({
      item,
      qty: quantity + 1,
    });

    ctxCart?.setCartContextProps({
      ...ctxCart?.cartContextProps,
      loading: false,
    });
  };

  /**
   * ----------------------------------------- *
   * @function onDecreaseQuantity
   * this function will be called when
   * we incrase the qty of an item on cart page
   * then will trigger onUpdateCartItem
   * function to run which will be update qty
   * item by one down (substraction)
   * ----------------------------------------- *
   */
  const onDecreaseQuantity = async () => {
    if (quantity > 1) {
      ctxCart?.setCartContextProps({
        ...ctxCart?.cartContextProps,
        loading: true,
      });

      await updateQuantity({
        item,
        qty: quantity - 1,
      });

      ctxCart?.setCartContextProps({
        ...ctxCart?.cartContextProps,
        loading: false,
      });
    }
  };

  /**
   * ----------------------------------------- *
   * @function onEndEditing
   * this function will be called when
   * we edit the qty of an item on cart page
   * ----------------------------------------- *
   */
  const onEndEditing = async () => {
    if (quantity === '' || quantity === 0 || quantity === initialQuantity) {
      setQuantity(initialQuantity);
    } else if (quantity > 0) {
      ctxCart?.setCartContextProps({
        ...ctxCart?.cartContextProps,
        loading: true,
      });

      await updateQuantity({
        item,
        qty: quantity,
      });

      ctxCart?.setCartContextProps({
        ...ctxCart?.cartContextProps,
        loading: false,
      });
    }
  };

  /**
   * ----------------------------------------- *
   * @function onCheckLimit
   * check input limit on
   * ----------------------------------------- *
   */
  const onCheckLimit = value => {
    const parsedQty = parseInt(value);
    if (!isNaN(parsedQty)) {
      setQuantity(parsedQty);
    } else {
      setQuantity('');
    }
  };

  switch (loading) {
    case true:
      return <ActivityIndicator />;
    default:
      return (
        <Section style={styles.customInputQty}>
          <Section
            onPress={
              ctxCart?.cartContextProps?.loading ? () => {} : onDecreaseQuantity
            }>
            <Icon name="minuscircleo" size={normalize(20)} color={color} />
          </Section>
          <TextInput
            value={quantity.toString()}
            keyboardType="number-pad"
            editable={true}
            onEndEditing={onEndEditing}
            onChangeText={onCheckLimit}
            style={[
              styles.quantityInput,
              {
                color: color,
                borderColor: color,
              },
            ]}
          />
          <Section
            onPress={
              ctxCart?.cartContextProps?.loading ? () => {} : onIncreaseQuantity
            }>
            <Icon name="pluscircleo" size={normalize(20)} color={color} />
          </Section>
        </Section>
      );
  }
};

CustomInputQty.propTypes = {
  // initialQuantity set
  initialQuantity: PropTypes.number,
  // id of item
  cartItemId: PropTypes.any,
  // item to update qty
  item: PropTypes.any,
};

export default CustomInputQty;
