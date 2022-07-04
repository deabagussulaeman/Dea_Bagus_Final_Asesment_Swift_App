import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import PropTypes from 'prop-types';
import {errorHandler} from '@app/helpers/ErrorBoundary';
import ErrorBoundaryView from '@app/components/ErrorBoundaryView';

const ErrorBoundaryWrapper = ({children}) => {
  return (
    <ErrorBoundary
      onError={errorHandler}
      FallbackComponent={({error}) => <ErrorBoundaryView error={error} />}>
      {children}
    </ErrorBoundary>
  );
};

ErrorBoundaryWrapper.propTypes = {
  // children
  children: PropTypes.any,
};

export default ErrorBoundaryWrapper;
