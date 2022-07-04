import React from 'react';
import {navigateTo} from '@app/helpers/Navigation';
import {Colors} from '@app/styles';
import {modules} from '@root/swift.config';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import Circle from '@app/components/Circle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NavBarRightView = ({cartCount}) => {
  /**
   * ---------------------------------------------------- *
   * @function {onNavigateToCart}
   * @summary for navigate to cart page
   * ---------------------------------------------------- *
   */
  const onNavigateToCart = () => {
    navigateTo(modules.cart.enable, modules.cart.name, {
      useBack: true,
    });
  };

  return (
    <Section>
      <Icon
        name={'cart'}
        style={{paddingHorizontal: 25}}
        size={25}
        color={Colors.WHITE}
        onPress={() => onNavigateToCart()}
      />
      <Show when={cartCount}>
        <Circle
          color={Colors.GRAY_DARK}
          number={cartCount}
          textColor={Colors.WHITE}
          textSize={cartCount < 100 ? 10 : 7}
          size={16}
          topPosition={-5}
          rightPosition={20}
        />
      </Show>
    </Section>
  );
};

export default NavBarRightView;
