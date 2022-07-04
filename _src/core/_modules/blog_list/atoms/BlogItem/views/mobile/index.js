import React from 'react';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MixinsNew} from '@app/styles';
import {TouchableRipple, Colors as ColorsPaper} from 'react-native-paper';
import {navigateTo} from '@app/helpers/Navigation';
import {modules} from '@root/swift.config';
import PropTypes from 'prop-types';
import {
  formatDateNotif as formatDateBlog,
  shortenText,
  trimHTMLTags,
} from '@app/helpers/General';
import FastImage from 'react-native-fast-image';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import Label from '@app/components/Label';

const BlogItem = ({blog}) => {
  const {t} = useTranslation();
  return (
    <Section
      style={{
        ...MixinsNew.padding({left: 20, top: 10, bottom: 10, right: 20}),
      }}>
      <TouchableRipple
        style={{
          borderWidth: 1,
          borderColor: ColorsPaper.grey300,
          borderRadius: 5,
        }}
        onPress={() =>
          navigateTo(modules.blog_detail.enable, modules.blog_detail.name, {
            blogId: blog.id,
          })
        }>
        <Section style={{flexDirection: 'row'}}>
          <Section style={{width: '30%', justifyContent: 'flex-start'}}>
            <Show when={blog.featured_image_url === ''}>
              <Image
                source={require('@app/assets/images/placeholder.png')}
                style={{
                  ...MixinsNew.borderRadius({topLeft: 5, bottomLeft: 5}),
                  width: 100,
                  height: 100,
                }}
              />
            </Show>
            <Show when={blog.featured_image_url !== ''}>
              <FastImage
                key={blog.id}
                resizeMode={FastImage.resizeMode.stretch}
                style={{
                  width: 100,
                  height: 100,
                }}
                source={{
                  uri: blog.featured_image_url,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
              />
            </Show>
          </Section>
          <Section style={{width: '70%', ...MixinsNew.padding(10)}}>
            <Label style={{fontSize: 16, fontWeight: 'bold'}}>
              {blog.title}
            </Label>
            <Label style={{color: ColorsPaper.grey500, fontSize: 10}}>
              {formatDateBlog(blog.created_at)}
            </Label>
            <Label style={{fontSize: 12, ...MixinsNew.margin({top: 5})}}>
              {blog.short_content === ''
                ? t('label.noData')
                : shortenText(trimHTMLTags(blog.short_content), 100)}
            </Label>
          </Section>
        </Section>
      </TouchableRipple>
    </Section>
  );
};

BlogItem.propTypes = {
  // blog
  blog: PropTypes.object,
};

export default BlogItem;
