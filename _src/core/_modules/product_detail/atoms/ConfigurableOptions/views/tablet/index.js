import React, {useEffect} from 'react';

import Label from '@app/components/Label';
import Section from '@app/components/Section';
import {Mixins, Colors} from '@app/styles';
import {normalize} from '@app/styles/mixins';
import {COLOR, SIZE} from '@app/helpers/Constants';
import {StyleSheet} from 'react-native';
import {useReactiveVar} from '@apollo/client';
import {rxUserTheme} from '@app/services/cache';
import PropTypes from 'prop-types';

const ConfigurableOptions = ({
  product,
  setSku,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
}) => {
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  //issue : if selectedSize & color state is placed inside this component -> after rerender selectedColor & size reset to null
  useEffect(() => {
    if (!selectedColor) {
      const optionColor = product.configurable_options.find(
        op => op.attribute_code === COLOR,
      );
      if (optionColor) {
        setSelectedColor(optionColor.values[0].label);
      }
    }

    if (!selectedSize) {
      const optionSize = product.configurable_options.find(
        op => op.attribute_code === SIZE,
      );
      if (optionSize) {
        setSelectedSize(optionSize.values[0].label);
      }
    }

    if (selectedSize && selectedColor) {
      product?.variants?.map(variant => {
        if (
          variant.product.sku ===
            [product.sku, selectedSize, selectedColor].join('-') ||
          variant.product.sku ===
            [product.sku, selectedColor, selectedSize].join('-')
        ) {
          setSku(variant.product.sku);
        }
      });
    }
  }, [selectedColor, selectedSize]);

  const selectedBorder =
    getRxUserTheme === 'dark' ? 'rgba(255,255,255, 0.7)' : 'rgba(0,0,0, 0.7)';
  const unselectedBorder =
    getRxUserTheme === 'dark' ? 'rgba(255,255,255, 0.4)' : 'rgba(0,0,0, 0.4)';

  if (product.__typename === 'ConfigurableProduct') {
    const configurableOptions = product.configurable_options;
    return (
      <Section marginVertical={10}>
        {configurableOptions.map(option => {
          return (
            <Section horizontalStart key={option.id}>
              <Label
                style={{
                  paddingHorizontal: normalize(16),
                  marginTop: normalize(5),
                  fontSize: normalize(12),
                }}>
                {option.attribute_code}
              </Label>
              <Section
                row
                width={Mixins.MAX_WIDTH}
                paddingHorizontal={20}
                marginVertical={5}>
                {option.values.map((item, index) => {
                  if (option.attribute_code === 'color') {
                    const iconColor = {
                      backgroundColor: item.label.toString().toLowerCase(),
                    };

                    return (
                      <Section
                        horizontalCenter
                        verticalCenter
                        key={item.label}
                        marginHorizontal={10}
                        borderRadius={22}
                        onPress={() => {
                          setSelectedColor(item.label);
                        }}
                        style={[
                          styles.swatchIconContainer,
                          iconColor,
                          {
                            borderColor:
                              item.label === selectedColor
                                ? selectedBorder
                                : unselectedBorder,
                          },
                        ]}
                      />
                    );
                  } else if (option.attribute_code === 'size') {
                    return (
                      <Section
                        horizontalCenter
                        verticalCenter
                        key={item.label}
                        marginHorizontal={10}
                        borderRadius={22}
                        onPress={() => {
                          setSelectedSize(item.label);
                        }}
                        style={[
                          styles.swatchIconContainer,
                          {
                            borderColor:
                              item.label === selectedSize
                                ? selectedBorder
                                : unselectedBorder,
                          },
                        ]}>
                        <Label large color={Colors.GRAY_DARK}>
                          {item.label}
                        </Label>
                      </Section>
                    );
                  }
                })}
              </Section>
            </Section>
          );
        })}
      </Section>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  swatchIconContainer: {
    borderWidth: normalize(2),
    width: normalize(25),
    height: normalize(25),
  },
});

ConfigurableOptions.propTypes = {
  // product
  product: PropTypes.object,
  // function to set sku
  setSku: PropTypes.func,
  // selected color
  selectedColor: PropTypes.string,
  // selected size
  selectedSize: PropTypes.string,
  // function to set color
  setSelectedColor: PropTypes.func,
  // function to set size
  setSelectedSize: PropTypes.func,
};

export default ConfigurableOptions;
