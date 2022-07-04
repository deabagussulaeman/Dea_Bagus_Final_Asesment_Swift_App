import React from 'react';
import HTMLView from 'react-native-htmlview';
import {Colors} from '@app/styles';
import PropTypes from 'prop-types';
// import ProductHero from '@app/components/ProductHero/index';
// import BrandBanner from '@app/components/BrandBanner/index';
import WidgetSliderBanner from '@app/components/PageBuilder/atoms/WidgetSliderBanner';
import WidgetSliderCategory from '@app/components/PageBuilder/atoms/WidgetSliderCategory';
import WidgetTermsConditions from '@app/components/PageBuilder/atoms/WidgetTermsConditions';

const HtmlType = ({
  htmlBlock,
  contentBackgroundColor = Colors.PRIMARY,
  contentTextColor = Colors.BLACK,
  contentFontSize = 30,
}) => {
  const regex = /<br|\n\s+|\n|\r|\r\s*\\?>/g;
  let sliders = [];
  let categorySliders = [];
  let productHeroes = [];
  let brandBanners = [];
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
  finalHtmlBlock = encodeURIComponent(finalHtmlBlock);
  finalHtmlBlock = decodeURIComponent(finalHtmlBlock);
  finalHtmlBlock = finalHtmlBlock
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  const getSliderData = node => {
    if (node.attribs && node.attribs['data-content-type']) {
      if (node.attribs['data-content-type'] === 'slider') {
        const sliderChildren = node.children;
        const slideNodes = sliderChildren.filter(child => child.type === 'tag');
        slideNodes.map(x => {
          x.children.map((y, index) => {
            if (y.name === 'div' || y.name === 'a') {
              const z = y.children.filter(child => child.type === 'tag');
              const dataImages = z[0].attribs['data-background-images'];
              const encoded = encodeURIComponent(dataImages);
              const decoded = decodeURIComponent(encoded);
              const slideImage = JSON.parse(decoded.replace(/\\&quot;/g, '"'));
              sliders.push({
                id: index + 1,
                is_clickable: y.name === 'a' ? true : false,
                image_url: slideImage.mobile_image,
                url_redirection: slideImage.mobile_image,
              });
            }
          });
        });
      }
      if (node.attribs['data-content-type'] === 'category-slider') {
        const categorySliderChildren = node.children[1].children;
        categorySliderChildren.map((child, index) => {
          const category = child.children[0].children[1];
          const categoryImage = category.children[0].children[0].attribs.src;
          const categoryName = category.children[1].children[0].data;
          categorySliders.push({
            id: index + 1,
            name: categoryName,
            category_icon: categoryImage,
          });
        });
      }
    }
  };

  const getProductHeroData = node => {
    if (node.attribs && node.attribs?.class?.includes('product-hero')) {
      const productHeroChildren = node.children[0].children;
      productHeroChildren.map((child, index) => {
        child.children.map(hero => {
          if (hero.children[0].name === 'a') {
            productHeroes.push({
              id: index + 1,
              uri: hero.children[0].children[1].attribs.src,
            });
          } else {
            productHeroes.push({
              id: index + 1,
              uri: hero.children[1].attribs.src,
            });
          }
        });
      });
    }
  };

  const getBrandBannerData = node => {
    if (node.attribs && node.attribs?.class?.includes('brand-banner')) {
      const brandBannerChildren = node.children;
      let bannerId = 1;
      brandBannerChildren.map(child => {
        child.children.map(x => {
          const banner = x.children[0];
          if (banner.children[0].name === 'a') {
            brandBanners.push({
              id: bannerId,
              uri: banner.children[0].children[1].attribs.src,
            });
          } else {
            brandBanners.push({
              id: bannerId,
              uri: banner.children[1].attribs.src,
            });
          }
          bannerId++;
        });
      });
    }
  };

  const renderNode = node => {
    getSliderData(node);
    getProductHeroData(node);
    getBrandBannerData(node);
    if (node.attribs) {
      if (node.attribs['data-content-type']) {
        if (node.attribs['data-content-type'] === 'slider') {
          return <WidgetSliderBanner key={'node-1'} data={sliders} />;
        } else if (node.attribs['data-content-type'] === 'category-slider') {
          return <WidgetSliderCategory key={'node-2'} data={categorySliders} />;
        }
      }
      // else if (node.attribs?.class?.includes('product-hero')) {
      //   return <ProductHero key={'node-3'} data={productHeroes} />;
      // } else if (node.attribs?.class?.includes('brand-banner')) {
      //   return <BrandBanner key={'node-4'} data={brandBanners} />;
      // }
      else if (node.attribs?.class?.includes('featured-brands')) {
        return null;
      }
    }
    if (node.attribs?.class?.includes('terms-conditions-mobile')) {
      return <WidgetTermsConditions key={'node-5'} children={node.children} />;
    }
  };

  return (
    <HTMLView
      addLineBreaks={false}
      value={finalHtmlBlock.replace(regex, '')}
      renderNode={renderNode}
    />
  );
};

HtmlType.propTypes = {
  // html block
  htmlBlock: PropTypes.any,
  // background color
  contentBackgroundColor: PropTypes.string,
  // text color
  contentTextColor: PropTypes.string,
  // font size
  contentFontSize: PropTypes.number,
};

export default HtmlType;
