import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import {formatDateOrder} from '@app/helpers/General';
import {Colors, Mixins} from '@app/styles';
import {navigateTo} from '@app/helpers/Navigation';
import {rxUserTheme} from '@app/services/cache';
import Button from '@app/components/Button';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import PropTypes from 'prop-types';
import styles from '@app/_modules/account_myreturn/views/mobile/styles';
import {modules} from '@root/swift.config';
import {TYPE_APPBAR} from '@app/helpers/Constants';

const AccountMyReturnMobileView = ({
  t,
  customerReturns,
  loading,
  onLoadMore,
  noMoreData,
  refreshing,
  onRefresh,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const ReturnsItem = ({item, index}) => {
    let evenRowbackgroundColor =
      getRxUserTheme === 'dark' ? Colors.GRAY : Colors.WHITE;
    let oddRowbackgroundColor =
      getRxUserTheme === 'dark' ? Colors.SECONDARY : Colors.GRAY_SMOOTH;
    let backgroundColor =
      index % 2 === 0 ? evenRowbackgroundColor : oddRowbackgroundColor;
    let order_number = item.order_number;
    let increment_id = item.increment_id;

    return (
      <Section
        row
        spaceBetween
        paddingHorizontal={20}
        width={Mixins.MAX_WIDTH}
        paddingVertical={10}
        height={100}
        style={[{backgroundColor}]}>
        <Section flex horizontalStart backgroundColor={backgroundColor}>
          <Section row backgroundColor={backgroundColor} marginVertical={5}>
            <Label bold>
              {t('account_myreturn.view.returnNo')}
              {item.increment_id}
            </Label>
            <Label xsmall>({formatDateOrder(item.order_date)})</Label>
          </Section>
          <Label>{t('account_myreturn.view.items')}</Label>
          {item.items.map(returnItem => (
            <Section row backgroundColor={backgroundColor}>
              <Label style={{paddingHorizontal: 5}}>{'\u2B24'}</Label>
              <Label style={{flexWrap: 'wrap'}}>{returnItem.name}</Label>
            </Section>
          ))}

          <Label style={{fontStyle: 'italic'}}>{item.status.name}</Label>
        </Section>
        <Section
          style={{alignSelf: 'center'}}
          backgroundColor={backgroundColor}>
          <Button
            label={t('account_myreturn.btn.detail')}
            styleProp={styles.detailsButton}
            textStyleProp={styles.detailsButtonText}
            onPress={() =>
              navigateTo(
                modules.account_myreturn_detail.enable,
                modules.account_myreturn_detail.name,
                {
                  order_number,
                  increment_id,
                },
              )
            }
          />
        </Section>
      </Section>
    );
  };

  const FooterElement = () => {
    if (loading) {
      return <ActivityIndicator />;
    }

    return (
      <Section
        width={Mixins.MAX_WIDTH}
        horizontalCenter
        verticalCenter
        paddingVertical={20}>
        <Show when={noMoreData}>
          <Label>{t('account_myreturn.view.noMoreData')}</Label>
        </Show>
      </Section>
    );
  };

  return (
    <>
      <NavBar
        type={TYPE_APPBAR}
        useBack
        title={t('account_myreturn.title.myReturn')}
      />
      <FlatList
        style={{width: Mixins.MAX_WIDTH}}
        data={customerReturns}
        renderItem={ReturnsItem}
        keyExtractor={item => item.increment_id.toString()}
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

AccountMyReturnMobileView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // shows as data
  customerReturns: PropTypes.array,
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

export default AccountMyReturnMobileView;
