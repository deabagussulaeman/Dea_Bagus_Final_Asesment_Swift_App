import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Modal} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import {Colors, Mixins} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import Button from '@app/components/Button';
import {rxUserTheme} from '@app/services/cache';

import ImagePicker from '@app/components/ImagePicker';
import Input from '@app/components/Input';
import NavBar from '@app/components/NavBar';
import Picker from '@app/components/Picker';
import RadioButton from '@app/components/RadioButton';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Divider from '@app/components/Divider';
import Label from '@app/components/Label';

import PropTypes from 'prop-types';

import FastImage from 'react-native-fast-image';
import styles from '@app/_modules/account/atoms/RMAFormModal/views/tablet/styles';
import {TYPE_INPUT_CUSTOM, TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

const RMAFormModalViews = ({
  type,
  visible,
  rmaFormData,
  orderNumber,
  productsToReturn,
  setProductsToReturn,
  customFieldsRequestData,
  customFieldsItemData,
  postedThreadMessages,
  customFieldsRequestSelected,
  setCustomFieldsRequestSelected,
  threadMessage,
  setThreadMessage,
  packageSentStatus,
  setPackageSentStatus,
  onSubmitRequest,
  onCancelRequest,
  onBack,
  loading,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const {t} = useTranslation();

  const Items = ({item}) => {
    const selected = !!productsToReturn[item.item_id];
    const qtyReturnable = item.qty_returnable;

    return (
      <Section
        // width={Mixins.MAX_WIDTH * 0.75}
        row
        horizontalCenter
        verticalCenter
        radius
        paddingVertical={10}
        paddingHorizontal={10}
        marginVertical={5}
        borderColor={Colors.GRAY_LIGHT}>
        <Show when={item.is_returnable}>
          <RadioButton
            style={{marginRight: normalize(10)}}
            selected={selected}
            onPress={() => {
              if (selected) {
                const productsToReturnTmp = {...productsToReturn};
                delete productsToReturnTmp[item.item_id];
                setProductsToReturn(productsToReturnTmp);
              } else {
                setProductsToReturn({
                  ...productsToReturn,
                  [item.item_id]: {
                    qty: 1,
                    custom_fields: {
                      field_id: 3,
                      value: 1,
                    },
                  },
                });
              }
            }}
          />
        </Show>
        <FastImage
          key={item.item_id}
          style={styles.productImage}
          source={{
            uri: item.image_url,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Section flex horizontalStart>
          <Label>{item.name}</Label>
          <Show
            when={
              (item.is_returnable && selected) || type === 'update-request'
            }>
            <Section row horizontalCenter verticalCenter>
              <Label scaling={false}>{t('account.view.qtyReturn')}</Label>
              <Show when={type !== 'update-request'}>
                <Input
                  type={TYPE_INPUT_CUSTOM}
                  styleProp={{
                    width: normalize(30),
                  }}
                  textStyleProp={{textAlign: 'center'}}
                  keyboardType="number-pad"
                  value={
                    selected ? productsToReturn[item.item_id].qty.toString() : 0
                  }
                  onChangeText={text => {
                    let qty = '0';
                    if (text !== '') {
                      qty = text;
                    }
                    if (parseInt(text) > qtyReturnable) {
                      qty = qtyReturnable;
                    }
                    setProductsToReturn({
                      ...productsToReturn,
                      [item.item_id]: {
                        ...productsToReturn[item.item_id],
                        qty: parseInt(qty),
                      },
                    });
                  }}
                />
                <Label xsmall>
                  {t('account.view.of')} {qtyReturnable}{' '}
                  {t('account.view.returnable')}
                </Label>
              </Show>
              <Show when={type === 'update-request'}>
                <Label>{item.qty_rma}</Label>
              </Show>
            </Section>
            {customFieldsItemData.map(customField => (
              <Picker
                enabled={
                  !rmaFormData.status || rmaFormData.status?.name !== 'Canceled'
                }
                key={customField.name + '' + item.item_id}
                pickerData={customField}
                selectedValue={
                  productsToReturn[item.item_id]?.custom_fields?.value
                }
                setSelectedValue={value => {
                  setProductsToReturn({
                    ...productsToReturn,
                    [item.item_id]: {
                      ...productsToReturn[item.item_id],
                      custom_fields: {
                        field_id: customField.id,
                        value: value,
                      },
                    },
                  });
                }}
              />
            ))}
          </Show>
          <Show when={type === 'new-request'}>
            <Show when={!item.is_returnable && !item.other_rma_request}>
              <Label>{t('account.view.itemNotReturnable')}</Label>
            </Show>
            <Show when={item.other_rma_request?.length}>
              <Label>
                {t('account.view.otherReturnRequest')} {item.other_rma_request}
              </Label>
            </Show>
          </Show>
        </Section>
      </Section>
    );
  };

  const HeaderComponent = () => {
    return (
      <>
        <Section marginVertical={20}>
          {customFieldsRequestData.map(customField => (
            <Picker
              enabled={
                !(
                  customField.name === 'Package Condition' &&
                  type === 'update-request'
                ) && rmaFormData.status?.name !== 'Canceled'
              }
              key={customField.name}
              pickerData={customField}
              selectedValue={customFieldsRequestSelected[customField.id]}
              setSelectedValue={value => {
                setCustomFieldsRequestSelected({
                  ...customFieldsRequestSelected,
                  [customField.id]: value,
                });
              }}
            />
          ))}
        </Section>

        <Label alignStart bold>
          {t('account.view.productToReturn')}
        </Label>
      </>
    );
  };

  // const FooterComponent = () => {
  // Using Function Form to solve issue : auto close keyboard on typing message
  const footerComponent = () => {
    const [showMessages, setShowMessages] = useState(false);

    const handleMessageText = text => {
      setThreadMessage({...threadMessage, text});
    };

    return (
      <>
        <Section width={Mixins.MAX_WIDTH * 0.75}>
          <Show when={postedThreadMessages.length}>
            <Button
              width={normalize(120)}
              label={
                showMessages
                  ? t('account.btn.hideMessages')
                  : t('account.btn.showMessages')
              }
              styleProp={styles.hideMessasgesButton}
              textStyleProp={styles.hideMessasgesButtonText}
              onPress={() => setShowMessages(!showMessages)}
            />

            <Show when={showMessages}>
              <Section horizontalStart>
                <Label>{t('account.view.messages')}</Label>
                {postedThreadMessages.map(message => {
                  const alignStyle = {
                    alignSelf:
                      message.owner_type === 2 ? 'flex-start' : 'flex-end',
                  };

                  let customermsgBackgroundColor =
                    getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE;
                  let storemsgBackgroundColor =
                    getRxUserTheme === 'dark'
                      ? Colors.GRAY_DARK
                      : Colors.GRAY_SMOOTH;

                  const borderStyle = {
                    borderRadius: normalize(10),
                    alignSelf:
                      message.owner_type === 2 ? 'flex-start' : 'flex-end',
                    backgroundColor:
                      message.owner_type === 2
                        ? storemsgBackgroundColor
                        : customermsgBackgroundColor,
                    borderTopLeftRadius: message.owner_type === 2 ? 0 : 10,
                    borderTopRightRadius: message.owner_type === 2 ? 10 : 0,
                    borderColor:
                      getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK,
                    borderWidth: 0.5,
                    width: Mixins.MAX_WIDTH * 0.75,
                  };

                  return (
                    <Show when={message.text !== ''}>
                      <Label xxsmall style={[alignStyle]}>
                        {message.owner_type === 2
                          ? `${rmaFormData.customer_address.firstname}`
                          : t('account.view.admin')}
                      </Label>
                      <Section
                        style={[borderStyle]}
                        paddingHorizontal={10}
                        paddingVertical={2}
                        marginVertical={3}>
                        <Show when={message.attachments.length}>
                          {message.attachments.map(attachment => {
                            return (
                              <>
                                <Label xxsmall style={[alignStyle]}>
                                  {attachment.name}
                                </Label>
                                <FastImage
                                  key={attachment.name}
                                  style={styles.attachmentImage}
                                  source={{
                                    uri: attachment.image_url,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                  }}
                                  resizeMode={FastImage.resizeMode.contain}
                                />
                              </>
                            );
                          })}
                        </Show>
                        <Label style={[alignStyle]}>{message.text}</Label>
                        <Label xxsmall style={[alignStyle]}>
                          {message.created_at}
                        </Label>
                      </Section>
                    </Show>
                  );
                })}
              </Section>
            </Show>
          </Show>

          <Show when={rmaFormData.status?.name !== 'Canceled'}>
            <Input
              type={TYPE_INPUT_CUSTOM}
              label={t('account.label.sendMessage')}
              placeholder={t('account.placeholder.messageToManager')}
              multiline={true}
              numberOfLines={10}
              value={threadMessage?.text}
              onChangeText={handleMessageText}
              // onChangeText={(text) => setThreadMessage({...threadMessage, text})}
              styleProp={styles.messageInput}
              // editable={!loading}
            />

            <ImagePicker
              style={{width: '100%'}}
              label={t('account.label.uploadImage')}
              callback={imageData => {
                const imagePath = imageData.path.split('/');
                const name = imagePath[imagePath.length - 1];
                let file_name = name;
                let file_content_base64 =
                  'data:' + imageData.mime + ';base64,' + imageData.data;
                setThreadMessage({
                  ...threadMessage,
                  attachments: [
                    {
                      file_content_base64,
                      name,
                      file_name,
                    },
                  ],
                });
              }}
            />
          </Show>

          <Show
            when={
              type === 'update-request' &&
              rmaFormData.status?.name !== 'Canceled'
            }>
            <Section row horizontalCenter style={{marginBottom: 15}}>
              <RadioButton
                selected={
                  rmaFormData?.status?.name === 'Package Sent'
                    ? true
                    : packageSentStatus
                }
                onPress={() => {
                  if (rmaFormData?.status?.name !== 'Package Sent') {
                    setPackageSentStatus(!packageSentStatus);
                  }
                }}
              />
              <Label style={styles.packageSentText}>
                {t('account.view.packageSent')}
              </Label>
            </Section>
          </Show>

          <Divider />

          <Section
            row
            spaceBetween
            horizontalCenter
            verticalCenter
            marginTop={10}
            style={{marginBottom: 20}}>
            <Button
              label={
                type === 'update-request'
                  ? t('account.btn.back')
                  : t('account.btn.cancel')
              }
              onPress={() => onBack()}
            />
            <Show when={rmaFormData.status?.name !== 'Canceled'}>
              <Button
                loading={loading}
                textStyleProp={{color: Colors.WHITE}}
                styleProp={{
                  backgroundColor: Colors.PRIMARY,
                  borderColor: Colors.PRIMARY,
                }}
                label={
                  type === 'update-request'
                    ? t('account.btn.updateRequest')
                    : t('account.btn.submitRequest')
                }
                onPress={onSubmitRequest}
              />
            </Show>
          </Section>
          <Show
            when={
              type === 'update-request' &&
              !packageSentStatus &&
              rmaFormData.status?.name !== 'Canceled'
            }>
            <Button
              width={normalize(120)}
              label={t('account.btn.cancelReturn')}
              onPress={onCancelRequest}
              styleProp={styles.cancelButton}
            />
          </Show>
        </Section>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        onBack();
      }}
      style={[
        styles.mainContainer,
        {
          backgroundColor:
            getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
        },
      ]}>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={`${t('account.title.newReturnOrder')} ${orderNumber}`}
        hideBack={true}
      />
      <FlatList
        ListHeaderComponent={<HeaderComponent />}
        data={rmaFormData?.items ? rmaFormData?.items : []}
        renderItem={Items}
        style={[
          styles.listContainer,
          {
            backgroundColor:
              getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
          },
        ]}
        keyExtractor={item => item.item_id.toString()}
        ListFooterComponent={footerComponent()}
      />
    </Modal>
  );
};

RMAFormModalViews.propTypes = {
  // used for condition to show input& label
  type: PropTypes.string,
  // use to shows back visibility
  visible: PropTypes.bool,
  // data used for form
  rmaFormData: PropTypes.array,
  // shows in navbar
  orderNumber: PropTypes.string,
  // shows product
  productsToReturn: PropTypes.object,
  // set product to return
  setProductsToReturn: PropTypes.func,
  // data used for show picker in header
  customFieldsRequestData: PropTypes.any,
  // data used to show in picker item
  customFieldsItemData: PropTypes.any,
  // shows message
  postedThreadMessages: PropTypes.any,
  // used for selected value
  customFieldsRequestSelected: PropTypes.any,
  // set value for custome selected
  setCustomFieldsRequestSelected: PropTypes.func,
  // message value
  threadMessage: PropTypes.string,
  // set message value
  setThreadMessage: PropTypes.func,
  // show package sent status
  packageSentStatus: PropTypes.string,
  // set package sent status
  setPackageSentStatus: PropTypes.func,
  // function for submit request
  onSubmitRequest: PropTypes.func,
  // function for cancel request
  onCancelRequest: PropTypes.func,
  // function for back
  onBack: PropTypes.func,
  // shows loading
  loading: PropTypes.bool,
};

export default RMAFormModalViews;
