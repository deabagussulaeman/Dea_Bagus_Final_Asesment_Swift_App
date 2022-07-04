import {Fragment} from 'react';
import {useReactiveVar} from '@apollo/client';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import {DARK, LARGE, MEDIUM, SMALL} from '@app/helpers/Constants';
import {Storage} from '@app/helpers/Storage';
import {rxUserFontSize, rxUserTheme} from '@app/services/cache';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import React, {useState} from 'react';
import Label from '@app/components/Label';
import RadioButton from '@app/components/RadioButton';
import {useTranslation} from 'react-i18next';

const fontSizeItemList = [SMALL, MEDIUM, LARGE];

const ItemLine = ({selectedFontSize, index}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  let inactiveBorderDarkThemeColor =
    getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK;

  return (
    <Section
      height={2}
      borderColor={
        selectedFontSize ? Colors.PRIMARY : inactiveBorderDarkThemeColor
      }
      flex
      style={{
        alignSelf: 'center',
        //  marginTop: normalize(25)
        marginBottom: 17,
      }}
    />
  );
};

const FontSizeItem = ({sizeItem, selectedFontSize, setUserFontSize}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  const {size, label} = sizeItem;

  return (
    <Section
      horizontalCenter
      verticalCenter
      marginVertical={3}
      onPress={() => setUserFontSize(size)}>
      <RadioButton
        selected={selectedFontSize === size}
        size={normalize(20)}
        activeColor={getRxUserTheme === DARK ? Colors.WHITE : Colors.PRIMARY}
      />
      <Label
        style={{
          color: getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK,
        }}>
        {label[0]}
      </Label>
    </Section>
  );
};

const SampleText = ({selectedFontSize, t}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  return (
    <Section
      width={Mixins.MAX_WIDTH * 0.9}
      borderRadius={25}
      borderColor={Colors.GRAY_MEDIUM}
      horizontalCenter
      verticalCenter
      padding={20}
      marginVertical={20}>
      <Label
        style={{
          fontSize: normalize(16) * selectedFontSize,
          color: getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK,
        }}>
        {t('label.testFont')}
      </Label>
    </Section>
  );
};

const FontSizeSelector = () => {
  const getRxUserFontSize = useReactiveVar(rxUserFontSize);
  const [selectedFontSize, setSelectedFontSize] = useState(getRxUserFontSize);
  const {t} = useTranslation();

  const setUserFontSize = size => {
    rxUserFontSize(size);
    setSelectedFontSize(size);
    Storage.set(Storage.name.USER_FONT_SIZE, size);
  };

  return (
    <Section horizontalCenter verticalCenter horizontalStart>
      <Section horizontalStart padding={20}>
        <Label large>{t('label.fontSize')}</Label>
        <SampleText selectedFontSize={selectedFontSize} t={t} />
      </Section>
      <Section
        horizontalCenter
        verticalCenter
        row
        width="100%"
        spaceAround
        paddingHorizontal={30}
        paddingVertical={10}>
        {fontSizeItemList.map((fontSizeItem, index) => {
          return (
            <Fragment key={index}>
              <FontSizeItem
                sizeItem={fontSizeItem}
                selectedFontSize={selectedFontSize}
                setUserFontSize={setUserFontSize}
              />
              <Show when={index !== fontSizeItemList.length - 1}>
                <ItemLine />
              </Show>
            </Fragment>
          );
        })}
      </Section>
    </Section>
  );
};

export default FontSizeSelector;
