import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableRipple} from 'react-native-paper';
import {Colors, Spacing} from '@app/styles';
import PropTypes from 'prop-types';

/**
 * ---------------------------------------------------- *
 * @styles {Section}
 * @summary return styles Section
 * ---------------------------------------------------- *
 */
const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.BASE_MARGIN,
    backgroundColor: 'transparent',
  },
  containerHeader: {
    paddingVertical: Spacing.DOUBLE_BASE_MARGIN,
    backgroundColor: Colors.WHITE,
  },
});

/**
 * ---------------------------------------------------- *
 * @component {Section}
 * @summary return component Section
 * ---------------------------------------------------- *
 */
const Section = ({
  bg,
  children,
  style,
  header,
  flex,
  flexNumber,
  small,
  horizontalStart,
  horizontalCenter,
  horizontalEnd,
  width,
  height,
  plain,
  spaceBetween,
  spaceAround,
  spaceEvenly,
  verticalCenter,
  row,
  column,
  border,
  borderColor,
  backgroundColor,
  borderRadius,
  horizontal,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  marginVertical,
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingHorizontal,
  paddingVertical,
  doubleHorizontal,
  doubleVertical,
  underline,
  safe = false,
  onPress = null,
}) => {
  let styleObject = {
    ...(row ? {flexDirection: 'row'} : null),
    ...(flex ? {flex: 1} : null),
    ...(flexNumber ? {flex: flexNumber} : null),
    ...(bg ? {backgroundColor: bg} : null),
    ...(small ? {paddingVertical: Spacing.SMALL_MARGIN} : null),
    ...(horizontal ? {paddingHorizontal: Spacing.BASE_MARGIN} : null),
    ...(width ? {width} : null),
    ...(height ? {height} : null),
    ...(horizontalStart ? {alignItems: 'flex-start'} : null),
    ...(horizontalEnd ? {alignItems: 'flex-end'} : null),
    ...(horizontalCenter ? {alignItems: 'center'} : null),
    ...(verticalCenter ? {justifyContent: 'center'} : null),
    ...(plain ? {paddingVertical: 0, paddingHorizontal: 0} : null),
    ...(spaceBetween ? {justifyContent: 'space-between'} : null),
    ...(spaceAround ? {justifyContent: 'space-around'} : null),
    ...(spaceEvenly ? {justifyContent: 'space-evenly'} : null),
    ...(column ? {flexDirection: 'column'} : null),
    ...(backgroundColor ? {backgroundColor} : null),
    ...(border ? {borderWidth: border} : null),
    ...(borderColor ? {borderColor} : null),
    ...(borderRadius ? {borderRadius} : null),
    ...(margin ? {margin} : null),
    ...(marginTop ? {marginTop} : null),
    ...(marginBottom ? {marginBottom} : null),
    ...(marginLeft ? {marginLeft} : null),
    ...(marginRight ? {marginRight} : null),
    ...(marginHorizontal ? {marginHorizontal} : null),
    ...(marginVertical ? {marginVertical} : null),
    ...(padding ? {padding} : null),
    ...(paddingTop ? {paddingTop} : null),
    ...(paddingBottom ? {paddingBottom} : null),
    ...(paddingLeft ? {paddingLeft} : null),
    ...(paddingRight ? {paddingRight} : null),
    ...(paddingHorizontal ? {paddingHorizontal} : null),
    ...(paddingVertical ? {paddingVertical} : null),
    ...(doubleHorizontal
      ? {paddingHorizontal: Spacing.DOUBLE_BASE_MARGIN}
      : null),
    ...(doubleVertical ? {paddingVertical: Spacing.DOUBLE_BASE_MARGIN} : null),
    ...(underline
      ? {borderBottomWidth: 0.2, borderBottomColor: Colors.GRAY_SMOOTH5}
      : null),
  };
  if (safe) {
    return (
      <SafeAreaView
        style={[header ? styles.containerHeader : null, style, styleObject]}>
        {children}
      </SafeAreaView>
    );
  } else if (onPress) {
    return (
      <TouchableRipple
        onPress={onPress}
        style={[header ? styles.containerHeader : null, style, styleObject]}>
        <View>{children}</View>
      </TouchableRipple>
    );
  } else {
    return (
      <View
        style={[header ? styles.containerHeader : null, style, styleObject]}>
        {children}
      </View>
    );
  }
};

Section.propTypes = {
  // background
  bg: PropTypes.any,
  // children
  children: PropTypes.any,
  // style
  style: PropTypes.any,
  // header
  header: PropTypes.any,
  // flex
  flex: PropTypes.bool,
  // flex number
  flexNumber: PropTypes.number,
  // padd verti
  small: PropTypes.bool,
  // align item
  horizontalStart: PropTypes.bool,
  // align item
  horizontalCenter: PropTypes.bool,
  // align item
  horizontalEnd: PropTypes.bool,
  // width
  width: PropTypes.any,
  // height
  height: PropTypes.any,
  // padding ver, hor
  plain: PropTypes.bool,
  // justify content
  spaceBetween: PropTypes.bool,
  // justify content
  spaceAround: PropTypes.bool,
  // justify content
  spaceEvenly: PropTypes.bool,
  // verticalCenter
  verticalCenter: PropTypes.bool,
  // flex direction
  row: PropTypes.bool,
  // flex direction
  column: PropTypes.bool,
  // border width
  border: PropTypes.any,
  // border color
  borderColor: PropTypes.any,
  // background color
  backgroundColor: PropTypes.any,
  // border radius
  borderRadius: PropTypes.number,
  // horizontal
  horizontal: PropTypes.bool,
  // margin
  margin: PropTypes.number,
  // margin top
  marginTop: PropTypes.number,
  // margin bottom
  marginBottom: PropTypes.number,
  // margin left
  marginLeft: PropTypes.number,
  // margin right
  marginRight: PropTypes.number,
  // margin horizontal
  marginHorizontal: PropTypes.number,
  // margin vertical
  marginVertical: PropTypes.number,
  // padding
  padding: PropTypes.number,
  // padding top
  paddingTop: PropTypes.number,
  // padding bottom
  paddingBottom: PropTypes.number,
  // padding left
  paddingLeft: PropTypes.number,
  // padding right
  paddingRight: PropTypes.number,
  // padding horizontal
  paddingHorizontal: PropTypes.number,
  // padding vertical
  paddingVertical: PropTypes.number,
  // padding horizontal
  doubleHorizontal: PropTypes.bool,
  // padding vertical
  doubleVertical: PropTypes.bool,
  // underline styling
  underline: PropTypes.bool,
  // safe
  safe: PropTypes.bool,
  // func
  onPress: PropTypes.func,
};

export default Section;
