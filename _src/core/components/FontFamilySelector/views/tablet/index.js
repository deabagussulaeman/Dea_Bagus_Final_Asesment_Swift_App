import {Fragment, useEffect} from 'react';
import {useReactiveVar} from '@apollo/client';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import {DARK} from '@app/helpers/Constants';
import {Storage} from '@app/helpers/Storage';
import {rxUserFontFamily, rxUserTheme} from '@app/services/cache';
import {Colors} from '@app/styles';
import {normalize, MAX_WIDTH} from '@app/styles/mixins';
import React, {useState} from 'react';
import Label from '@app/components/Label';
import RadioButton from '@app/components/RadioButton';
import {availableFont} from '@app/styles/fonts';
import {useTranslation} from 'react-i18next';

const ItemLine = ({selectedFontFamily, index}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  let inactiveBorderDarkThemeColor =
    getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK;

  return (
    <Section
      key={index}
      height={2}
      borderColor={
        selectedFontFamily ? Colors.PRIMARY : inactiveBorderDarkThemeColor
      }
      flex
      style={{
        alignSelf: 'center',
        marginBottom: 17,
      }}
    />
  );
};

const FontFamilyItem = ({
  font,
  selectedFontFamily,
  setUserFontFamily,
  scheme,
}) => {
  const {name} = font;

  return (
    <Section
      horizontalCenter
      verticalCenter
      marginVertical={3}
      onPress={() => setUserFontFamily(font)}>
      <RadioButton
        selected={selectedFontFamily === font}
        size={normalize(17)}
        activeColor={scheme === DARK ? Colors.WHITE : Colors.PRIMARY}
      />
      <Label
        style={{
          color: scheme === DARK ? Colors.WHITE : Colors.BLACK,
        }}>
        {name}
      </Label>
    </Section>
  );
};

const FontFamilySelector = () => {
  const [selectedFontFamily, setSelectedFontFamily] = useState(null);
  const getUserFontFamily = useReactiveVar(rxUserFontFamily);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const fonts = availableFont;
  const {t} = useTranslation();

  const setUserFontFamily = font => {
    rxUserFontFamily(font);
    setSelectedFontFamily(font);
    Storage.set(Storage.name.USER_FONT_FAMILY, font);
  };

  useEffect(() => {
    setSelectedFontFamily(getUserFontFamily ? getUserFontFamily : fonts[0]);
    if (!getUserFontFamily) {
      rxUserFontFamily(fonts[0]);
    }
  }, []);

  return (
    <Section
      paddingHorizontal={MAX_WIDTH * 0.1}
      horizontalCenter
      verticalCenter
      horizontalStart>
      <Section horizontalStart padding={20}>
        <Label
          large
          style={{
            color: getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK,
          }}>
          {t('label.fontFamily')}
        </Label>
      </Section>
      <Section
        horizontalCenter
        verticalCenter
        row
        width="100%"
        spaceAround
        paddingHorizontal={30}
        paddingVertical={10}>
        {fonts.map((font, index) => {
          return (
            <Fragment key={index}>
              <FontFamilyItem
                font={font}
                selectedFontFamily={selectedFontFamily}
                setUserFontFamily={setUserFontFamily}
                scheme={getRxUserTheme}
              />
              <Show when={index !== fonts.length - 1}>
                <ItemLine />
              </Show>
            </Fragment>
          );
        })}
      </Section>
    </Section>
  );
};

export default FontFamilySelector;
