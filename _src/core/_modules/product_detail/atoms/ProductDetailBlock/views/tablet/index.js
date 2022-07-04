import React, {useState} from 'react';
import {formatDateOrder} from '@app/helpers/General';
import {Colors, Mixins} from '@app/styles';
import {Button, Colors as ColorsPaper} from 'react-native-paper';
import {MixinsNew} from '@app/styles/index';
import Show from '@app/components/Show';
import Section from '@root/_src/core/components/Section/index';
import NoData from '@app/components/NoData/index';
import WebViewContent from '@app/components/WebViewContent/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import Label from '@app/components/Label';
import AddReviewModal from '@app/_modules/product_detail/atoms/AddReviewModal';
import styles from '@app/_modules/product_detail/atoms/ProductDetailBlock/views/tablet/styles';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * ---------------------------------------------------- *
 * @summary product description component
 * ---------------------------------------------------- *
 */
const ProductDescription = ({product}) => {
  const getDescription = product?.description?.html;
  if (getDescription === '') {
    return <NoData />;
  }
  return (
    <WebViewContent
      htmlBlock={product.description?.html}
      contentFontSize={40}
      contentBackgroundColor={Colors.PRIMARY}
      contentTextColor={Colors.WHITE}
      styleProp={{backgroundColor: Colors.SECONDARY}}
    />
  );
};

/**
 * ---------------------------------------------------- *
 * @summary product review component
 * ---------------------------------------------------- *
 */
const ProductReview = ({
  product,
  productReviews,
  totalReview,
  refetchProductReviews,
}) => {
  const ratingDummyCounter = [0, 1, 2, 3, 4];
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const {t} = useTranslation();

  const Ratings = ({ratings}) => {
    return (
      <Section row>
        {ratingDummyCounter.map((rating, index) => {
          if (ratings[0].value > rating) {
            return (
              <Icon
                key={`icon-rating-${index}`}
                name="star"
                size={16}
                color={Colors.PRIMARY}
              />
            );
          } else {
            return (
              <Icon
                key={`icon-rating-${index}`}
                name="star-o"
                size={16}
                color={Colors.PRIMARY}
              />
            );
          }
        })}
      </Section>
    );
  };

  return (
    <>
      <Section
        style={{
          backgroundColor: Colors.PRIMARY,
        }}>
        <Section
          style={{
            width: '100%',
            flexDirection: 'row',
            ...MixinsNew.padding({top: 15, bottom: 15, left: 25, right: 25}),
          }}>
          <Label color={Colors.WHITE} style={{width: '50%'}}>
            {t('product_detail.customerReviews')}
          </Label>
          <Label
            color={Colors.WHITE}
            style={{
              width: '50%',
              textAlign: 'right',
            }}>
            {totalReview} {t('product_detail.reviews')}
          </Label>
        </Section>

        {productReviews.map(review => {
          return (
            <Section
              key={review.id}
              keyIndex={review.id}
              padding={15}
              borderRadius={15}
              marginVertical={10}
              border={Colors.PRIMARY}>
              <Section
                row
                spaceBetween
                horizontalCenter
                width={Mixins.MAX_WIDTH * 0.75}
                marginVertical={5}>
                <Section horizontalStart>
                  <Label bold>{review.nickname}</Label>
                  <Label small>{formatDateOrder(review.created_at)}</Label>
                </Section>
                <Ratings ratings={review.ratings} />
              </Section>
              <Label>{review.detail}</Label>
            </Section>
          );
        })}

        <Show when={productReviews.length < totalReview}>
          <Button
            label={t('product_detail.readMoreReviews')}
            styleProp={{borderWidth: 0}}
          />
        </Show>

        <Section backgroundColor={'transparent'}>
          <Button
            key={'pdp-detail'}
            mode="contained"
            onPress={() => setShowAddReviewModal(true)}
            style={{
              backgroundColor: ColorsPaper.grey100,
              ...MixinsNew.margin({left: 25, right: 25, bottom: 20}),
            }}>
            <Label color={Colors.PRIMARY}>
              {t('product_detail.writeAReview')}
            </Label>
          </Button>
        </Section>
      </Section>
      <AddReviewModal
        showAddReviewModal={showAddReviewModal}
        setShowAddReviewModal={setShowAddReviewModal}
        product={product}
        refetchProductReviews={refetchProductReviews}
      />
    </>
  );
};

const ProductDetailBlock = ({
  product,
  productReviews,
  totalReview,
  refetchProductReviews,
}) => {
  return (
    <Section width="100%">
      <ProductDescription product={product} style={{flex: 0.5}} />
      <Section flex style={styles.headerContainer}>
        <ProductReview
          product={product}
          productReviews={productReviews}
          totalReview={totalReview}
          refetchProductReviews={refetchProductReviews}
        />
      </Section>
    </Section>
  );
};

ProductDetailBlock.propTypes = {
  // product
  product: PropTypes.any,
  // product review
  productReviews: PropTypes.any,
  // count of reviews
  totalReview: PropTypes.number,
  // refetch product review
  refetchProductReviews: PropTypes.func,
};

export default ProductDetailBlock;
