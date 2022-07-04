import React, {useContext, useState, useEffect, useRef} from 'react';
import {Colors} from '@app/styles';
import {TouchableRipple} from 'react-native-paper';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';
import Icon from 'react-native-vector-icons/Feather';
import Section from '@app/components/Section';
import CheckoutCouponCode from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/_coupon';
import CheckoutGiftCard from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/_gift';
import CheckoutMyPoint from '@app/_modules/cart_checkout/atoms/BlockPaymentOthers/_point';
import Divider from '@app/components/Divider';
import Label from '@app/components/Label';
import Show from '@app/components/Show';
import i18next from 'i18next';
import {useReactiveVar} from '@apollo/client';
import {rxUserType, rxUserTheme} from '@app/services/cache';
import {USER_CUSTOMER} from '@app/helpers/Constants';

const BlockPaymentOthers = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [dataOthers, setDataOthers] = useState([]);
  const ctxCheckout = useContext(CheckoutContext);
  const mount = useRef();
  const getRxUserType = useReactiveVar(rxUserType);
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary for initialize selected block value
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      // init
      let tempOtherData = [
        {
          label: i18next.t('cart_checkout.enterCouponCode'),
          component: CheckoutCouponCode,
        },
      ];

      if (getRxUserType === USER_CUSTOMER) {
        tempOtherData = [
          ...tempOtherData,
          {
            label: i18next.t('cart_checkout.applyGiftCard'),
            component: CheckoutGiftCard,
          },
          {
            label: i18next.t('cart_checkout.spendYourPoints'),
            component: CheckoutMyPoint,
          },
        ];
      }

      setDataOthers(tempOtherData);

      const onInitSelectedBlock = () => {
        let newDataOthers = {};
        for (const dataOtherIndex in dataOthers) {
          newDataOthers[dataOtherIndex] = false;
        }
        setSelectedBlock(newDataOthers);
      };
      onInitSelectedBlock();
    }
    return () => (mount.current = false);
  }, []);

  if (!ctxCheckout?.isCart?.selectedShippingMethod) {
    return null;
  }
  return (
    <Section marginTop={20} width={'100%'}>
      <Section
        border={2}
        borderColor={Colors.GRAY_DARK}
        borderRadius={10}
        style={{opacity: ctxCheckout?.isCart?.loadingButtonOrder ? 0.4 : 1}}>
        {dataOthers.map((item, index) => {
          const PaymentOthersComponent = item?.component;
          const isSelected = selectedBlock ? selectedBlock[index] : false;
          return (
            <TouchableRipple
              key={`payment-other-item-${index}`}
              onPress={() =>
                setSelectedBlock({
                  ...selectedBlock,
                  [index]: !selectedBlock[index],
                })
              }>
              <Section>
                <Section paddingHorizontal={20} paddingVertical={20}>
                  <Section row>
                    <Section width={'80%'}>
                      <Label>{item.label}</Label>
                    </Section>
                    <Section width={'20%'} horizontalEnd>
                      <Icon
                        name={isSelected ? 'chevron-up' : 'chevron-down'}
                        color={
                          getRxUserTheme === 'dark'
                            ? Colors.WHITE
                            : Colors.GRAY_SMOOTH4
                        }
                        size={25}
                      />
                    </Section>
                  </Section>
                  <Show when={isSelected}>
                    <PaymentOthersComponent />
                  </Show>
                </Section>
                <Divider />
              </Section>
            </TouchableRipple>
          );
        })}
      </Section>
    </Section>
  );
};

export default BlockPaymentOthers;
