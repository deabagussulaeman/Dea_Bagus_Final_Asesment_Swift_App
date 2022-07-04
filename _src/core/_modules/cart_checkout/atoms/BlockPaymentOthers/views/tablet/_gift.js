import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FORM_FIELD} from '@app/helpers/Constants';
import {useReactiveVar} from '@apollo/client';
import {rxAppSnackbar, rxCartId} from '@app/services/cache';
import {TouchableRipple} from 'react-native-paper';
import {CHECK_GIFT_CARD} from '@app/_modules/cart_checkout/services/schema';
import {getErrorGQL, numberFormat} from '@app/helpers/General';
import {Colors} from '@app/styles';
import {
  APPLY_GIFT_CARD,
  REMOVE_GIFT_CARD,
} from '@app/_modules/cart/services/schema';
import {CheckoutContext} from '@app/_modules/cart_checkout/_controller';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Forms from '@app/components/_Forms';
import useCarts, {TYPES} from '@app/hooks/carts/useCarts';
import useCustomQuery from '@app/hooks/useCustomQuery';
import useCustomMutation from '@app/hooks/useCustomMutation';
import Show from '@app/components/Show';
import _ from 'lodash';

/**
 * ---------------------------------------------------- *
 * @const {styles}
 * @summary for react style
 * ---------------------------------------------------- *
 */
const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  btnCheckBalance: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

/**
 * ---------------------------------------------------- *
 * @component CheckoutGiftCard
 * @summary MAIN_COMPONENT
 * ---------------------------------------------------- *
 */
