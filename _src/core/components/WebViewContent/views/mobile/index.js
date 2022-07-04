import React from 'react';
import {ScrollView} from 'react-native';
import RenderHTML from '@app/components/RenderHTML';
import {Colors} from '@app/styles';
import Section from '@app/components/Section';
import styles from '@app/components/WebViewContent/views/mobile/styles';
import NodeImage from '@app/components/WebViewContent/atoms/NodeImage';
import NavBar from '@app/components/NavBar';
import Show from '@app/components/Show';
import {NODE_IMG, TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import PropTypes from 'prop-types';

const WebViewContent = ({
  htmlBlock,
  title = null,
  contentBackgroundColor = Colors.WHITE,
  contentTextColor = Colors.BLACK,
  contentFontSize = 16,
  styleProp = {},
}) => {
  let finalHtmlBlock =
    '<!DOCTYPE html><html lang="en"><body style="background-color: ' +
    contentBackgroundColor +
    ';color:' +
    contentTextColor +
    ';font-size: ' +
    contentFontSize.toString() +
    'px;">' +
    htmlBlock +
    '</body></html>';
  // let dynamicHeight = finalHtmlBlock.length * 0.75;

  const renderNode = node => {
    if (node.name === NODE_IMG) {
      return <NodeImage uri={node.attribs.src} />;
    }
  };

  return (
    <>
      <Show when={title}>
        <NavBar useBack type={TYPE_NAVBAR_CUSTOM} title={title} />
      </Show>
      <ScrollView style={[styles.mainContainer, styleProp]}>
        <Section style={styles.contentWrapper}>
          <RenderHTML
            htmlBlock={finalHtmlBlock}
            renderers={renderNode}
            classesStyles={styles}
          />
        </Section>
      </ScrollView>
    </>
  );
};

WebViewContent.propTypes = {
  // html block
  htmlBlock: PropTypes.string,
  // title
  title: PropTypes.string,
  // background color
  contentBackgroundColor: PropTypes.string,
  // text color
  contentTextColor: PropTypes.string,
  // font size
  contentFontSize: PropTypes.number,
  // style
  styleProp: PropTypes.object,
};

export default WebViewContent;
