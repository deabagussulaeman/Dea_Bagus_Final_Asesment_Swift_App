import React from 'react';
import MobileView from '@app/_modules/blog_detail/views/mobile';
import TabletView from '@app/_modules/blog_detail/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const BlogDetailViews = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default BlogDetailViews;
