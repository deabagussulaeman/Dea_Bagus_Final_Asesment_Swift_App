import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_GIFT_CARD_ACCOUNT} from '@app/_modules/account_gift_card/services/schema';
import Views from '@app/_modules/account_gift_card/views';
import {modules} from '@root/swift.config';

const GiftCardController = () => {
  if (!modules.account_gift_card.enable) {
    return null;
  }

  const {t} = useTranslation();
  const [giftCardAccount, setGiftCardAccount] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const {data: giftCardAccountData, onRefetchData: loadGetGiftCardAccount} =
    useCustomQuery({schema: GET_GIFT_CARD_ACCOUNT});

  const onCheckStatusAndBalance = async giftCardCode => {
    if (giftCardCode && giftCardCode !== '') {
      try {
        setIsChecked(true);
        await loadGetGiftCardAccount({
          params: {
            giftCardCode,
          },
        });
      } catch (error) {
        // console.log('ERROR', error);
      }
    }
  };

  useEffect(() => {
    if (giftCardAccountData?.data) {
      setGiftCardAccount(giftCardAccountData?.data.giftCardAccount);
    }
  }, [giftCardAccountData]);

  const controllerProps = {
    t,
    giftCardAccount,
    isChecked,
    loading: giftCardAccountData.loading,
    onCheckStatusAndBalance,
  };

  return <Views {...controllerProps} />;
};

export default GiftCardController;
