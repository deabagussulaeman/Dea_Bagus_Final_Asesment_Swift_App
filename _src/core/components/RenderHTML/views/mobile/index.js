import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {WebView} from 'react-native-webview';
import RenderHtml from 'react-native-render-html';
import {Mixins} from '@app/styles/index';

const RenderHTML = ({
  htmlBlock,
  enableCSSInlineProcessing = true,
  tagsStyles = {},
  classesStyles = {},
  renderers,
}) => {
  const {width} = useWindowDimensions();
  let finalHtmlBlock = htmlBlock;
  finalHtmlBlock = encodeURIComponent(finalHtmlBlock);
  finalHtmlBlock = decodeURIComponent(finalHtmlBlock);
  finalHtmlBlock = finalHtmlBlock
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  const source = {
    html: `${finalHtmlBlock}`,
  };
  if (finalHtmlBlock.includes('<iframe')) {
    return (
      <View style={{flex: 1, margin: 20}}>
        <WebView
          style={{flex: 1, height: Mixins.MAX_HEIGHT}}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          source={source}
        />
      </View>
    );
  }

  return (
    <RenderHtml
      contentWidth={width}
      source={source}
      enableCSSInlineProcessing={enableCSSInlineProcessing}
      tagsStyles={tagsStyles}
      classesStyles={classesStyles}
      renderers={renderers}
    />
  );
};

export default RenderHTML;
