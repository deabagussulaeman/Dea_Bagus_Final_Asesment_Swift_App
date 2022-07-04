import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_CUSTOMER_REWARD_POINTS} from '@app/_modules/account_rewardpoint/services/schema';
import Views from '@app/_modules/account_rewardpoint/views';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';

const RewardPointController = () => {
  if (!modules.account_rewardpoint.enable) {
    return null;
  }

  const [rewardPointsTransactions, setRewardPointsTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [queryVariables, setQueryVariables] = useState({
    pageSize: 6,
    currentPage: 1,
  });
  const {data: rewardPointsTransactionsData, loading} = useCustomQuery({
    schema: GET_CUSTOMER_REWARD_POINTS,
    useInitData: true,
    variables: queryVariables,
  });
  const {t} = useTranslation();

  useEffect(() => {
    if (rewardPointsTransactionsData && rewardPointsTransactionsData?.data) {
      const {balance, balanceCurrency} =
        rewardPointsTransactionsData?.data.customerRewardPoints;
      setCurrentBalance({
        currency: balanceCurrency,
        value: balance,
      });

      const {items, total_count} =
        rewardPointsTransactionsData?.data.customerRewardPoints
          .transaction_history;
      const currentData = rewardPointsTransactions;
      const newData = [...currentData, ...items];
      setRewardPointsTransactions(newData);
      setTotalCount(total_count);
    }
  }, [rewardPointsTransactionsData]);

  const onLoadMore = () => {
    if (!loading) {
      if (rewardPointsTransactions.length !== totalCount) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);

        const queryVariablesTmp = {
          ...queryVariables,
          currentPage: newPage,
        };
        setQueryVariables(queryVariablesTmp);
      } else {
        setNoMoreData(true);
      }
    }
  };

  const onRefresh = async () => {
    await setRefreshing(true);
    await setRewardPointsTransactions([]);
    const queryVariablesTmp = {
      ...queryVariables,
      currentPage: 1,
    };
    await setCurrentPage(1);
    await setNoMoreData(false);
    await setQueryVariables(queryVariablesTmp);
    await setRefreshing(false);
  };

  const controllerProps = {
    t,
    loading,
    refreshing,
    rewardPointsTransactions,
    currentBalance,
    noMoreData,
    onLoadMore,
    onRefresh,
  };

  return <Views {...controllerProps} />;
};

export default RewardPointController;
