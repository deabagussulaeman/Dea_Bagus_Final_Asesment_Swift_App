import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {Portal, Modal} from 'react-native-paper';
import {rxUserTheme} from '@app/services/cache';
import {useReactiveVar} from '@apollo/client';
import {Colors} from '@app/styles';
import {DARK} from '@app/helpers/Constants';
import Section from '@app/components/Section';
import Forms from '@app/components/_Forms/index';
import Label from '@app/components/Label';
import styles from '@app/_modules/main_home/atoms/ModalSubscription/views/mobile/styles';
import i18next from 'i18next';

const AtomSubscriptionView = ({
  t,
  modalVisibility,
  onCloseModal,
  fields,
  onSubmitSubscription,
  delay,
}) => {
  const [isDelayed, setIsDelayed] = useState(true);
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const backgroundColor = getRxUserTheme === DARK ? Colors.DARK : Colors.WHITE;
  const iconColor = getRxUserTheme === DARK ? Colors.WHITE : Colors.PRIMARY;

  useEffect(() => {
    const modalTimer = setTimeout(() => {
      setIsDelayed(false);
    }, delay);
    return () => {
      clearTimeout(modalTimer);
    };
  }, []);

  if (isDelayed) {
    return null;
  }

  return (
    <Portal>
      <Modal
        visible={modalVisibility}
        dismissable={false}
        contentContainerStyle={[styles.modalContainer, {backgroundColor}]}>
        <Icon
          name={'x'}
          size={30}
          onPress={onCloseModal}
          color={iconColor}
          style={styles.close}
        />
        <Section horizontalCenter verticalCenter>
          <Label style={styles.title} size={16}>
            {i18next.t('main_home.view.title')}
          </Label>
          <Section marginTop={10}>
            <Label center size={12}>
              {i18next.t('main_home.view.caption')}
            </Label>
          </Section>
        </Section>
        <Forms
          fields={fields}
          buttonTitle={i18next.t('main_home.label.subscribe')}
          isLast={true}
          onSubmit={onSubmitSubscription}
          onCloseModal={onCloseModal}
        />
      </Modal>
    </Portal>
  );
};

export default AtomSubscriptionView;
