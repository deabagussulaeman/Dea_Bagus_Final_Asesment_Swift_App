import React from 'react';
import {Image} from 'react-native';
import {Appbar, Colors} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import styles from '@app/components/NavBar/atoms/NavBarCustom/views/mobile/styles';
import SearchBar from '@app/components/NavBar/atoms/SearchBar/index';
import {rxAppSnackbar, rxUserToken} from '@root/_src/core/services/cache';
import {useReactiveVar} from '@apollo/client';
import {modules} from '@root/swift.config';
import {navigateTo} from '@app/helpers/Navigation';

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
  const getRxUserToken = useReactiveVar(rxUserToken); // add script for asesment task (author: Dea Bagus Sulaeman)

  if (useLogo || useSearch) {
    let widthCenterSection = useBack ? '67%' : '58%';
    
    // start edit script for asesment task (author: Dea Bagus Sulaeman)
    if (!childrenRight || getRxUserToken === null) {
      if(useBack){
        widthCenterSection = '84%';
      } else {
        widthCenterSection = '75%';
      }
    }
    // end edit script for asesment task (author: Dea Bagus Sulaeman)
    
    return (
      // edit script 'styles.deaHeader' for asesment task (author: Dea Bagus Sulaeman)
      <Appbar.Header style={styles.deaHeader}>
        <Section style={styles.frameNavbar}>
          {useBack && (
            <Appbar.BackAction
              color={Colors.white}
              onPress={() => navigation.goBack()}
            />
          )}

          {!useBack && (
            <Section style={styles.frameBackButton} onPress={() => navigateTo(modules.dea_module.enable, modules.dea_module.name)}>
              <Image
                source={require('@app/assets/images/dea-logo.png')}
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
          
          {getRxUserToken !== null && (
            <Section style={styles.frameRightChildren}>{childrenRight}</Section>
          )}
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
