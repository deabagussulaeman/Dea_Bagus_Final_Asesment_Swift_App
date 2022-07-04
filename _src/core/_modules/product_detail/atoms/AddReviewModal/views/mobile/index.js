import React, {useState} from 'react';
import {Modal, ScrollView} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {ADD_PRODUCT_REVIEW} from '@app/_modules/product_detail/services/schema';
import useCustomMutation from '@app/hooks/useCustomMutation';
import {Colors} from '@app/styles';
import {useReactiveVar} from '@apollo/client';
import {rxAppSnackbar, rxUserTheme} from '@app/services/cache';
import PropTypes from 'prop-types';
import Button from '@app/components/Button';
import Input from '@app/components/Input';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import SnackBar from '@app/components/SnackBar';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TYPE_NAVBAR_CUSTOM, TYPE_INPUT_CUSTOM} from '@app/helpers/Constants';

const AddReviewModal = ({
  showAddReviewModal,
  setShowAddReviewModal,
  product,
  refetchProductReviews,
}) => {
  const ratingDummyCounter = [0, 1, 2, 3, 4];
  const getRxUserTheme = useReactiveVar(rxUserTheme);
  const backgroundColor =
    getRxUserTheme === 'dark' ? Colors.DARK : Colors.WHITE;

  const [rating, setRating] = useState(0);
  const [nickname, setNickname] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDetail, setReviewDetail] = useState('');
  const {t} = useTranslation();

  const {onRefetchData: addProductReviewHook} = useCustomMutation({
    schema: ADD_PRODUCT_REVIEW,
  });
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (
      rating !== 0 &&
      nickname !== '' &&
      reviewTitle !== '' &&
      reviewDetail !== ''
    ) {
      try {
        setLoading(true);
        await addProductReviewHook({
          params: {
            input: {
              entity_pk_value: product.id,
              nickname: nickname,
              title: reviewTitle,
              detail: reviewDetail,
              ratings: [
                {
                  rating_name: t('product_detail.label.rating'),
                  value: rating,
                },
              ],
            },
          },
          paramsOpt: {isReturn: true},
        });
        await refetchProductReviews();
        setLoading(false);
        setShowAddReviewModal(false);
      } catch (error) {
        setLoading(false);
        setShowAddReviewModal(false);
      }
    } else {
      rxAppSnackbar({
        message: t('product_detail.fieldNotEmpty'),
      });
    }
  };

  return (
    <Modal
      visible={showAddReviewModal}
      onRequestClose={() => setShowAddReviewModal(false)}>
      <ScrollView backgroundColor={backgroundColor} style={{flex: 1}}>
        <NavBar
          type={TYPE_NAVBAR_CUSTOM}
          title={t('product_detail.writeAReview')}
          useBack
          useBackPress={() => setShowAddReviewModal(false)}
        />
        <Section horizontalStart padding={20}>
          <Section horizontalStart spaceBetween>
            <Label small>{t('product_detail.reviewing')}</Label>
            <Label bold large>
              {product.name}
            </Label>
          </Section>

          {/* rating stars block  */}
          <Section horizontalStart marginVertical={15}>
            <Label>{t('product_detail.label.rating')}</Label>
            <Section row>
              {ratingDummyCounter.map((dummyRating, index) => {
                if (rating >= index + 1) {
                  return (
                    <Section
                      key={`rating-${dummyRating}-${index}`}
                      keyIndex={`rating-${dummyRating}-${index}`}
                      onPress={() => setRating(index + 1)}
                      style={{marginHorizontal: 5}}>
                      <Icon
                        name="star"
                        size={25}
                        color={
                          getRxUserTheme === 'dark'
                            ? Colors.WHITE
                            : Colors.PRIMARY
                        }
                      />
                    </Section>
                  );
                } else {
                  return (
                    <Section
                      key={`rating-${dummyRating}-${index}`}
                      keyIndex={`rating-${dummyRating}-${index}`}
                      onPress={() => setRating(index + 1)}
                      style={{marginHorizontal: 5}}>
                      <Icon
                        name="star-o"
                        size={25}
                        color={
                          getRxUserTheme === 'dark'
                            ? Colors.WHITE
                            : Colors.PRIMARY
                        }
                      />
                    </Section>
                  );
                }
              })}
            </Section>
          </Section>

          {/* input block */}
          <Input
            type={TYPE_INPUT_CUSTOM}
            label={t('product_detail.label.nickname')}
            placeholder={t('product_detail.placeholder.nickname')}
            value={nickname}
            onChangeText={setNickname}
            styleProp={{width: '100%'}}
            editable={!loading}
          />
          <Input
            type={TYPE_INPUT_CUSTOM}
            label={t('product_detail.label.summary')}
            placeholder={t('product_detail.placeholder.summary')}
            value={reviewTitle}
            onChangeText={setReviewTitle}
            styleProp={{width: '100%'}}
            editable={!loading}
          />
          <Input
            type={TYPE_INPUT_CUSTOM}
            label={t('product_detail.label.review')}
            placeholder={t('product_detail.placeholder.review')}
            multiline={true}
            numberOfLines={10}
            value={reviewDetail}
            onChangeText={setReviewDetail}
            styleProp={{width: '100%'}}
            editable={!loading}
          />
          <Show when={!loading}>
            <Button
              label={t('product_detail.label.submitReview')}
              styleProp={{
                backgroundColor:
                  getRxUserTheme === 'dark' ? Colors.WHITE : Colors.PRIMARY,
                borderColor: Colors.WHITE,
                borderWidth: 0.15,
                width: '100%',
                marginVertical: 20,
              }}
              onPress={submitReview}
              textStyleProp={{
                color: getRxUserTheme === 'dark' ? Colors.BLACK : Colors.WHITE,
                fontWeight: 'bold',
              }}
              disabled={loading}
            />
          </Show>
          <Show when={loading}>
            <ActivityIndicator />
          </Show>
        </Section>
      </ScrollView>
      <SnackBar />
    </Modal>
  );
};

AddReviewModal.propTypes = {
  // bool for show modal
  showAddReviewModal: PropTypes.bool,
  // func to set bool for show modal
  setShowAddReviewModal: PropTypes.any,
  // data
  product: PropTypes.object,
  // function to refetch product review
  refetchProductReviews: PropTypes.func,
};

export default AddReviewModal;
