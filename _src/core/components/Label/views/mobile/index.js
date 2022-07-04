import React from 'react';
import {Text} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import {
  PRIMARY,
  ALERT,
  SECONDARY,
  BLACK,
  GRAY_DARK,
  WHITE,
} from '@app/styles/colors';
import {DARK} from '@app/helpers/Constants';
import {fontFamily} from '@app/styles/fonts';
import {rxUserFontSize, rxUserTheme} from '@app/services/cache';
import {Colors} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import PropTypes from 'prop-types';

const Label = ({
  onPress,
  children,
  style,
  required,
  color,
  size,
  bold,
  italic,
  underline,
  lineThrough,
  primary,
  secondary,
  gray,
  black,
  white,
  center,
  justify,
  left,
  right,
  bg,
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginTop,
  marginLeft,
  marginRight,
  marginBottom,
  marginHorizontal,
  marginVertical,
  verticalCenter,
  verticalStart,
  verticalEnd,
  horizontalCenter,
  horizontalStart,
  horizontalEnd,
  textCenter,
  alignText,
  selfCenter,
  selfStart,
  selfEnd,

  // size
  xxsmall,
  xsmall,
  small,
  large,
  xlarge,
  scaling = true,
}) => {
  const userFontFamily = fontFamily();
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const colorTheme = getRxUserTheme === DARK ? Colors.WHITE : Colors.BLACK;
  const getRxUserFontSize = useReactiveVar(rxUserFontSize);

  let fontSize = normalize(15);
  if (small) {
    fontSize = normalize(13);
  }
  if (xsmall) {
    fontSize = normalize(10);
  }
  if (xxsmall) {
    fontSize = normalize(8);
  }
  if (large) {
    fontSize = normalize(17);
  }
  if (xlarge) {
    fontSize = normalize(18);
  }
  if (scaling) {
    fontSize *= getRxUserFontSize;
  }
  return (
    <Text
      onPress={onPress}
      style={[
        style,
        {
          ...(required ? {color: ALERT} : null),
          ...(color ? {color} : {color: colorTheme}),
          ...(primary ? {color: PRIMARY} : null),
          ...(secondary ? {color: SECONDARY} : null),
          ...(black ? {color: BLACK} : null),
          ...(gray ? {color: GRAY_DARK} : null),
          ...(white ? {color: WHITE} : null),
          ...(size ? {fontSize: size} : fontSize ? {fontSize} : null),
          ...(bold
            ? {fontFamily: userFontFamily.bold}
            : {fontFamily: userFontFamily.regular}),
          ...(italic ? {fontStyle: 'italic'} : null),
          ...(underline ? {textDecorationLine: 'underline'} : null),
          ...(lineThrough
            ? {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
            : null),
          ...(center ? {textAlign: 'center'} : null),
          ...(justify ? {textAlign: 'justify'} : null),
          ...(left ? {textAlign: 'left'} : null),
          ...(right ? {textAlign: 'right'} : null),
          ...(bg ? {backgroundColor: bg} : null),
          ...(padding ? {padding} : null),
          ...(paddingTop ? {paddingTop} : null),
          ...(paddingBottom ? {paddingBottom} : null),
          ...(paddingLeft ? {paddingLeft} : null),
          ...(paddingRight ? {paddingRight} : null),
          ...(paddingHorizontal ? {paddingHorizontal} : null),
          ...(paddingVertical ? {paddingVertical} : null),
          ...(margin ? {margin} : null),
          ...(marginTop ? {marginTop} : null),
          ...(marginBottom ? {marginBottom} : null),
          ...(marginLeft ? {marginLeft} : null),
          ...(marginRight ? {marginRight} : null),
          ...(marginHorizontal ? {marginHorizontal} : null),
          ...(marginVertical ? {marginVertical} : null),
          ...(verticalCenter ? {justifyContent: 'center'} : null),
          ...(verticalStart ? {justifyContent: 'flex-start'} : null),
          ...(verticalEnd ? {justifyContent: 'flex-end'} : null),
          ...(horizontalCenter ? {alignItems: 'center'} : null),
          ...(horizontalStart ? {alignItems: 'flex-start'} : null),
          ...(horizontalEnd ? {alignItems: 'flex-end'} : null),
          ...(textCenter ? {textAlign: 'center'} : null),
          ...(alignText ? {textAlign: alignText} : null),
          ...(selfCenter ? {alignSelf: 'center'} : null),
          ...(selfStart ? {alignSelf: 'flex-start'} : null),
          ...(selfEnd ? {alignSelf: 'flex-end'} : null),
        },
      ]}>
      {children}
    </Text>
  );
};

Label.propTypes = {
  // func
  onPress: PropTypes.func,
  // children
  children: PropTypes.any,
  // style
  style: PropTypes.any,
  // required
  required: PropTypes.bool,
  // color
  color: PropTypes.string,
  // size
  size: PropTypes.number,
  // font style bold
  bold: PropTypes.any,
  // font style italic
  italic: PropTypes.bool,
  // primary
  primary: PropTypes.bool,
  // secondary
  secondary: PropTypes.bool,
  // gray
  gray: PropTypes.bool,
  // black
  black: PropTypes.bool,
  // white
  white: PropTypes.bool,
  // text align
  center: PropTypes.bool,
  // text align
  justify: PropTypes.bool,
  // text align
  left: PropTypes.bool,
  // text align
  right: PropTypes.bool,
  // background
  bg: PropTypes.string,
  // padding
  padding: PropTypes.string,
  // padding top
  paddingTop: PropTypes.string,
  // padding bottom
  paddingBottom: PropTypes.string,
  // padding left
  paddingLeft: PropTypes.string,
  // padding right
  paddingRight: PropTypes.string,
  // padding horizontal
  paddingHorizontal: PropTypes.string,
  // padding vertical
  paddingVertical: PropTypes.string,
  // margin
  margin: PropTypes.string,
  // margin top
  marginTop: PropTypes.string,
  // margin left
  marginLeft: PropTypes.string,
  // margin left
  marginRight: PropTypes.string,
  // margin bottom
  marginBottom: PropTypes.string,
  // margin horizontal
  marginHorizontal: PropTypes.string,
  // margin vertical
  marginVertical: PropTypes.string,
  // vertical center
  verticalCenter: PropTypes.bool,
  // vertical start
  verticalStart: PropTypes.bool,
  // vertical end
  verticalEnd: PropTypes.bool,
  // horizontal center
  horizontalCenter: PropTypes.bool,
  // horizontal start
  horizontalStart: PropTypes.bool,
  // horizontal end
  horizontalEnd: PropTypes.bool,
  // text center
  textCenter: PropTypes.bool,
  // custom align text
  alignText: PropTypes.string,
  // self center
  selfCenter: PropTypes.bool,
  // self start
  selfStart: PropTypes.bool,
  // self end
  selfEnd: PropTypes.bool,
};

export default Label;
