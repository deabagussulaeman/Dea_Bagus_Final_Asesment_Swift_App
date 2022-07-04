import React from 'react';
import {Image} from 'react-native';
import {Appbar, Colors} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import styles from '@root/_src/core/components/NavBar/atoms/NavBarCustom/views/mobile/styles';
import SearchBar from '@app/components/NavBar/atoms/SearchBar/index';

const NavBarCustom = ({
  useLogo = false,
  useClose = false,
  useBack = false,
  useBackPress,
  useSearch = false,
  searchText,
  searchInputStyle,
  onSearchTextChange,
  childrenRight,
  title,
  subtitle,
}) => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const navigation = useNavigation();

  if (useLogo || useSearch) {
    let widthCenterSection = useBack ? '67%' : '58%';
    if (!childrenRight) {
      widthCenterSection = '75%';
    }
    return (
      <Appbar.Header>
        <Section style={styles.frameNavbar}>
          {useBack && (
            <Appbar.BackAction
              color={Colors.white}
              onPress={() => navigation.goBack()}
            />
          )}

          {!useBack && (
            <Section style={styles.frameBackButton}>
              <Image
                source={require('@app/assets/images/swift-logo-white.png')}
                style={styles.frameLogo}
              />
            </Section>
          )}

          <Section style={[styles.frameSearch, {width: widthCenterSection}]}>
            <SearchBar
              useSearch={useSearch}
              searchText={searchText}
              childrenRight={childrenRight}
              onSearchTextChange={onSearchTextChange}
              searchInputStyle={searchInputStyle}
            />
          </Section>
          <Section style={styles.frameRightChildren}>{childrenRight}</Section>
        </Section>
      </Appbar.Header>
    );
  }

  const onBackPress = useBackPress ? useBackPress : () => navigation.goBack();
  return (
    <Appbar.Header>
      {useBack && (
        <Appbar.BackAction color={Colors.white} onPress={onBackPress} />
      )}
      {useClose && (
        <Appbar.Action
          icon="close"
          color={Colors.white}
          onPress={onBackPress}
        />
      )}
      <Appbar.Content title={title} subtitle={subtitle} />

      {childrenRight && (
        <Section style={styles.frameRightChildren}>{childrenRight}</Section>
      )}
    </Appbar.Header>
  );
};

NavBarCustom.propTypes = {
  // use logo
  useLogo: PropTypes.bool,
  // use back
  useBack: PropTypes.bool,
  // use back press
  useBackPress: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  // use search
  useSearch: PropTypes.bool,
  // search text
  searchText: PropTypes.string,
  // func search
  onSearchTextChange: PropTypes.func,
  // children
  childrenRight: PropTypes.any,
  // app content title
  title: PropTypes.string,
  // app content subtitle
  subtitle: PropTypes.string,
};

export default NavBarCustom;
