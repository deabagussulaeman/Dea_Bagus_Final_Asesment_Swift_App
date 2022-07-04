import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_CUSTOMER_REQUESTS} from '@app/_modules/account_myreturn/services/schema';
import Views from '@app/_modules/account_myreturn/views';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';

const MyReturnController = () => {
  if (!modules.account_myreturn.enable) {
    return null;
  }

  const {t} = useTranslation();
  const [customerReturns, setCustomerReturns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [queryVariables, setQueryVariables] = useState({
    pageSize: 6,
    currentPage: 1,
  });

  const {data: customerReturnsData, loading} = useCustomQuery({
    schema: GET_CUSTOMER_REQUESTS,
    useInitData: true,
    variables: queryVariables,
  });

  useEffect(() => {
    if (customerReturnsData?.data?.getCustomerRequestAwRma) {
      if (!noMoreData) {
        const {items, total_count} =
          customerReturnsData?.data?.getCustomerRequestAwRma;
        const currentData = customerReturns;
        const newData = [...currentData, ...items];

        setCustomerReturns(newData);
        setTotalCount(total_count);

        if (total_count === newData.length) {
          setNoMoreData(true);
        }
      }
    }
  }, [customerReturnsData]);

  const onLoadMore = () => {
    if (!loading) {
      if (totalCount > customerReturns.length) {
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
    const queryVariablesTmp = {
      ...queryVariables,
      currentPage: 1,
    };
    await setRefreshing(true);
    await setCustomerReturns([]);
    await setCurrentPage(1);
    await setNoMoreData(false);
    await setQueryVariables(queryVariablesTmp);
    await setRefreshing(false);
  };

  const controllerProps = {
    t,
    loading,
    refreshing,
    customerReturns,
    noMoreData,
    onLoadMore,
    onRefresh,
  };

  return <Views {...controllerProps} />;
};

export default MyReturnController;
