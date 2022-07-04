import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import PropTypes from 'prop-types';
import NavBar from '@app/components/NavBar';
import RadioButton from '@app/components/RadioButton';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

const LanguagesMobileView = ({languages, selectedLanguage, changeLanguage}) => {
  const {t} = useTranslation();
  const LanguageItemBar = ({label, onPress}) => {
    return (
      <TouchableOpacity style={styles.barContainer} onPress={onPress}>
        <RadioButton selected={selectedLanguage === label} onPress={onPress} />
        <Label style={styles.itemText}>{t(`account.language.${label}`)}</Label>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        useBack
        title={t('account.language.title')}
      />
      <Section>
        {languages.map(language => {
          return (
            <LanguageItemBar
              label={language}
              key={language}
              onPress={() => changeLanguage(language)}
            />
          );
        })}
      </Section>
    </>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    alignItems: 'center',
    borderColor: Colors.GRAY_DARK,
    borderBottomWidth: 0.5,
    width: '100%',
    flexDirection: 'row',
    padding: 15,
  },
  itemText: {
    marginHorizontal: normalize(10),
  },
});

LanguagesMobileView.propTypes = {
  // list of languages
  languages: PropTypes.array,
  // selected language
  selectedLanguage: PropTypes.string,
  // function to change language
  changeLanguage: PropTypes.func,
};

export default LanguagesMobileView;
