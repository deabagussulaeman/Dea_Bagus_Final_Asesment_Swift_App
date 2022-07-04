import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {normalize} from '@app/styles/mixins';
import {Colors, Mixins} from '@app/styles';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import Icon from 'react-native-vector-icons/Ionicons';
import Section from '@app/components/Section';
import AddonSearchBar from '@app/components/NavBar/atoms/AddonSearchBar';

const NavBarHome = () => {
  const NavIcon = ({name, onPress}) => {
    return (
      <Icon
        name={name}
        size={normalize(25)}
        color={Colors.PRIMARY}
        style={styles.navIcon}
        onPress={onPress}
      />
    );
  };

  return (
    <Section
      row
      horizontalCenter
      spaceAround
      height={50}
      width={Mixins.MAX_WIDTH}
      style={{...Mixins.boxShadow('#f2f2f2', 5)}}>
      <Image
        source={require('@app/assets/images/swift-logo.png')}
        style={styles.logoImage}
      />
      <AddonSearchBar />
      <Section row marginHorizontal={10}>
        <NavIcon
          name="ios-receipt-outline"
          onPress={() =>
            navigateTo(
              modules.account_trackorder.enable,
              modules.account_trackorder.name,
            )
          }
        />
        <NavIcon
          name="ios-cart"
          onPress={() => navigateTo(modules.cart.enable, modules.cart.name)}
        />
        <NavIcon
          name="ios-notifications-outline"
          onPress={() =>
            navigateTo(
              modules.account_notification.enable,
              modules.account_notification.name,
            )
          }
        />
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    resizeMode: 'contain',
    height: normalize(30),
  },

  navIcon: {
    marginHorizontal: normalize(10),
  },
});

export default NavBarHome;
