import Section from '@app/components/Section';
import React from 'react';
import {Modal, View} from 'react-native';
import RenderHTML from '@app/components/RenderHTML';
import PropTypes from 'prop-types';
import {Colors, CmsStyles} from '@app/styles';
import Button from '@app/components/Button/index';
import {onGoStore} from '@app/helpers/Version';

const DialogUpdate = ({visible, content}) => {
  const regex = /<br|\n\s+|\n|\r|\r\s*\\?>/g;
  let finalHtmlBlock = encodeURIComponent(content);
  finalHtmlBlock = decodeURIComponent(finalHtmlBlock);
  finalHtmlBlock = finalHtmlBlock
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  const RenderNode = ({TDefaultRenderer, tnode, ...defaultRendererProps}) => {
    return (
      <TDefaultRenderer tnode={tnode} {...defaultRendererProps}>
        {tnode.attributes?.class === 'row' ? (
          <ButtonRow tnode={tnode} />
        ) : tnode.attributes?.class?.includes('btn') ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '5%',
            }}>
            <Button
              label={tnode.domNode.children[0].data}
              textStyleProp={{color: Colors.WHITE}}
              styleProp={{
                backgroundColor: Colors.PRIMARY,
                borderColor: Colors.PRIMARY,
              }}
              onPress={
                tnode.domNode.children[0].data === 'Update'
                  ? () => onGoStore()
                  : () => console.log('cancel')
              }
            />
          </View>
        ) : null}
      </TDefaultRenderer>
    );
  };

  const ButtonRow = ({tnode}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          marginTop: '5%',
        }}>
        {tnode.children.map(item => {
          const title = item.children[0]?.domNode?.children[0]?.data;
          return (
            <Button
              label={title}
              textStyleProp={{color: Colors.WHITE}}
              styleProp={{
                backgroundColor: Colors.PRIMARY,
                borderColor: Colors.PRIMARY,
              }}
              onPress={
                tnode.domNode.children[0].data === 'Update'
                  ? () => onGoStore()
                  : () => console.log('cancel')
              }
            />
          );
        })}
      </View>
    );
  };

  const renderers = {
    div: RenderNode,
  };

  return (
    <Modal visible={visible} transparent>
      <Section
        flex
        horizontalCenter
        verticalCenter
        backgroundColor={Colors.WHITE}>
        <Section
          width={'90%'}
          padding={20}
          borderRadius={15}
          horizontalCenter
          verticalCenter>
          <RenderHTML
            htmlBlock={finalHtmlBlock.replace(regex, '')}
            tagsStyles={CmsStyles.tagStylesPrivacyPolicy}
            classesStyles={CmsStyles.classesStylesPrivacyPolicy}
            renderers={renderers}
          />
        </Section>
      </Section>
    </Modal>
  );
};

DialogUpdate.propTypes = {
  // show modal
  visible: PropTypes.bool,
  // content html tag
  content: PropTypes.string,
};

export default DialogUpdate;
