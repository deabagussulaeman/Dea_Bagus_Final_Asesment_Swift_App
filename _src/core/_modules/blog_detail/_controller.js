import React, {useEffect, useState} from 'react';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GET_BLOG_BY_ID} from '@app/_modules/blog_detail/services/schema';
import PropTypes from 'prop-types';
import Views from '@app/_modules/blog_detail/views';
import {modules} from '@root/swift.config';

const BlogDetailController = props => {
  if (!modules.blog_detail.enable) {
    return null;
  }

  const {blogId} = props.route.params;
  const [blogDetail, setBlogDetail] = useState(null);

  const {data: blogData, loading: blogLoading} = useCustomQuery({
    schema: GET_BLOG_BY_ID,
    useInitData: true,
    variables: {blogId},
  });

  useEffect(() => {
    if (blogData?.data?.getBlogByFilter?.items[0]) {
      setBlogDetail(blogData?.data?.getBlogByFilter?.items[0]);
    }
  }, [blogData]);

  const controllerProps = {
    blogDetail,
    blogLoading,
  };

  return <Views {...props} {...controllerProps} />;
};

BlogDetailController.propTypes = {
  // route
  route: PropTypes.any,
};

export default BlogDetailController;
