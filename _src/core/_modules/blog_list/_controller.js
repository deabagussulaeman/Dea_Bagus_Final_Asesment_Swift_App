import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_BLOG_BY_FILTER} from '@app/_modules/blog_list/services/schema';
import PropTypes from 'prop-types';
import Views from '@app/_modules/blog_list/views';
import {modules} from '@root/swift.config';

const BlogListController = props => {
  if (!modules.blog_list.enable) {
    return null;
  }

  const {categoryId} = props.route.params;
  const {t} = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const [variables, setVariables] = useState({
    categoryId: categoryId,
    pageSize: 6,
    currentPage: 1,
  });

  const {data: blogListData, loading: blogListLoading} = useCustomQuery({
    schema: GET_BLOG_BY_FILTER,
    useInitData: true,
    variables,
  });

  useEffect(() => {
    if (blogListData?.data?.getBlogByFilter?.items) {
      if (!noMoreData) {
        const {items, total_count} = blogListData?.data?.getBlogByFilter;

        const currentData = blogList;
        const newData = [...currentData, ...items];

        setTotalCount(total_count);
        setBlogList(newData);

        if (total_count === newData.length) {
          setNoMoreData(true);
        }
      }
    }
  }, [blogListData]);

  const onLoadMore = () => {
    if (!blogListLoading) {
      if (totalCount > blogList.length) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);

        const variablesTmp = {
          ...variables,
          currentPage: newPage,
        };
        setVariables(variablesTmp);
      } else {
        setNoMoreData(true);
      }
    }
  };

  const onRefresh = async () => {
    const variablesTmp = {
      ...variables,
      currentPage: 1,
    };
    await setRefreshing(true);
    await setBlogList([]);
    await setCurrentPage(1);
    await setNoMoreData(false);
    await setVariables(variablesTmp);
    await setRefreshing(false);
  };

  const controllerProps = {
    t,
    blogList,
    blogListLoading,
    noMoreData,
    refreshing,
    onRefresh,
    onLoadMore,
  };

  return <Views {...props} {...controllerProps} />;
};

BlogListController.propTypes = {
  // route
  route: PropTypes.any,
};

export default BlogListController;
