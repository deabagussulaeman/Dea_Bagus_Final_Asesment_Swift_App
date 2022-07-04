/* eslint-disable no-shadow */
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {Colors, MixinsNew} from '@app/styles';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import {useTranslation} from 'react-i18next';
import {
  Button,
  TouchableRipple,
  Colors as ColorsPaper,
} from 'react-native-paper';
import {
  GET_BLOG_BY_FILTER,
  GET_BLOG_CATEGORY,
} from '@app/_modules/blog_list/services/schema';
import PropTypes from 'prop-types';
import Section from '@app/components/Section';
import BlogItem from '@app/_modules/blog_list/atoms/BlogItem';
import styles from '@app/components/Blog/views/mobile/styles';
import {Mixins} from '@app/styles/index';
import Label from '@app/components/Label';
import Shimmer from '@app/components/_Shimmer';

const Blog = (refreshing = false) => {
  const {t} = useTranslation();
  const [blogCategories, setBlogCategories] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [variables, setVariables] = useState({
    categoryId: selectedCategory,
    pageSize: 3,
    currentPage: 1,
  });

  const {
    data: blogCategoryData,
    loading: blogCategoryLoading,
    onRefetchData: onRefetchBlogCategory,
  } = useCustomQuery({schema: GET_BLOG_CATEGORY, useInitData: true});

  const {
    data: blogListData,
    loading: blogListLoading,
    onRefetchData: onRefetchBlogList,
  } = useCustomQuery({
    schema: GET_BLOG_BY_FILTER,
    useInitData: true,
    variables: variables,
  });

  const mount = useRef();

  // ComponentDidMount
  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  useEffect(() => {
    const refreshingData = async () => {
      await onRefetchBlogCategory({
        otherOpt: {fetchPolicy: 'network-only'},
      });
      await onRefetchBlogList({
        params: variables,
        otherOpt: {fetchPolicy: 'network-only'},
      });
    };

    if (mount.current && refreshing) {
      refreshingData();
    }
  }, [refreshing]);

  useEffect(() => {
    if (blogCategoryData?.data?.getBlogCategory?.data) {
      setBlogCategories(blogCategoryData?.data.getBlogCategory.data);
    }
  }, [blogCategoryData]);

  useEffect(() => {
    if (blogListData?.data?.getBlogByFilter?.items) {
      setBlogList(blogListData?.data?.getBlogByFilter?.items);
    }
  }, [blogListData]);

  const BlogCategories = ({selectedCategory}) => {
    const selectCategory = category => {
      let categoryId = 0;
      if (selectedCategory !== category.id) {
        categoryId = category.id;
      }
      const newVariables = {...variables, categoryId: categoryId};
      setVariables(newVariables);
      setSelectedCategory(categoryId);
      onRefetchBlogList({params: newVariables});
    };

    if (!blogCategoryLoading) {
      if (blogCategories.length) {
        return (
          <ScrollView horizontal style={styles.categoryRowContainer}>
            {blogCategories.map((category, index) => {
              const isSelected = selectedCategory === category.id;
              const fontWeight = isSelected ? {fontWeight: 'bold'} : {};
              return (
                <Button
                  key={'category-blog-' + index}
                  mode="contained"
                  onPress={() => selectCategory(category)}
                  style={[
                    styles.btnCategory,
                    {
                      backgroundColor: isSelected
                        ? Colors.PRIMARY
                        : ColorsPaper.grey300,
                    },
                  ]}>
                  <Label
                    color={isSelected ? ColorsPaper.white : ColorsPaper.grey500}
                    style={{
                      ...fontWeight,
                    }}>
                    {category.name}
                  </Label>
                </Button>
              );
            })}
          </ScrollView>
        );
      } else {
        return (
          <Section>
            <Label>{t('label.noData')}</Label>
          </Section>
        );
      }
    } else {
      return (
        <Section style={{paddingLeft: 20, marginBottom: 10}}>
          <Shimmer wrapperStyle={{width: 180, height: 40}} />
        </Section>
      );
    }
  };

  const BlogList = () => {
    if (!blogListLoading) {
      if (blogList.length) {
        return blogList.map((blog, index) => {
          return <BlogItem key={'blog-' + index} blog={blog} />;
        });
      } else {
        return (
          <Section>
            <Label>{t('label.noData')}</Label>
          </Section>
        );
      }
    } else {
      return (
        <Section horizontalCenter>
          <Shimmer wrapperStyle={{height: 300}} />
        </Section>
      );
    }
  };

  return (
    <>
      <Section
        width={Mixins.MAX_WIDTH}
        horizontalStart
        paddingHorizontal={20}
        paddingVertical={10}>
        <Label bold>{t('label.newsArticle')}</Label>
      </Section>
      <BlogCategories selectedCategory={selectedCategory} />
      <BlogList />
      <TouchableRipple
        style={{alignSelf: 'center', ...MixinsNew.padding(10)}}
        onPress={() =>
          navigateTo(modules.blog_list.enable, modules.blog_list.name, {
            categoryId: selectedCategory,
          })
        }>
        <Label>{t('label.viewMore')}</Label>
      </TouchableRipple>
    </>
  );
};

Blog.propTypes = {
  // refreshing state
  refreshing: PropTypes.bool,
};

export default Blog;
