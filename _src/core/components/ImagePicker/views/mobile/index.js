import Label from '@app/components/Label';
import Section from '@app/components/Section';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Mixins} from '@app/styles';
import Button from '@app/components/Button';
import styles from '@app/components/ImagePicker/views/mobile/styles';
import PropTypes from 'prop-types';

const ImagePickerComponent = ({label, callback, style}) => {
  const {t} = useTranslation();

  const [image, setImage] = useState({uri: null});

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      includeBase64: true,
      cropping: true,
    }).then(imageParam => {
      callback(imageParam);
      setImage({uri: imageParam.path});
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      includeBase64: true,
      cropping: true,
    }).then(imageParam => {
      callback(imageParam);
      setImage({uri: imageParam.path});
    });
  };

  return (
    <Section
      horizontalCenter
      verticalCenter
      spaceBetween
      width={Mixins.MAX_WIDTH}
      paddingVertical={10}
      style={style}>
      <Label alignStart>{label}</Label>
      <Section
        row
        spaceAround
        horizontalCenter
        verticalCenter
        width="100%"
        paddingVertical={10}>
        <Button
          label={t('label.openGallery')}
          onPress={() => openGallery()}
          styleProp={styles.buttonOpen}
          textStyleProp={styles.buttonText}
        />
        <Button
          label={t('label.openCamera')}
          onPress={() => openCamera()}
          styleProp={styles.buttonOpen}
          textStyleProp={styles.buttonText}
        />
      </Section>
      {image.uri !== null && (
        <Section style={styles.framePreview}>
          <Image source={image} style={styles.imagePreview} />
        </Section>
      )}
    </Section>
  );
};

ImagePickerComponent.propTypes = {
  // label
  label: PropTypes.string,
  // callback image
  callback: PropTypes.func,
  // style section
  style: PropTypes.object,
};

export default ImagePickerComponent;
