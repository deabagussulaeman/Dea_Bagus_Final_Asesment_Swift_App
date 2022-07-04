import RadioButton from '@app/components/RadioButton';
import Label from '@app/components/Label';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import {Colors, Mixins} from '@app/styles';
import React, {useEffect, useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import CheckBox from '@app/components/CheckBox';
import {
  RADIO,
  CHECKBOX,
  DROPDOWN,
  MULTIPLE_SELECT,
  TYPENAME_BUNDLE,
  TYPE_INPUT_FIELD,
} from '@app/helpers/Constants';
import styles from '@app/_modules/product_detail/views/mobile/styles';
import PropTypes from 'prop-types';
import {numberFormat} from '@app/helpers/General';
import Input from '@app/components/Input';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

const BundleProduct = ({
  t,
  product,
  selectedOptions,
  setSelectedOptions,
  setBundleItemsCount,
}) => {
  useEffect(() => {
    if (product) {
      if (product.items) {
        setBundleItemsCount(product.items.length);

        let selectedOptionsTmp = [];
        product.items.map(item => {
          let value = [];
          let quantity = 0;

          item.options.map(option => {
            if (option.is_default) {
              quantity = option.quantity;
              value = [...value, option.id];
            }
          });

          if (value.length > 0) {
            selectedOptionsTmp.push({
              id: item.option_id,
              quantity,
              value,
            });
          }
        });

        setSelectedOptions(selectedOptionsTmp);
      }
    }
  }, [product]);

  const totalBundlePrice = useMemo(() => {
    let total = 0;
    selectedOptions.map(opt => {
      let findOption = product.items.find(op => op.option_id === opt.id);
      opt.value.map(val => {
        let findValue = findOption.options.find(value => value.id === val);
        const finalPrice =
          findValue.product.price_range.maximum_price.final_price;
        total = findValue
          ? total + finalPrice.value * findValue.quantity
          : total;
      });
    });
    return total;
  }, [selectedOptions]);

  const BundleItem = ({bundleItem}) => {
    const {type} = bundleItem;

    // Start - additional code for dropdown
    let dropdownValue = '';
    let customData = [];

    let findOptionInSelected = selectedOptions.find(
      val => val.id === bundleItem.option_id,
    );

    if (findOptionInSelected) {
      let findOption = product.items.find(
        op => op.option_id === findOptionInSelected.id,
      );
      let findValue = findOption.options.find(
        value => value.id === findOptionInSelected.value[0],
      );
      if (findValue) {
        dropdownValue = findValue.product.name;
      }
    }

    const onChangeDropdown = name => {
      let findOption = null;
      let selectedOptionsTmp = selectedOptions.filter(selectedOption => {
        return !(selectedOption.id === bundleItem.option_id);
      });

      bundleItem.options.map(option => {
        if (name === option.product.name) {
          findOption = option;
        }
      });

      selectedOptionsTmp.push({
        id: bundleItem.option_id,
        quantity: findOption.quantity,
        value: [findOption.id],
      });
      setSelectedOptions(selectedOptionsTmp);
    };

    const onResetDropdown = () => {
      let selectedOptionsTmp = selectedOptions.filter(selectedOption => {
        return !(selectedOption.id === bundleItem.option_id);
      });

      setSelectedOptions(selectedOptionsTmp);
    };

    if (type === DROPDOWN) {
      bundleItem.options.map(option => {
        customData.push({...option, name: option.product.name});
      });
    }
    // End - additional code for dropdown

    // start - additional code for multiple select
    if (type === MULTIPLE_SELECT) {
      bundleItem.options.map(option => {
        let selected = false;
        let findValue = findOptionInSelected?.value?.find(
          val => val === option.id,
        );

        if (findValue) {
          selected = true;
        }

        customData.push({name: option.product.name, selected});
      });
    }

    // on Select multiple option
    const onRemoveMultiselect = name => {
      let optionParam = bundleItem.options.find(
        opt => opt.product.name === name,
      );

      let bundleItemOptionIdParam = bundleItem.option_id;
      let selectedOptionsTmp = selectedOptions.filter(selectedOption => {
        return !(selectedOption.id === bundleItemOptionIdParam);
      });

      let optionFind = selectedOptions.find(
        selectedOption => selectedOption.id === bundleItemOptionIdParam,
      );

      if (optionFind) {
        let valueFind = optionFind.value.find(val => val === optionParam?.id);
        if (valueFind) {
          let newValue = optionFind.value
            .filter(val => val !== valueFind)
            .sort();
          if (newValue.length > 0) {
            selectedOptionsTmp.push({
              id: bundleItemOptionIdParam,
              quantity: optionParam.quantity,
              value: newValue,
            });
          }
        } else {
          selectedOptionsTmp.push({
            id: bundleItemOptionIdParam,
            quantity: optionParam.quantity,
            value: [...optionFind.value, optionParam.id].sort(),
          });
        }
      } else {
        selectedOptionsTmp.push({
          id: bundleItemOptionIdParam,
          quantity: optionParam.quantity,
          value: [optionParam.id],
        });
      }

      setSelectedOptions(selectedOptionsTmp);
    };

    // on Select multiple option
    const onSaveMultiselect = (multiselectData = []) => {
      let arrayOptionParam = [];
      multiselectData.map(item => {
        if (item.selected) {
          let findName = bundleItem.options.find(
            opt => opt.product.name === item.name,
          );
          arrayOptionParam.push(findName);
        }
      });

      let bundleItemOptionIdParam = bundleItem.option_id;
      let selectedOptionsTmp = selectedOptions.filter(selectedOption => {
        return !(selectedOption.id === bundleItemOptionIdParam);
      });

      let values = [];
      let quantity = 1;
      arrayOptionParam.map(optionParam => {
        values.push(optionParam.id);
      });

      if (values.length > 0) {
        selectedOptionsTmp.push({
          id: bundleItemOptionIdParam,
          quantity: quantity,
          value: values.sort(),
        });
      }

      setSelectedOptions(selectedOptionsTmp);
    };
    // End - additional code for multiple select

    return (
      <Section
        key={bundleItem.option_id}
        style={[styles.bundleOptionContainer]}>
        <Label>
          <Label color={Colors.PRIMARY}>{bundleItem.title}</Label>
          <Show when={bundleItem.required}>
            <Label color={Colors.ALERT}>{'*'}</Label>
          </Show>
        </Label>
        <Show when={type === DROPDOWN}>
          <Section>
            <Input
              type={TYPE_INPUT_FIELD}
              key={`dropdown-${bundleItem.option_id}`}
              data={customData}
              label={
                dropdownValue !== ''
                  ? ''
                  : t('product_detail.placeholder.chooseProduct')
              }
              onPress={() => {}}
              onChange={onChangeDropdown}
              value={dropdownValue}
              inputRightCustom={
                dropdownValue !== '' && (
                  <TextInput.Icon
                    name={() => (
                      <Icon name={'x'} size={20} onPress={onResetDropdown} />
                    )}
                  />
                )
              }
            />
          </Section>
        </Show>
        <Show when={type === MULTIPLE_SELECT}>
          <Section>
            <Input
              multiselect={true}
              type={TYPE_INPUT_FIELD}
              key={`multiselect-${bundleItem.option_id}`}
              data={customData}
              label={t('product_detail.placeholder.chooseProduct')}
              onPress={() => {}}
              onChange={() => {}}
              value={''}
              onSaveMultiselect={onSaveMultiselect}
              onRemoveMultiselect={onRemoveMultiselect}
            />
          </Section>
        </Show>
        <Show when={type === RADIO || type === CHECKBOX}>
          {bundleItem.options.map(option => {
            return (
              <BundleItemsOption
                option={option}
                bundleItemOptionId={bundleItem.option_id}
                key={option.id}
                type={type}
              />
            );
          })}
        </Show>
      </Section>
    );
  };

  const BundleItemsOption = ({bundleItemOptionId, option, type}) => {
    // check single option
    const checkSingleOption = optionId => {
      let found = false;
      selectedOptions.forEach(selectedOption => {
        if (
          selectedOption.id === bundleItemOptionId &&
          selectedOption.value[0] === optionId
        ) {
          found = true;
        }
      });
      return found;
    };

    // on Select single option
    const onSelectSingleOption = (bundleItemOptionIdParam, optionParam) => {
      let selectedOptionsTmp = selectedOptions.filter(selectedOption => {
        return !(selectedOption.id === bundleItemOptionId);
      });
      selectedOptionsTmp.push({
        id: bundleItemOptionIdParam,
        quantity: optionParam.quantity,
        value: [option.id],
      });
      setSelectedOptions(selectedOptionsTmp);
    };

    // check multiple option
    const checkMultipleOption = (bundleItemOptionIdParam, optionId) => {
      let found = false;

      let optionFind = selectedOptions.find(
        selectedOption => selectedOption.id === bundleItemOptionIdParam,
      );

      if (optionFind) {
        let valueFind = optionFind.value.find(val => val === optionId);
        if (valueFind) {
          found = true;
        }
      }

      return found;
    };

    // on Select multiple option
    const onSelectMultipleOption = (bundleItemOptionIdParam, optionParam) => {
      let selectedOptionsTmp = selectedOptions.filter(selectedOption => {
        return !(selectedOption.id === bundleItemOptionId);
      });

      let optionFind = selectedOptions.find(
        selectedOption => selectedOption.id === bundleItemOptionIdParam,
      );

      if (optionFind) {
        let valueFind = optionFind.value.find(val => val === option.id);
        if (valueFind) {
          let newValue = optionFind.value
            .filter(val => val !== valueFind)
            .sort();
          if (newValue.length > 0) {
            selectedOptionsTmp.push({
              id: bundleItemOptionIdParam,
              quantity: optionParam.quantity,
              value: newValue,
            });
          }
        } else {
          selectedOptionsTmp.push({
            id: bundleItemOptionIdParam,
            quantity: optionParam.quantity,
            value: [...optionFind.value, option.id].sort(),
          });
        }
      } else {
        selectedOptionsTmp.push({
          id: bundleItemOptionIdParam,
          quantity: optionParam.quantity,
          value: [option.id],
        });
      }

      setSelectedOptions(selectedOptionsTmp);
    };

    const OptionInputType = () => {
      if (type === RADIO) {
        return (
          <RadioButton
            selected={checkSingleOption(option.id)}
            onPress={() => onSelectSingleOption(bundleItemOptionId, option)}
          />
        );
      }

      if (type === CHECKBOX) {
        return (
          <CheckBox
            selected={checkMultipleOption(bundleItemOptionId, option.id)}
            onPress={() => onSelectMultipleOption(bundleItemOptionId, option)}
          />
        );
      }
      return null;
    };

    const finalPrice = option.product.price_range.maximum_price.final_price;

    return (
      <Section style={styles.bundleOptionItemContainer}>
        <OptionInputType />
        <FastImage
          key={option.product.name}
          style={styles.bundleOptionItemImage}
          source={{
            uri: option.product.thumbnail.url,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Section>
          <Label>{option.product.name}</Label>
          <Label>{'Qty: ' + option.quantity}</Label>
          <Section row>
            <Label>
              {numberFormat({
                prefix: finalPrice.currency,
                value: finalPrice.value,
              })}
            </Label>
            <Show when={option.quantity > 1}>
              <Label>
                {' '}
                <Label bold>x{option.quantity} </Label>
                {numberFormat({
                  prefix: finalPrice.currency,
                  value: finalPrice.value * option.quantity,
                })}
              </Label>
            </Show>
          </Section>
        </Section>
      </Section>
    );
  };

  return (
    <Show when={product.__typename === TYPENAME_BUNDLE}>
      <Section
        style={{
          marginHorizontal: 20,
          marginVertical: 20,
          width: Mixins.MAX_WIDTH - 40,
        }}>
        {product.items.map(bundleItem => {
          return (
            <BundleItem bundleItem={bundleItem} key={bundleItem.option_id} />
          );
        })}
        <Section>
          <Label>
            {t('product_detail.customBundlePrice')} {': '}
            <Label bold>
              {numberFormat({
                value: totalBundlePrice,
              })}
            </Label>
          </Label>
        </Section>
      </Section>
    </Show>
  );
};

BundleProduct.propTypes = {
  // product
  product: PropTypes.any,
  // selected options
  selectedOptions: PropTypes.any,
  // func to change select option val
  setSelectedOptions: PropTypes.func,
  // func to change bundle item count
  setBundleItemsCount: PropTypes.func,
};

export default BundleProduct;
