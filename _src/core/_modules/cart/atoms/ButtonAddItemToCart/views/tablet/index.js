import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {rxAppSnackbar} from '@app/services/cache';
import {Button} from 'react-native-paper';
import useCarts from '@app/hooks/carts/useCarts';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';
import Label from '@app/components/Label';
import QuantityBlock from '@app/_modules/cart/atoms/QuantityBlock';
import Show from '@app/components/Show';
import {Colors} from '@app/styles';
import {TYPENAME_BUNDLE} from '@app/helpers/Constants';

const ButtonAddItemToCart = ({
  item,
  name = '',
  parent_sku,
  type,
  children,
  propStyle = {},
  selectedOptions,
  disabled = false,
  showIncreaseDecrease = true,
  onPress,
  skuProduct,
}) => {
  const {addToCart: addItemToCart} = useCarts({
    initialized: false,
  });
  const {t} = useTranslation();
  const [loading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  /**
   * ---------------------------------------------------- *
   * @function addToCart
   * @summary for add item to cart event
   * ---------------------------------------------------- *
   */
  const addToCart = async () => {
    // console.log('addToCart', item, selectedOptions);
    if (item.__typename === TYPENAME_BUNDLE && selectedOptions.length < 1) {
      rxAppSnackbar({
        message: t('cart.add_to_cart.label.haventSelectOption'),
      });
    } else if (quantity > 0) {
      await addItemToCart({
        item,
        quantity,
        types: type,
        parentSku: parent_sku,
        selectedOptions,
        skuProduct,
      });
      // startTransaction(`
      //   Add to cart mutation ${cartId}
      //   ${JSON.stringify(variables)}
      //   `);
      //   AnalyticsHelper.eventAddItemCart({item, quantity});
      //   rxAppSnackbar({
      //     message: t('cart.add_to_cart.label.productSuccess'),
      //   });
      //   finishTransaction();
      //   if (error.graphQLErrors[0]) {
      //     rxAppSnackbar({
      //       message: error.graphQLErrors[0].message,
      //     });
      //   }
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onIncreaseQuantity
   * @summary for add +1 quantity product in modal
   * ---------------------------------------------------- *
   */
  const onIncreaseQuantity = () => {
    let newQty = 0;
    if (quantity !== '') {
      newQty = parseInt(quantity) + 1;
    } else {
      newQty = 1;
    }
    setQuantity(newQty);
  };

  /**
   * ---------------------------------------------------- *
   * @function decreaseQuantity
   * @summary for add -1 quantity product in modal
   * ---------------------------------------------------- *
   */
  const onDecreaseQuantity = () => {
    if (quantity !== '' && parseInt(quantity) > 1) {
      const newQty = parseInt(quantity) - 1;
      setQuantity(newQty);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function renderButtonText
   * @summary for rendering button with text
   * ---------------------------------------------------- *
   */
  const renderButtonText = () => {
    if (children) {
      return children;
    } else {
      return <Label>+</Label>;
    }
  };

  return (
    <>
      <Section row>
        <Show when={showIncreaseDecrease}>
          <QuantityBlock
            name={name}
            quantity={quantity}
            onChangeQuantity={qty => setQuantity(qty)}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseQuantity={onDecreaseQuantity}
            onSubmit={addToCart}
            submitLabel={t('cart.add_to_cart.label.addToCart')}
            loading={loading}
          />
        </Show>
        <Button
          style={[
            propStyle,
            disabled ? {backgroundColor: Colors.SECONDARY} : {},
          ]}
          disabled={disabled}
          onPress={() => {
            onPress ? onPress() : addToCart();
          }}>
          {renderButtonText()}
        </Button>
      </Section>
    </>
  );
};

ButtonAddItemToCart.propTypes = {
  // item add to cart
  item: PropTypes.object,
  // name for quantity block
  name: PropTypes.string,
  // as a param in add to cart
  parent_sku: PropTypes.string,
  // as a param in add to cart
  type: PropTypes.string,
  // condition for returning label
  children: PropTypes.any,
  // style in button
  propStyle: PropTypes.object,
  // as a param in add to cart
  selectedOptions: PropTypes.any,
  // used in button
  disabled: PropTypes.bool,
  // as a render if condition
  showIncreaseDecrease: PropTypes.bool,
  // function on press add to cart
  onPress: PropTypes.func,
  // as a param in add to cart
  skuProduct: PropTypes.any,
};

export default ButtonAddItemToCart;
