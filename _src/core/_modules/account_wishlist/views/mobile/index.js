import React from 'react';
import {FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Button from '@app/components/Button';
import {rxUserTheme} from '@app/services/cache';
import NavBar from '@app/components/NavBar';
import {TYPE_NAVBAR_CUSTOM, TYPE_APPBAR} from '@app/helpers/Constants';

const WishlistView = ({
  t,
  wishlist,
  onNavigateToProductDetail,
  onNavigateToAccount,
  userType,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const renderItem = ({item}) => {
    return (
      <Section
        padding={10}
        borderColor={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK}
        borderRadius={15}
        flexNumber={0.5}
        width={Mixins.MAX_WIDTH / 2}
        horizontalCenter
        verticalCenter
        marginVertical={10}
        marginHorizontal={10}
        onPress={() => onNavigateToProductDetail(item.url_key)}>
        {item.image ? (
          <FastImage
            key={item.url_key}
            style={{
              height: normalize(180),
              width: Mixins.MAX_WIDTH / 2 - 30,
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: item.image,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
          />
        ) : (
          <Section
            height={180}
            width={Mixins.MAX_WIDTH / 2 - 30}
            backgroundColor={Colors.GRAY_LIGHT}
          />
        )}
        <Label small center>
          {item.name}
        </Label>
      </Section>
    );
  };

  if (userType === 'guest') {
    return (
      <Section flex>
        <NavBar
          type={TYPE_NAVBAR_CUSTOM}
          useBack
          title={t('account_wishlist.title.wishlist')}
        />
        <Section horizontalCenter verticalCenter flex width={Mixins.MAX_WIDTH}>
          <Label style={{marginBottom: 20}}>
            {t('label.pleaseLoginFirst')};
          </Label>
          <Button
            label={t('account_wishlist.label.goToLogin')}
            onPress={onNavigateToAccount}
          />
        </Section>
      </Section>
    );
  } else {
    return (
      <FlatList
        ListHeaderComponent={
          <NavBar
            type={TYPE_APPBAR}
            useBack
            title={t('account_wishlist.title.wishlist')}
          />
        }
        ListHeaderComponentStyle={{
          marginBottom: normalize(20),
        }}
        numColumns={2}
        style={{width: Mixins.MAX_WIDTH}}
        data={wishlist}
        renderItem={renderItem}
        keyExtractor={item => item.wishlistId.toString()}
        ListEmptyComponent={
          wishlist ? (
            <Label center>{t('account_wishlist.view.noData')}</Label>
          ) : (
            <ActivityIndicator />
          )
        }
      />
    );
  }
};

WishlistView.propTypes = {
  // translation for any labels
  t: PropTypes.func,
  // wishlist data
  wishlist: PropTypes.array,
  // function callback to specific item
  onNavigateToProductDetail: PropTypes.func,
  // function callback button to login
  onNavigateToAccount: PropTypes.func,
  // shows what is current user type
  userType: PropTypes.string,
};

export default WishlistView;
