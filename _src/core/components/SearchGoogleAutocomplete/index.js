import React from 'react';
import MobileView from '@app/components/SearchGoogleAutocomplete/views/mobile';
import TabletView from '@app/components/SearchGoogleAutocomplete/views/tablet';
import {isBigDevice} from '@app/styles/mixins';
import ErrorBoundaryWrapper from '@app/components/ErrorBoundaryWrapper';

const SearchGoogleAutocomplete = props => {
  const View = isBigDevice ? TabletView : MobileView;
  return (
    <ErrorBoundaryWrapper>
      <View {...props} />
    </ErrorBoundaryWrapper>
  );
};

export default SearchGoogleAutocomplete;
