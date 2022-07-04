import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '@app/components/Input/atoms/InputCustom';
import InputField from '@app/components/Input/atoms/InputField';
import {TYPE_INPUT_CUSTOM, TYPE_INPUT_FIELD} from '@app/helpers/Constants';

const Input = props => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const {type} = props;

  if (type === TYPE_INPUT_CUSTOM) {
    return <InputCustom {...props} />;
  }
  if (type === TYPE_INPUT_FIELD) {
    return <InputField {...props} />;
  }
};

Input.propTypes = {
  // use to determined whether to show affix component or not
  affixLabel: PropTypes.string,
  //use as capitalized format for the input
  autoCapitalized: PropTypes.string,
  // auto focus
  autoFocus: PropTypes.bool,
  // caret hidden
  caretHidden: PropTypes.bool,
  // data list for dropdown input
  data: PropTypes.array,
  // use as defaultValue
  defaultValue: PropTypes.string,
  // editable
  editable: PropTypes.bool,
  //use to show error message
  error: PropTypes.object,
  // use to determined marginBottom
  isLast: PropTypes.bool,
  // use to determined whether to enable secureTextEntry and Visibility Password Component
  isPassword: PropTypes.bool,
  //use for disabling input on submit
  isSubmitting: PropTypes.bool,
  // keyboard type
  keyboardType: PropTypes.string,
  // label
  label: PropTypes.string,
  // loading state to use in submit
  loading: PropTypes.bool,
  // use whether multiline enable or not
  multiline: PropTypes.bool,
  //name from the controller
  name: PropTypes.string,
  // number of line
  numberOfLines: PropTypes.number,
  // use as callback function fot onBlur event
  onBlur: PropTypes.func.isRequired,
  // use as callback function for onChange event
  onChange: PropTypes.func.isRequired,
  // func change text
  onChangeText: PropTypes.func,
  // funct focus
  onFocus: PropTypes.func,
  //onPress callback on selected item for dropdown input
  onPress: PropTypes.func,
  // placeholder
  placeholder: PropTypes.string,
  // placeholder text color
  placeholderTextColor: PropTypes.string,
  // style props
  styleProp: PropTypes.object,
  // secure text
  secureTextEntry: PropTypes.bool,
  // use tas text content type of the Input
  textContentType: PropTypes.any,
  // style text
  textStyleProp: PropTypes.object,
  // value
  value: PropTypes.string,
};

export default Input;
