import React, {memo} from 'react';
import Section from '@app/components/Section';
import PropTypes from 'prop-types';

/**
 * [CONDITION] render if data was changed
 * @param {*} prevProps
 * @param {*} nextProps
 * @returns renderable
 */
const areEqualItem = (prevProps, nextProps) => {
  if (typeof prevProps.key === 'object') {
    if (
      JSON.stringify(prevProps.itemKey) !== JSON.stringify(nextProps.itemKey)
    ) {
      return false;
    }
    return true;
  }
  if (prevProps.itemKey !== nextProps.itemKey) {
    return false;
  }
  return true;
};

/**
 * [COMPONENT] encapsulate render item
 */
const RenderItem = memo(({children}) => {
  return <Section>{children}</Section>;
}, areEqualItem);

RenderItem.propTypes = {
  // children
  children: PropTypes.any,
};

export default RenderItem;
