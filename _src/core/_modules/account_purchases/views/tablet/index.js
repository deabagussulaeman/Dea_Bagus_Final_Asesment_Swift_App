import React from 'react';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import RenderItemList from '@app/components/RenderItem';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {useReactiveVar} from '@apollo/client';
import {formatDateOrder} from '@app/helpers/General';
import {Colors, Mixins} from '@app/styles';
import {Button, ActivityIndicator} from 'react-native-paper';
import {FlatList, RefreshControl} from 'react-native';
import {rxUserTheme} from '@app/services/cache';
import PropTypes from 'prop-types';
import styles from '@app/_modules/account_purchases/views/tablet/styles';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const AccountPurchasesTabletView = ({
  t,
  onNavigateToPdp,
  customerOrders,
  loading,
  onLoadMore,
  noMoreData,
  refreshing,
  onRefresh,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const FooterElement = () => {
    if (loading) {
      return <ActivityIndicator />;
    }

    return (
      <Section horizontalCenter VerticalCenter margin={20}>
        <Show when={noMoreData}>
          <Label>{t('account_purchases.view.noMoreData')}</Label>
        </Show>
      </Section>
    );
  };

  const OrderItem = ({item, index}) => {
    const evenRowColor = getRxUserTheme === 'dark' ? Colors.GRAY : Colors.WHITE;
    const oddRowColor =
      getRxUserTheme === 'dark' ? Colors.SECONDARY : Colors.GRAY_SMOOTH;
    const backgroundColor = index % 2 === 0 ? evenRowColor : oddRowColor;
    const orderNumber = item.order_number;
    return (
      <RenderItemList itemKey={index}>
        <Section
          backgroundColor={backgroundColor}
          horizontalCenter
          row
          spaceBetween
          paddingHorizontal={Mixins.MAX_WIDTH * 0.1}
          paddingVertical={20}>
          <Section horizontalStart backgroundColor={backgroundColor}>
            <Label bold>
              {t('account_purchases.view.orderNo')}
              {item.order_number}
            </Label>
            <Label small>{formatDateOrder(item.created_at)}</Label>
            <Label style={styles.orderStatusText}>{item.status_label}</Label>
          </Section>
          <Section row backgroundColor={backgroundColor}>
            <Button
              mode="contained"
              onPress={() => onNavigateToPdp(orderNumber)}>
              {t('account_purchases.btn.detail')}
            </Button>
          </Section>
        </Section>
      </RenderItemList>
    );
  };

  return (
    <>
      <NavBar type={TYPE_APPBAR} useBack title={t('account.menu.purchases')} />
      <FlatList
        style={{width: Mixins.MAX_WIDTH}}
        data={customerOrders}
        renderItem={OrderItem}
        keyExtractor={item => item.order_number.toString()}
        ListFooterComponent={FooterElement}
        ListFooterComponentStyle={{alignSelf: 'center'}}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
};

AccountPurchasesTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // data
  customerOrders: PropTypes.array,
  // shows loading
  loading: PropTypes.bool,
  // condition to show data
  noMoreData: PropTypes.bool,
  // function to load more
  onLoadMore: PropTypes.func,
  // func to navigate to spesific order number
  onNavigateToPdp: PropTypes.func,
  // function for refresh
  onRefresh: PropTypes.func,
  // condition to refresh control
  refreshing: PropTypes.bool,
};

export default AccountPurchasesTabletView;
