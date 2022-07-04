import React from 'react';
import {
  TYPE_SHIMMER_CART_ITEMS,
  TYPE_SHIMMER_ACCOUNT_NAME,
  TYPE_SHIMMER_ACCOUNT_MYPOINT,
} from '@app/helpers/Constants';
import AtomShimmerCartItem from '@app/components/_ShimmerSkeleton/atoms/ShimmerCartItem/index';
import AtomShimmerAccountName from '@app/components/_ShimmerSkeleton/atoms/ShimmerAccountName/index';
import AtomShimmerAccountMyPoint from '@app/components/_ShimmerSkeleton/atoms/ShimmerAccountMyPoint/index';

const ShimmerSkeleton = ({type}) => {
  if (type === TYPE_SHIMMER_CART_ITEMS) {
    return <AtomShimmerCartItem />;
  }
  if (type === TYPE_SHIMMER_ACCOUNT_NAME) {
    return <AtomShimmerAccountName />;
  }
  if (type === TYPE_SHIMMER_ACCOUNT_MYPOINT) {
    return <AtomShimmerAccountMyPoint />;
  }
  return null;
};

export default ShimmerSkeleton;
