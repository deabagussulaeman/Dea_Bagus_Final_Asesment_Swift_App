/* eslint-disable no-shadow */
import React from 'react';
import {ScrollView} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Mixins} from '@app/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {
  formatDateNotif as formatDateBlog,
  trimHTMLTags,
} from '@app/helpers/General';
import NavBar from '@app/components/NavBar';
import Section from '@app/components/Section';
import SocialShareBlock from '@app/components/SocialShareBlock';
import Label from '@app/components/Label';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import styles from '@app/_modules/blog_detail/views/tablet/styles';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';

const BlogDetailTabletView = ({blogDetail, blogLoading}) => {
  const {t} = useTranslation();
  const BlogDetail = ({blogDetail, blogLoading}) => {
    if (!blogDetail) {
      if (blogLoading) {
        return (
          <Section flex horizontalCenter verticalCenter marginTop={30}>
            <ActivityIndicator />
          </Section>
        );
      } else {
        return (
          <Section flex horizontalCenter verticalCenter>
            <Label>{t('blog_detail.view.noDetail')}</Label>
          </Section>
        );
      }
    } else {
      return (
        <ScrollView>
          <Section width={Mixins.MAX_WIDTH * 0.75} style={styles.mainContainer}>
            <FastImage
              key={blogDetail.id}
              style={styles.blogImageContainer}
              resizeMode={FastImage.resizeMode.stretch}
              source={{
                uri: blogDetail.featured_image_url,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
            />
            <Section horizontalStart marginVertical={10}>
              <Section row spaceBetween width="100%">
                <Section horizontalStart marginHorizontal={20}>
                  <Label bold large>
                    {blogDetail.title}
                  </Label>
                  <Label small>{formatDateBlog(blogDetail.created_at)}</Label>
                </Section>

                <SocialShareBlock
                  url={`${Config.PWA_BASE_URL}/blog/${blogDetail.url_key}`}
                  title={blogDetail.title}
                  message={t('blog_detail.view.checkArticle')}
                />
              </Section>

              <Section marginVertical={10} marginHorizontal={20}>
                <Label small>{trimHTMLTags(blogDetail.content)}</Label>
              </Section>
            </Section>
          </Section>
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        useBack
        title={t('label.newsArticle')}
      />
      <BlogDetail blogDetail={blogDetail} blogLoading={blogLoading} />
    </SafeAreaView>
  );
};

BlogDetailTabletView.propTypes = {
  // data for blog detail
  blogDetail: PropTypes.any,
  // loading for blog
  blogLoading: PropTypes.bool,
};

export default BlogDetailTabletView;
