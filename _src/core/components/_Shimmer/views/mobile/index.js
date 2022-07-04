import React, {PureComponent} from 'react';
import {Animated, Dimensions, View, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const GREY = 'rgb(234, 234, 234)';
const GREY_ANIMATION = '#EDEDED';
const shimmeringAnimatedValue = new Animated.Value(0);
const ShimmringAnimation = Animated.loop(
  Animated.timing(shimmeringAnimatedValue, {
    useNativeDriver: false,
    delay: 2000,
    duration: 2000,
    toValue: 1,
  }),
);

export default class Shimmer extends PureComponent {
  animation;
  gradientColors = [GREY, GREY_ANIMATION, GREY];

  constructor(props) {
    super(props);

    this.state = {
      viewWidth: -1,
    };

    this.animation = ShimmringAnimation;
  }

  startAnimation() {
    this.animation.start();
  }

  render() {
    const {colors, gradientStyle, wrapperStyle} = this.props;
    const width = Dimensions.get('screen').width;
    const loadingStyle = {backgroundColor: GREY};
    const left = this._getLeftValue();
    return (
      <View
        style={{
          width: wrapperStyle?.width ?? width * 0.9,
          height: wrapperStyle?.height ?? 80,
        }}>
        <View
          style={[styles.container, loadingStyle, wrapperStyle]}
          onLayout={event => this._onLayoutChange(event)}>
          <Animated.View style={[{flex: 1, left}, gradientStyle]}>
            <LinearGradient
              colors={colors || this.gradientColors}
              start={{x: 0.3, y: 0.2}}
              end={{x: 0.8, y: 0.5}}
              style={{flex: 1}}
            />
          </Animated.View>
        </View>
      </View>
    );
  }

  _onLayoutChange(event) {
    this.setState({
      viewWidth: event.nativeEvent.layout.width,
    });

    this.startAnimation();
  }

  _getLeftValue() {
    const {viewWidth} = this.state;
    return shimmeringAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-viewWidth, viewWidth],
    });
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
