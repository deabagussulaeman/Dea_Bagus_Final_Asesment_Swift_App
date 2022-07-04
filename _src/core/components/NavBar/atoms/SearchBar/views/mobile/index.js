import React, {useRef, useEffect} from 'react';
import {TextInput} from 'react-native';
import {TouchableRipple, Colors} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import Label from '@app/components/Label';
import PropTypes from 'prop-types';
import IconIon from 'react-native-vector-icons/Ionicons';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import styles from '@app/components/NavBar/atoms/SearchBar/views/mobile/styles';

const SearchBar = ({
  useSearch,
  searchText,
  childrenRight,
  onSearchTextChange,
  searchInputStyle,
}) => {
  /**
   * ---------------------------------------------------- *
   * @constant {hooks}
   * ---------------------------------------------------- *
   */
  const {t} = useTranslation();
  const searchInputRef = useRef(null);
  const mount = useRef();

  /**
   * ---------------------------------------------------- *
   * @constant {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current) {
      searchInputRef?.current?.focus();
    }
    return () => (mount.current = false);
  }, []);

  return (
    <TouchableRipple
      underlayColor={Colors.white}
      style={
        childrenRight ? styles.frameSearchbar : styles.frameSearchbarMainSearch
      }
      onPress={() => {
        navigateTo(modules.main_search.enable, modules.main_search.name);
      }}>
      <Section
        style={
          childrenRight
            ? styles.frameSearchInput
            : styles.frameSearchInputMainSearch
        }>
        <IconIon name="search" color={Colors.grey400} size={16} />
        <Show when={useSearch}>
          <TextInput
            ref={searchInputRef}
            value={searchText}
            style={[styles.frameSearchText, searchInputStyle]}
            placeholder={t('textPlaceholder.search') + '...'}
            placeholderTextColor={Colors.gray500}
            onChangeText={text => onSearchTextChange(text)}
          />
        </Show>
        <Show when={!useSearch}>
          <Label style={[styles.frameSearchText]} color={Colors.grey500}>
            {t('textPlaceholder.search') + '...'}
          </Label>
        </Show>
      </Section>
    </TouchableRipple>
  );
};

SearchBar.propTypes = {
  // use for displaying search can be input:true or touch:false
  useSearch: PropTypes.bool,
  // event for search text change
  onSearchTextChange: PropTypes.func,
  // search text
  searchText: PropTypes.string,
};

export default SearchBar;
