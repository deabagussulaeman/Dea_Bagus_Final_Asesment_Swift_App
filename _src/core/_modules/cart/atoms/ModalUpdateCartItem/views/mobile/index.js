import React, {useEffect, useState} from 'react';
import {useReactiveVar} from '@apollo/client';
import {rxCartId, rxAppSnackbar} from '@app/services/cache';
import {useTranslation} from 'react-i18next';
import QuantityModal from '@app/_modules/cart/atoms/QuantityModal';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';

const ModalUpdateCartItem = ({
  cartItemId,
  initialQuantity = 0,
  name = '',
  children,
  propStyle = {},
}) => {
  const getRxCartId = useReactiveVar(rxCartId);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [variables, setVariables] = useState({});
  const [quantity, setQuantity] = useState(0);
  const {t} = useTranslation();
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  useEffect(() => {
    if (getRxCartId) {
      // setVariables({
      //   input: {
      //     cart_id: getRxCartId,
      //     cart_items: [
      //       {
      //         cart_item_id: cartItemId,
      //         quantity,
      //       },
      //     ],
      //   },
      // });
    }
  }, [getRxCartId, cartItemId, quantity]);

  const updateCartItem = async () => {
    if (quantity > 0) {
      setLoading(true);
      try {
        rxAppSnackbar({
          message: t('cart.modal_update_cart_item.message.cartUpdate'),
        });
        setLoading(false);
        setShowModal(false);
      } catch (error) {
        // console.log(error);
        rxAppSnackbar({
          message: t('cart.modal_update_cart_item.error.message'),
        });
        setLoading(false);
        setShowModal(false);
      }
    }
  };

  const incereaseQuantity = () => {
    let newQty = 0;
    if (quantity !== '') {
      newQty = parseInt(quantity) + 1;
    } else {
      newQty = 1;
    }
    setQuantity(newQty);
  };

  const decreaseQuantity = () => {
    if (quantity !== '' && parseInt(quantity) > 1) {
      const newQty = parseInt(quantity) - 1;
      setQuantity(newQty);
    }
  };

  const renderButtonText = () => {
    if (children) {
      return children;
    } else {
      return <Label>{t('cart.modal_update_cart_item.view.update')}</Label>;
    }
  };

  return (
    <>
      <QuantityModal
        visible={showModal}
        name={name}
        quantity={quantity}
        onChangeQuantity={qty => setQuantity(qty)}
        onIncreaseQuantity={incereaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onSubmit={updateCartItem}
        submitLabel={t('cart.modal_update_cart_item.label.updateQuantity')}
        loading={loading}
        onBackBackButtonPress={() => setShowModal(false)}
      />
      <Section onPress={() => setShowModal(true)} style={propStyle}>
        {renderButtonText()}
      </Section>
    </>
  );
};

ModalUpdateCartItem.propTypes = {
  // cart item id
  cartItemId: PropTypes.number,
  // initial quantity set
  initialQuantity: PropTypes.number,
  // as a quantity modal name
  name: PropTypes.string,
  // as a condition in render button text
  children: PropTypes.any,
  // styles props
  propStyle: PropTypes.object,
};

export default ModalUpdateCartItem;
