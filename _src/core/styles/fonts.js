import {useReactiveVar} from '@apollo/client';
import {rxUserFontFamily} from '../services/cache';

const fonts = [
  {
    font_id: 1,
    name: 'Roboto',
    bold: 'Roboto-Bold',
    regular: 'Roboto-Regular',
  },
  {
    font_id: 2,
    name: 'Mulish',
    bold: 'Mulish-Bold',
    regular: 'Mulish-Regular',
  },
];

export const availableFont = fonts;

export const fontFamily = () => {
  const getRxUserFontFamily = useReactiveVar(rxUserFontFamily);

  if (getRxUserFontFamily && getRxUserFontFamily.font_id) {
    let useFont = fonts.find(
      font => font.font_id === getRxUserFontFamily.font_id,
    );

    if (useFont) {
      return useFont;
    } else {
      return fonts[0];
    }
  }
  return fonts[0];
};
