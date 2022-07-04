import React, {useState} from 'react';
import {normalize} from '@app/styles/mixins';
import {Colors} from '@app/styles';
import Section from '@app/components/Section';
import Show from '@app/components/Show';
import ShareButton from '@app/components/ShareButton';
import {rxUserTheme} from '@app/services/cache';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {useReactiveVar} from '@apollo/client';
import {socialShares} from '@root/swift.config';
import PropTypes from 'prop-types';

const SocialShareBlock = ({url, title, message}) => {
  const [showMore, setShowMore] = useState(false);
  const getRxUserTheme = useReactiveVar(rxUserTheme);

  return (
    <Section row spaceBetween horizontalCenter marginHorizontal={10}>
      <Section
        border={1}
        borderColor={getRxUserTheme === 'dark' ? Colors.WHITE : Colors.BLACK}
        borderRadius={15}
        padding={5}
        marginHorizontal={10}
        onPress={() => setShowMore(!showMore)}>
        <AntDesignIcon
          name={showMore ? 'right' : 'sharealt'}
          size={normalize(20)}
        />
      </Section>
      <Show when={showMore}>
        <ShareButton url={url} title={title} message={message} />
        {socialShares.map((social, index) => {
          return (
            <ShareButton
              key={`social-share-${index}`}
              url={url}
              title={title}
              type={social}
              message={message}
            />
          );
        })}
      </Show>
    </Section>
  );
};

SocialShareBlock.propTypes = {
  // url
  url: PropTypes.string,
  // title
  title: PropTypes.string,
  // message
  message: PropTypes.string,
};

export default SocialShareBlock;
