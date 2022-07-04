import React from 'react';
import PropTypes from 'prop-types';
import NavBarCustom from '@app/components/NavBar/atoms/NavBarCustom';
import NavBarHome from '@app/components/NavBar/atoms/NavBarHome';
import AppBarComponent from '@app/components/NavBar/atoms/AppBar';
import SearchBar from '@app/components/NavBar/atoms/SearchBar';
import AddonSearchBar from '@app/components/NavBar/atoms/AddonSearchBar';
import {
  TYPE_NAVBAR_CUSTOM,
  TYPE_NAVBAR_HOME,
  TYPE_APPBAR,
  TYPE_SEARCHBAR,
  TYPE_ADDON_SEARCHBAR,
} from '@app/helpers/Constants';

const NavBar = props => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const {type} = props;
  if (type === TYPE_NAVBAR_CUSTOM) {
    return <NavBarCustom {...props} />;
  }
  if (type === TYPE_NAVBAR_HOME) {
    return <NavBarHome {...props} />;
  }
  if (type === TYPE_APPBAR) {
    return <AppBarComponent {...props} />;
  }
  if (type === TYPE_SEARCHBAR) {
    return <SearchBar {...props} />;
  }
  if (type === TYPE_ADDON_SEARCHBAR) {
    return <AddonSearchBar {...props} />;
  }
};

NavBar.propTypes = {
  // use for displaying logo or not
  useLogo: PropTypes.bool,
  // use for displaying back button or not
  useBack: PropTypes.bool,
  // use back press
  useBackPress: PropTypes.func,
  // use for displaying search can be input:true or touch:false
  useSearch: PropTypes.bool,
  // use for embed some component in right side
  childrenRight: PropTypes.element,
  // use for displaying title,
  title: PropTypes.string,
  // use for displaying subtitle,
  subtitle: PropTypes.string,
  // search text
  searchText: PropTypes.string,
  // func search
  onSearchTextChange: PropTypes.func,
};

export default NavBar;
