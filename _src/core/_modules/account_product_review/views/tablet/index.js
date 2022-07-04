import React from 'react';
import {FlatList, SafeAreaView, RefreshControl} from 'react-native';
import {Colors} from '@app/styles';
import {ActivityIndicator} from 'react-native-paper';
import Show from '@app/components/Show';
import NavBar from '@app/components/NavBar/index';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

const FooterElement = ({loading}) => {
  return (
    <Show when={loading}>
      <ActivityIndicator />
    </Show>
  );
};

const AccountProductReviewScreen = ({
  t,
  data,
  loading,
  onPressCart,
  refreshing,
  onLoadMore,
  onRefresh,
}) => {
  const RenderItem = ({item, index}) => {
    return (
      <Section
        key={`${index}-${item?.id}`}
        padding={20}
        borderColor={Colors.GRAY_LIGHT}
        style={{borderBottomWidth: 1}}>
        <Section paddingVertical={5}>
          <Label small bold>
            {t('account_product_review.view.productName')}
          </Label>
          <Label small>{item.product.name}</Label>
        </Section>
        <Section row paddingVertical={5}>
          <Section flex>
            <Label small bold>
              {t('account_product_review.view.created')}
            </Label>
            <Label small>{item.created_at}</Label>
          </Section>
          <Section flex>
            <Label small bold>
              {t('account_product_review.view.rating')}
            </Label>
            <Label small>{item.ratings_breakdown[0].value}</Label>
          </Section>
        </Section>
        <Section paddingTop={5}>
          <Label small>{item.text}</Label>
        </Section>
      </Section>
    );
  };

  return (
    <SafeAreaView>
      <NavBar
        useBack
        type={TYPE_NAVBAR_CUSTOM}
        title={t('account_product_review.title.productReview')}
      />
      <Show when={!loading}>
        <Section
          backgroundColor={Colors.YELLOW_LIGHT}
          horizontalCenter
          verticalCenter
          paddingVertical={30}>
          <Label small center>
            {t('account_product_review.view.myProductReview')}
          </Label>
        </Section>
        <FlatList
          data={data}
          renderItem={RenderItem}
          keyExtractor={item => item.created_at.toString()}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<FooterElement loading={loading} />}
          ListFooterComponentStyle={{alignSelf: 'center'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Section horizontalCenter paddingVertical={20}>
              <Label small center>
                {t('account_product_review.view.noProductReviewData')}
              </Label>
            </Section>
          }
        />
      </Show>
    </SafeAreaView>
  );
};

export default AccountProductReviewScreen;
