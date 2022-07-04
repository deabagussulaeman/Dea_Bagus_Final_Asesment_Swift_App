import React from 'react';
import {Text, View} from 'react-native';
import {Colors} from '@app/styles';
import styles from '@app/components/Circle/views/mobile/styles';
import Show from '@app/components/Show';
import {ActivityIndicator} from 'react-native-paper';

const Circle = ({
  color = Colors.PRIMARY,
  textColor = Colors.PRIMARY,
  textSize = 8,
  size = 4,
  bottomPosition,
  topPosition,
  rightPosition,
  leftPosition,
  number,
  loading = false,
}) => {
  const circleGeneralStyle = {
    backgroundColor: color,
    borderRadius: size * 2,
    width: size,
    height: size,
  };

  const bottomPositionStyle = {
    bottom: bottomPosition,
  };

  const topPositionStyle = {
    top: topPosition,
    right: rightPosition,
  };

  const circleTextStyle = {
    color: textColor,
    fontSize: textSize,
    fontWeight: 'bold',
  };

  const renderCircle = () => {
    if (bottomPosition) {
      return (
        <View
          style={[
            styles.circlePosition,
            circleGeneralStyle,
            bottomPositionStyle,
          ]}>
          <Show when={loading}>
            <ActivityIndicator color={Colors.WHITE} size={10} />
          </Show>
          <Show when={!loading && number > -1}>
            <Text style={[styles.circleText, circleTextStyle]}>
              {number < 100 ? number : '99+'}
            </Text>
          </Show>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.circlePosition,
            circleGeneralStyle,
            topPositionStyle,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Show when={loading}>
            <ActivityIndicator color={Colors.WHITE} size={10} />
          </Show>
          <Show when={!loading && number > -1}>
            <Text style={[styles.circleText, circleTextStyle]}>
              {number < 100 ? number : '99+'}
            </Text>
          </Show>
        </View>
      );
    }
  };

  return <>{renderCircle()}</>;
};

export default Circle;