const CheckoutGiftCard = () => {
  const {t} = useTranslation();
  const getRxCartId = useReactiveVar(rxCartId);
  const ctxCheckout = useContext(CheckoutContext);

  const [dataGiftCard, setDataGiftCard] = useState({
    loading: false,
    isApplied: false,
    isError: false,
    code: null,
    balance: null,
  });
  const {onRefetchData: onApplyCartGiftCard} = useCustomMutation({
    schema: APPLY_GIFT_CARD,
  });
  const {onRefetchData: onRemoveCartGiftCard} = useCustomMutation({
    schema: REMOVE_GIFT_CARD,
  });
  const {onRefetchData: onCheckDataGiftCard} = useCustomQuery({
    schema: CHECK_GIFT_CARD,
    useInitData: false,
  });
  const {setCart: setDataPrice} = useCarts({
    initialized: false,
    type: TYPES.PRICE,
  });
  const {data: getDataGiftCards, setCart: setGiftCard} = useCarts({
    initialized: false,
    type: TYPES.APPLIED_GIFTCARD,
  });
  const {setCart: setAvailablePaymentMethod} = useCarts({
    initialized: false,
    type: TYPES.AVAILABLE_PAYMENT,
  });
  const getGiftCardsDetail = getDataGiftCards?.giftcard_detail;
  /**
   * ---------------------------------------------------- *
   * @function onProcessGiftCard
   * @param {data} object react form hooks
   * @summary for process gift card | applied | remove
   * ---------------------------------------------------- *
   */
  const onProcessGiftCard = async data => {
    const giftCardCode = data?.giftCardCode;
    // check data gift card
    if (data?.isCheckBalance) {
      try {
        const res = await onCheckDataGiftCard({
          paramsOpt: {isReturn: true},
          params: {giftCardCode},
        });

        if (res) {
          const getError = getErrorGQL(res);
          if (getError.isError) {
            setDataGiftCard({
              ...dataGiftCard,
              isError: getError.isError,
              balance: getError.message,
            });
            return;
          }
          const dataRes = res?.data;
          const giftCardAccount = dataRes?.giftCardAccount;
          const balance = giftCardAccount?.balance;
          setDataGiftCard({...dataGiftCard, isError: false, balance});
        }
      } catch (err) {
        console.log('[err] check balance', err);
        setDataGiftCard({...dataGiftCard, balance: t('label.noData')});
      }
      return;
    }

    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    // applied gift card
    try {
      const cart_id = getRxCartId;
      const res = await onApplyCartGiftCard({
        paramsOpt: {isReturn: true},
        params: {
          input: {
            cart_id,
            giftcard_code: data?.giftCardCode,
          },
        },
      });

      const dataParams = _.get(res, 'data.applyGiftCardToCart.cart');
      if (dataParams) {
        setGiftCard(dataParams);
        setDataPrice(dataParams);
        setAvailablePaymentMethod();
      }
      ctxCheckout?.setIsCart({
        ...ctxCheckout?.isCart,
        loadingButtonOrder: false,
      });
    } catch (err) {
      ctxCheckout?.setIsCart({
        ...ctxCheckout?.isCart,
        loadingButtonOrder: false,
      });
      console.log('[err] applied gift card', err);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @const {onRemoveGiftCard}
   * @summary remove gift card
   * ---------------------------------------------------- *
   */
  const onRemoveGiftCard = async code => {
    ctxCheckout?.setIsCart({
      ...ctxCheckout?.isCart,
      loadingButtonOrder: true,
    });

    try {
      const cart_id = getRxCartId;
      const res = await onRemoveCartGiftCard({
        paramsOpt: {isReturn: true},
        params: {
          input: {
            cart_id,
            giftcard_code: code,
          },
        },
      });
      const getError = getErrorGQL(res);
      if (getError.isError) {
        rxAppSnackbar({
          message: getError.message,
        });
        ctxCheckout?.setIsCart({
          ...ctxCheckout?.isCart,
          loadingButtonOrder: false,
        });
        return;
      }
      const dataParams = _.get(res, 'data.applyGiftCardToCart.cart');
      setGiftCard(dataParams);
      setDataPrice();
      setAvailablePaymentMethod();
      ctxCheckout?.setIsCart({
        ...ctxCheckout?.isCart,
        loadingButtonOrder: false,
      });
    } catch (err) {
      ctxCheckout?.setIsCart({
        ...ctxCheckout?.isCart,
        loadingButtonOrder: false,
      });
      console.log('[err] remove gift card', err);
    }
  };

  /**
   * ---------------------------------------------------- *
   * @const {formInputInfo}
   * @summary for data form input info
   * ---------------------------------------------------- *
   */
  const formInputInfo =
    dataGiftCard.balance === null || dataGiftCard.balance === undefined
      ? false
      : dataGiftCard.isError
      ? dataGiftCard.balance
      : `${t('balance')}: ${numberFormat({value: dataGiftCard.balance})}`;

  /**
   * ---------------------------------------------------- *
   * @const {forms}
   * @summary for generate form builder object
   * ---------------------------------------------------- *
   */
  const forms = [
    {
      name: 'giftCardCode',
      type: FORM_FIELD.INPUT,
      defaultValue: '',
      autoCapitalize: 'none',
      value: '',
      rules: {},
      formInputInfo,
    },
    {
      name: 'isCheckBalance',
      type: FORM_FIELD.CUSTOM,
      renderItem: renderProps => {
        const handleSubmit = renderProps.handleSubmit;
        return (
          <Section horizontalCenter>
            <TouchableRipple
              style={styles.btnCheckBalance}
              onPress={handleSubmit(data => {
                data.isCheckBalance = true;
                onProcessGiftCard(data);
              })}>
              <Label bold underline color={Colors.PRIMARY}>
                {t('cart_checkout.label.checkBalance')}
              </Label>
            </TouchableRipple>
          </Section>
        );
      },
    },
  ];

  return (
    <Section marginTop={15}>
      <Show when={!dataGiftCard?.isApplied}>
        <Label bold>{t('cart_checkout.label.giftCardNumber')}</Label>
        <Forms
          resetAfterSubmit={true}
          fields={forms}
          buttonTitle={t('apply')}
          onSubmit={onProcessGiftCard}
          loading={dataGiftCard.loading}
          formContainerStyle={styles.formContainer}
        />
      </Show>
      <Show when={getGiftCardsDetail?.length > 0}>
        <Section marginTop={15}>
          {getGiftCardsDetail &&
            getGiftCardsDetail?.map((item, index) => {
              const giftCode = item?.giftcard_code;
              const giftAmount = item?.giftcard_amount_used;
              return (
                <Section row key={`gift-item-${index}`}>
                  <Section width={'50%'}>
                    <Label>{giftCode}</Label>
                    <Label small>{`${t('balance')}: ${numberFormat({
                      value: giftAmount,
                    })}`}</Label>
                  </Section>
                  <TouchableRipple
                    onPress={
                      ctxCheckout?.isCart?.loadingButtonOrder
                        ? () => {}
                        : () => onRemoveGiftCard(giftCode)
                    }
                    disabled={ctxCheckout?.isCart?.loadingButtonOrder}>
                    <Section marginLeft={5}>
                      <Label bold underline color={Colors.PRIMARY}>
                        {t('remove')}
                      </Label>
                    </Section>
                  </TouchableRipple>
                </Section>
              );
            })}
        </Section>
      </Show>
    </Section>
  );
};

export default CheckoutGiftCard;
