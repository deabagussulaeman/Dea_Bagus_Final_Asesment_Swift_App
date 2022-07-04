import PropTypes from 'prop-types';

const Show = ({when, children}) => {
  if (when) {
    return children;
  }
  return null;
};

Show.propTypes = {
  // when
  when: PropTypes.any,
  // return children if condition fulfilled
  children: PropTypes.any,
};

export default Show;
