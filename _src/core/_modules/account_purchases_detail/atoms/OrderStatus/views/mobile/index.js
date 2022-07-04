import React from 'react';
import PropTypes from 'prop-types';
import {Colors} from '@app/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Section from '@app/components/Section';
import Label from '@app/components/Label';

const OrderStatus = ({label, status, index}) => {
  let colors = {};
  if (index < status || (index === 0 && status === -2)) {
    colors = {
      icon: Colors.WHITE,
      background: Colors.BLACK,
      border: Colors.BLACK,
    };
  } else if (status === index) {
    colors = {
      icon: Colors.BLACK,
      background: Colors.WHITE,
      border: Colors.BLACK,
    };
  } else {
    colors = {
      icon: Colors.GRAY_MEDIUM,
      background: Colors.GRAY_SMOOTH2,
      border: Colors.GRAY_SMOOTH2,
    };
  }

  let iconName = 'timer-sand';
  switch (index) {
    // pending payment
    case -1:
      iconName = 'timer-sand';
      break;
    // canceled
    case -2:
      iconName = 'check-circle-outline';
      break;
    // new
    case 0:
      iconName = 'timer-sand';
      break;
    // processing
    case 1:
      iconName = 'sync';
      break;
    // ready to ship
    case 2:
      iconName = 'truck-delivery-outline';
      break;
    // complete
    case 3:
      iconName = 'check-circle-outline';
      break;
    default:
      iconName = 'timer-sand';
      break;
  }

  return (
    <Section>
      <Section
        horizontalCenter
        verticalCenter
        height={50}
        heightScaling={false}
        width={50}
        borderRadius={25}
        border={2}
        backgroundColor={colors.background}
        borderColor={colors.border}>
        <Icon color={colors.icon} name={iconName} size={20} />
      </Section>
      <Section row flex>
        <Label
          xsmall
          center
          alignStart
          bold={status === index}
          style={{flex: 1}}>
          {label}
        </Label>
      </Section>
    </Section>
  );
};

OrderStatus.propTypes = {
  // order status label
  label: PropTypes.string,
  // compared with index to deciding icon color
  status: PropTypes.number,
  // compared with status to deciding icon color
  index: PropTypes.number,
};

export default OrderStatus;
