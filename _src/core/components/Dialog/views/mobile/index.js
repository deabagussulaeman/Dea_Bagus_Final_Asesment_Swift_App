import Section from '@app/components/Section';
import Label from '@app/components/Label';
import React from 'react';
import {Modal} from 'react-native';
import Button from '@app/components/Button';
import styles from '@app/components/Dialog/views/mobile/styles';
import PropTypes from 'prop-types';

const Dialog = ({
  visible,
  secondButtonLabel,
  onPressSecondButton,
  buttonLabel,
  onPressButton,
  message = '',
}) => {
  return (
    <Modal visible={visible} transparent>
      <Section
        flex
        horizontalCenter
        verticalCenter
        backgroundColor={'rgba(0,0,0, .8)'}>
        <Section
          width={'90%'}
          padding={20}
          borderRadius={15}
          horizontalCenter
          verticalCenter>
          <Label center large style={[styles.frameTitle]}>
            {message}
          </Label>
          <Section row>
            {onPressSecondButton && (
              <Section width={'50%'} hpadding={5}>
                <Button
                  label={secondButtonLabel.toUpperCase()}
                  onPress={onPressSecondButton}
                  styleProp={{width: '100%'}}
                />
              </Section>
            )}
            <Section
              width={onPressSecondButton ? '50%' : '100%'}
              paddingHorizontal={5}>
              <Button
                label={buttonLabel.toUpperCase()}
                onPress={onPressButton}
                styleProp={{width: '100%'}}
              />
            </Section>
          </Section>
        </Section>
      </Section>
    </Modal>
  );
};

Dialog.propTypes = {
  // show modal
  visible: PropTypes.bool,
  // label name
  secondButtonLabel: PropTypes.string,
  // func button nd
  onPressSecondButton: PropTypes.func,
  // label button
  buttonLabel: PropTypes.string,
  // function button
  onPressButton: PropTypes.func,
  // message
  message: PropTypes.string,
};

export default Dialog;
