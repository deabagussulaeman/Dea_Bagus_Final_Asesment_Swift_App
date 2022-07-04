import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {Mixins} from '@app/styles';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import Section from '@app/components/Section';
import Label from '@app/components/Label';
import BlogItem from '@app/_modules/blog_list/atoms/BlogItem/index';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

const BlogListView = ({
  blogListLoading,
  blogList,
  onLoadMore,
  noMoreData,
  refreshing,
  onRefresh,
}) => {
  const {t} = useTranslation();
  const FooterElement = () => {
    if (blogListLoading) {
      return <ActivityIndicator />;
    }

    return (
      <Section
        horizontalCenter
        verticalCenter
        width={Mixins.MAX_WIDTH}
        paddingVertical={20}>
        <Show when={noMoreData}>
          <Label>{t('blog_list.view.noMoreData')}</Label>
        </Show>
      </Section>
    );
  };

  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        useBack
        title={t('label.newsArticle')}
      />
      <FlatList
        data={blogList}
        renderItem={({item}) => <BlogItem blog={item} />}
        keyExtractor={item => item.id}
        ListFooterComponent={FooterElement}
        ListFooterComponentStyle={{alignSelf: 'center'}}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

BlogListView.propTypes = {
  // loading for blog
  blogListLoading: PropTypes.bool,
  // blog list
  blogList: PropTypes.array,
  // function to load more
  onLoadMore: PropTypes.func,
  // condition to show label if true
  noMoreData: PropTypes.bool,
  // condition for refresh control
  refreshing: PropTypes.bool,
  // function for refresh
  onRefresh: PropTypes.func,
};

export default BlogListView;
