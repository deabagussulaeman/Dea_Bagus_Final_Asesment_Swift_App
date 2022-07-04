import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {useReactiveVar} from '@apollo/client';
import {Colors} from '@app/styles';
import {MAX_WIDTH, normalize} from '@app/styles/mixins';
import {rxUserTheme} from '@app/services/cache';
import {FlatList, Image, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import styles from '@app/_modules/main_categories/views/tablet/styles';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import {Mixins} from '@root/_src/core/styles';

/**
 * ----------------------------------------- *
 * @component CategoryName
 * @param {Object} Views.propTypes
 * @summary Text Component for categories
 * @returns Text Components
 * ----------------------------------------- *
 */
const RenderName = ({parentId, name}) => {
  if (!parentId) {
    if (name.includes('<span')) {
      return (
        <Label bold style={[styles.vesMenuText]}>
          {name.split('<span')[0]}
        </Label>
      );
    }
    return (
      <Label style={[styles.vesMenuText, styles.vesMenuChildText]}>
        {name}
      </Label>
    );
  }

  return (
    <Label style={[styles.vesMenuText, {width: MAX_WIDTH * 0.7}]}>{name}</Label>
  );
};

/**
 * ----------------------------------------- *
 * @component CategoryVesMenu
 * @param {Object} Views.propTypes
 * @summary Component for ves menu
 * @returns Components
 * ----------------------------------------- *
 */
const CategoryVesMenu = ({
  category,
  visible,
  parentId,
  selectedCategoryVesMenu,
  setSelectedCategoryVesMenu,
  onPressCategory,
  scheme,
  t,
}) => {
  const isShow = selectedCategoryVesMenu.includes(category.id);

  if (category?.name && visible) {
    return (
      <Section
        width={Mixins.MAX_WIDTH * 0.75}
        horizontalStart
        style={{
          paddingLeft: parentId ? 0 : 15,
          ...styles.vesMenuWrapper,
        }}
        onPress={
          category.children?.length
            ? () => {
                if (parentId) {
                  if (selectedCategoryVesMenu.includes(category.id)) {
                    setSelectedCategoryVesMenu(
                      selectedCategoryVesMenu.filter(
                        item => item !== category.id,
                      ),
                    );
                  } else {
                    setSelectedCategoryVesMenu([
                      ...selectedCategoryVesMenu,
                      category.id,
                    ]);
                  }
                } else {
                  if (selectedCategoryVesMenu.includes(category.id)) {
                    setSelectedCategoryVesMenu([]);
                  } else {
                    setSelectedCategoryVesMenu([category.id]);
                  }
                }
              }
            : () => {
                onPressCategory(category.id, category.name);
              }
        }>
        <Section style={styles.vesMenuNameWrapper}>
          <RenderName parentId={parentId} name={category.name} />
          {category.children?.length > 0 && (
            <Icon
              color={scheme === 'dark' ? Colors.WHITE : Colors.BLACK}
              name={isShow ? 'chevron-down' : 'chevron-right'}
              style={{marginLeft: parentId ? 60 : 0}}
              size={normalize(25)}
            />
          )}
        </Section>
        {isShow &&
          category.children?.length > 0 &&
          category.children
            .slice(0, Config.VESMENU_ITEM || 5)
            .map((child, index) => {
              if (isShow) {
                if (index === 0) {
                  return (
                    <Section
                      key={`ves-menu-${index}`}
                      keyIndex={`ves-menu-${index}`}
                      horizontalStart>
                      <CategoryVesMenu
                        category={{
                          name: t('label.viewAll'),
                          id: category.category_id
                            ? category.category_id
                            : category.id,
                        }}
                        visible={isShow}
                        parentId={category.id}
                        selectedCategoryVesMenu={selectedCategoryVesMenu}
                        setSelectedCategoryVesMenu={setSelectedCategoryVesMenu}
                        onPressCategory={onPressCategory}
                        t={t}
                      />
                      <CategoryVesMenu
                        category={child}
                        visible={isShow}
                        parentId={category.id}
                        selectedCategoryVesMenu={selectedCategoryVesMenu}
                        setSelectedCategoryVesMenu={setSelectedCategoryVesMenu}
                        onPressCategory={onPressCategory}
                        t={t}
                      />
                    </Section>
                  );
                }
                return (
                  <CategoryVesMenu
                    key={`ves-menu-${index}`}
                    category={child}
                    visible={isShow}
                    parentId={category.id}
                    selectedCategoryVesMenu={selectedCategoryVesMenu}
                    setSelectedCategoryVesMenu={setSelectedCategoryVesMenu}
                    onPressCategory={onPressCategory}
                    t={t}
                  />
                );
              }
              return null;
            })}
      </Section>
    );
  }
  return null;
};

const MainCategoriesTabletView = ({
  t,
  loading,
  categories: categoriesData,
  onPressCategory,
  vesMenu = null,
}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary list of constant local state
   * ----------------------------------------- *
   */
  const [selectedCategoryVesMenu, setSelectedCategoryVesMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  /**
   * ----------------------------------------- *
   * @dependency [categoriesData]
   * @summary set list category from remote
   * ----------------------------------------- *
   */
  useEffect(() => {
    if (categoriesData) {
      if (vesMenu) {
        setCategories(categoriesData.items);
      } else {
        const dataTmp = categoriesData.children.filter(
          category => category.include_in_menu === 1,
        );
        setCategories(dataTmp);
      }
    }
  }, [categoriesData]);

  /**
   * ----------------------------------------- *
   * @component CategoryChildren
   * @param {Object} Views.propTypes
   * @summary Component for category have children
   * @returns Components
   * ----------------------------------------- *
   */
  const CategoryChildren = ({categoryChildren, visible, styleProp = {}}) => {
    if (categoryChildren && visible) {
      return (
        <Section
          border={1}
          borderColor={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK}
          style={[styles.childrenContainer, styleProp]}>
          {categoryChildren.map((child, index) => {
            return (
              <Section
                key={`category-child-${child.id}`}
                keyIndex={`category-child-${child.id}`}>
                <Section
                  onPress={
                    child.children?.length
                      ? () => {
                          if (selectedSubCategory === child.id) {
                            setSelectedSubCategory(null);
                          } else {
                            setSelectedSubCategory(child.id);
                          }
                        }
                      : () => {
                          onPressCategory(child.id);
                        }
                  }
                  style={[
                    styles.childrenItemContainer,
                    {
                      borderBottomWidth:
                        index === categoryChildren.length - 1 ? 0 : 1,
                    },
                  ]}>
                  <Label>{child.name}</Label>
                </Section>
                {child.children ? (
                  <Section marginHorizontal={25}>
                    <CategoryChildren
                      categoryChildren={child.children}
                      visible={child.id === selectedSubCategory}
                      styleProp={{borderWidth: 0}}
                    />
                  </Section>
                ) : null}
              </Section>
            );
          })}
        </Section>
      );
    } else {
      return null;
    }
  };

  /**
   * ----------------------------------------- *
   * @component CategoryHeader
   * @param {Object} Views.propTypes
   * @summary Component for category header
   * @returns Components
   * ----------------------------------------- *
   */
  const CategoryHeader = ({item}) => {
    const selected = item.id === selectedCategory;
    let imageSourceCondition = item.image_path && item.image_path !== '';
    if (imageErrors[item.id]) {
      imageSourceCondition = false;
    }
    return (
      <Section marginVertical={6}>
        <Section
          onPress={() => {
            if (selected) {
              setSelectedCategory(null);
            } else {
              setSelectedCategory(item.id);
            }
          }}
          style={[
            styles.headerContainer,
            {
              borderBottomLeftRadius: selected ? 0 : 15,
              borderBottomRightRadius: selected ? 0 : 15,
            },
          ]}>
          <Show when={imageSourceCondition}>
            <FastImage
              key={item.id}
              style={styles.headerImage}
              source={{
                uri: item.small_image.url.toString(),
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              onError={() => {
                const newImageErrors = {
                  ...imageErrors,
                  [item.id]: true,
                };
                setImageErrors(newImageErrors);
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </Show>
          <Show when={!imageSourceCondition}>
            <Image
              source={require('@app/assets/images/placeholder.png')}
              style={styles.headerImage}
            />
          </Show>
          <Label
            style={{
              paddingHorizontal: normalize(20),
            }}>
            {item.name}
          </Label>
        </Section>
        <CategoryChildren
          categoryChildren={item.children}
          visible={selectedCategory === item.id}
        />
      </Section>
    );
  };

  /**
   * ----------------------------------------- *
   * @function renderCategoryVesMenu
   * @summary Component for category ves menu
   * @returns Components
   * ----------------------------------------- *
   */
  const renderCategoryVesMenu = () => {
    if (categories?.length > 0) {
      return categories.map(category => {
        return (
          <CategoryVesMenu
            key={`category-${category.id}`}
            category={category}
            visible={true}
            selectedCategoryVesMenu={selectedCategoryVesMenu}
            setSelectedCategoryVesMenu={setSelectedCategoryVesMenu}
            onPressCategory={onPressCategory}
            scheme={getRxUserTheme}
            t={t}
          />
        );
      });
    }
    return <Label>{t('main_categories.view.noData')}</Label>;
  };

  /**
   * ----------------------------------------- *
   * @function renderCategory
   * @summary Component for category
   * @returns Components
   * ----------------------------------------- *
   */
  const renderCategory = () => {
    if (loading) {
      return <ActivityIndicator />;
    } else {
      if (vesMenu) {
        return <ScrollView>{renderCategoryVesMenu()}</ScrollView>;
      } else {
        return (
          <FlatList
            data={categories}
            renderItem={CategoryHeader}
            keyExtractor={item => item.url_key}
            style={styles.listContainer}
          />
        );
      }
    }
  };

  //TODO : fix navbar position
  return (
    <>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        title={t('main_categories.title.categories')}
      />
      <Section flex horizontalCenter verticalCenter>
        {renderCategory()}
      </Section>
    </>
  );
};

MainCategoriesTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // loading state
  loading: PropTypes.bool,
  // data
  categories: PropTypes.any,
  // function category
  onPressCategory: PropTypes.func,
  // ves menu
  vesMenu: PropTypes.any,
};

export default MainCategoriesTabletView;
