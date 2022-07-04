import React, {useState} from 'react';
import {pageBuilder, PAGE_BUILDER_TYPE} from '@root/swift.config';
import HtmlType from '@app/components/PageBuilder/types/HtmlType';
import MegazonType from '@app/components/PageBuilder/types/MagezonType';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_MEGAZON_HOMEPAGE} from '@app/components/PageBuilder/services/schema';
import {ActivityIndicator, RefreshControl, ScrollView} from 'react-native';
import {Colors} from '@app/styles';
import Section from '@app/components/Section';
import {PAGE_BUILDER_IDENTIFIER} from '@app/helpers/Constants';
import NoData from '@app/components/NoData';

const PageBuilder = () => {
  if (!pageBuilder.enable) {
    return null;
  }

  const [refreshing, setRefreshing] = useState(false);
  const {data, loading, onRefetchData} = useCustomQuery({
    schema: GET_MEGAZON_HOMEPAGE,
    variables: {
      identifier: PAGE_BUILDER_IDENTIFIER,
    },
    useInitData: true,
  });

  const onRefresh = async () => {
    await setRefreshing(true);
    await onRefetchData({
      params: {
        identifier: PAGE_BUILDER_IDENTIFIER,
      },
      otherOpt: {fetchPolicy: 'network-only'},
    });
    await setRefreshing(false);
  };

  const PageBuilderNoData = () => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <NoData />
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <Section flex horizontalCenter verticalCenter>
        <ActivityIndicator size={32} color={Colors.PRIMARY} />
      </Section>
    );
  }

  if (data?.data?.cmsPage?.content) {
    const content = data.data.cmsPage.content;
    if (pageBuilder.type === PAGE_BUILDER_TYPE.MAGEZON) {
      return (
        <MegazonType
          content={content}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      );
    }

    if (pageBuilder.type === PAGE_BUILDER_TYPE.HTML) {
      return <HtmlType />;
    }

    return <PageBuilderNoData />;
  }

  return <PageBuilderNoData />;
};

export default PageBuilder;
