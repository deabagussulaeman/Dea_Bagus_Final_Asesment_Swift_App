import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import {formatDateOrder, numberFormat} from '@app/helpers/General';
import {Colors, Mixins} from '@app/styles';
import {rxUserTheme} from '@app/services/cache';
import PropTypes from 'prop-types';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const RewardPointView = ({
  t,
  rewardPointsTransactions,
  currentBalance,
  loading,
  onLoadMore,
  noMoreData,
  refreshing,
  onRefresh,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const CurrentBalance = ({currentBalance: currentBalanceParam}) => {
    if (!currentBalanceParam) {
      return (
        <Section backgroundColor={Colors.PRIMARY} padding={20} horizontalStart>
          <ActivityIndicator color={Colors.WHITE} />
        </Section>
      );
    }
    return (
      <Section backgroundColor={Colors.PRIMARY} padding={20} horizontalStart>
        <Label white bold>
          {t('account_rewardpoint.view.currentBalance')}{' '}
          {numberFormat({
            prefix: currentBalanceParam.currency,
            value: currentBalanceParam.value,
          })}
        </Label>
      </Section>
    );
  };

  const FooterElement = () => {
    return (
      <>
        <Show when={loading}>
          <Section margin={20} horizontalCenter verticalCenter>
            <ActivityIndicator />
          </Section>
        </Show>
        <Show when={!loading}>
          <Section margin={20}>
            <Show when={noMoreData}>
              <Label>{t('account_rewardpoint.view.noMoreData')}</Label>
            </Show>
          </Section>
        </Show>
      </>
    );
  };

  const TransactionItem = ({item, index}) => {
    const adjustmentText =
      item.points < 0 ? `-${item.points}` : `+${item.points}`;

    let evenRowColor = getRxUserTheme === 'dark' ? Colors.GRAY : Colors.WHITE;
    let oddRowColor =
      getRxUserTheme === 'dark' ? Colors.SECONDARY : Colors.GRAY_SMOOTH;
    const backgroundColor = index % 2 === 1 ? evenRowColor : oddRowColor;

    return (
      <Section
        backgroundColor={backgroundColor}
        row
        paddingHorizontal={20}
        height={100}>
        <Section
          horizontalCenter
          verticalCenter
          height={100}
          width={50}
          paddingVertical={15}
          backgroundColor={backgroundColor}>
          <Label>{item.transactionId}</Label>
        </Section>
        <Section
          height={100}
          paddingVertical={15}
          horizontalStart
          horizontalCenter
          verticalCenter
          backgroundColor={backgroundColor}>
          <Label bold>{adjustmentText}</Label>
          <Label>{item.comment}</Label>
          <Label>{formatDateOrder(item.transactionDate)}</Label>
        </Section>
      </Section>
    );
  };

  return (
    <>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_rewardpoint.title.rewardPoints')}
      />
      <CurrentBalance currentBalance={currentBalance} />
      <FlatList
        style={{width: Mixins.MAX_WIDTH}}
        data={rewardPointsTransactions}
        renderItem={TransactionItem}
        keyExtractor={item => item.transactionId.toString()}
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

RewardPointView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // data of reward point transcactions
  rewardPointsTransactions: PropTypes.array,
  // shows current balance
  currentBalance: PropTypes.object,
  // shows loading
  loading: PropTypes.bool,
  // function to load more
  onLoadMore: PropTypes.func,
  // condition to show label if true
  noMoreData: PropTypes.bool,
  // condition for refresh control
  refreshing: PropTypes.bool,
  // function for refresh
  onRefresh: PropTypes.func,
};

export default RewardPointView;
