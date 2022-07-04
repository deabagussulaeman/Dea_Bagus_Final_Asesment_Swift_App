import React from 'react';
import {Mixins} from '@app/styles';
import {RefreshControl, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TYPE_NAVBAR_CUSTOM} from '@app/helpers/Constants';
import {formSchema} from '@app/_modules/main_home/forms';
import {GLOBAL, modules, component_types} from '@root/swift.config';
import PropTypes from 'prop-types';
import BannerSlider from '@app/components/BannerSlider';
import CategorySlider from '@app/components/CategorySlider';
import ProductSlider from '@app/components/ProductSlider';
import BrandSlider from '@app/components/BrandSlider';
import Blog from '@app/components/Blog';
import NavBar from '@app/components/NavBar';
import Divider from '@app/components/Divider';
import AtomNavBarRight from '@app/_modules/main_home/atoms/NavBarRight';
import styles from '@app/_modules/main_home/views/tablet/styles';
import ModalSubscription from '@app/_modules/main_home/atoms/ModalSubscription';
import Show from '@app/components/Show';

const MainHomeTabletView = ({
  bannerSlider,
  onNavigateTrackOrder,
  t,
  modalVisibility,
  refreshing,
  onRefresh,
  onSubmitSubscription,
  onCloseModal,
}) => {
  const {components} = modules.main_home;
  let sorted_components = components.sort((a, b) => a.order - b.order);

  return (
    <SafeAreaView>
      <NavBar
        type={TYPE_NAVBAR_CUSTOM}
        useLogo
        childrenRight={
          <AtomNavBarRight onNavigateTrackOrder={onNavigateTrackOrder} />
        }
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.containerScroll}>
        <Show when={GLOBAL.APP_MODAL_SUBSCRIPTION.enable}>
          <ModalSubscription
            modalVisibility={modalVisibility}
            onCloseModal={onCloseModal}
            onSubmitSubscription={onSubmitSubscription}
            fields={formSchema}
            delay={GLOBAL.APP_MODAL_SUBSCRIPTION.delay}
          />
        </Show>

        <Show when={components.length > 0}>
          {sorted_components.map((component, index) => {
            if (component.name === component_types.banner_slider) {
              return (
                <React.Fragment key={index}>
                  <BannerSlider
                    autoplay={true}
                    data={bannerSlider}
                    clickable={true}
                    styleFrame={{
                      width: Mixins.MAX_WIDTH * 0.75,
                      alignSelf: 'center',
                      flex: 1,
                    }}
                  />
                  {/* <Divider /> */}
                </React.Fragment>
              );
            } else if (component.name === component_types.category_slider) {
              return (
                <React.Fragment key={index}>
                  <CategorySlider refreshing={refreshing} />
                  <Divider />
                </React.Fragment>
              );
            } else if (component.name === component_types.product_slider) {
              return (
                <React.Fragment key={index}>
                  <ProductSlider {...component.props} refreshing={refreshing} />
                  <Divider />
                </React.Fragment>
              );
            } else if (component.name === component_types.brand_slider) {
              return (
                <React.Fragment key={index}>
                  <BrandSlider refreshing={refreshing} />
                  <Divider />
                </React.Fragment>
              );
            } else if (component.name === component_types.blog) {
              return (
                <React.Fragment key={index}>
                  <Blog refreshing={refreshing} />
                  <Divider />
                </React.Fragment>
              );
            }
          })}
        </Show>
      </ScrollView>
    </SafeAreaView>
  );
};

MainHomeTabletView.propTypes = {
  // use for displaying label from translation module
  t: PropTypes.func,
  // data in banner slider
  bannerSlider: PropTypes.any,
  // function navigate track order
  onNavigateTrackOrder: PropTypes.func,
  // state for refresh
  refreshing: PropTypes.bool,
  // function refresh
  onRefresh: PropTypes.func,
};

export default MainHomeTabletView;
