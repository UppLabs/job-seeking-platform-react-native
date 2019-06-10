import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import Notification from '../components/Notification';
import colors from '../constants/colors';
import Spinner from '../components/Spinner';
import notificationEnum from '../constants/notificationEnum';

const Layout = ({
  style,
  headerStyle,
  headerChildren,
  headerComponent,
  children,
  notificationAnimationType,
  navigation,
  backButton,
  showSpinner,
  notificationTitle,
  notificationText,
}) => {
  const goBack = () => {
    if (onBackPressCallback !== undefined) {
      onBackPressCallback();
    }
    navigation.goBack();
  };
  return (
    <View style={[{ flex: 1 }, style]}>
      <Spinner show={showSpinner} />
      {notification && (
        <Notification
          notificationAnimationHeight={notificationAnimationHeight}
          notificationAnimationComplete={notificationAnimationComplete}
          animation={notificationAnimation}
          notificationAnimationType={notificationAnimationType}
          title={notificationTitle}
          text={notificationText}
          textStyle={notificationTextStyle}
          containerStyle={notificationContainerStyle}
        />
      )}
      {headerComponent ? (
        headerComponent
      ) : (
        <View style={[styles.header, headerStyle]}>
          {backButton ? (
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={styles.back}
              onPress={goBack}>
              <Feather style={styles.icon} name="arrow-left" size={24} />
            </TouchableOpacity>
          ) : null}
          {headerChildren ? headerChildren : null}
        </View>
      )}
      {replaceBody ? children : <View style={[styles.body, bodyStyle]}>{children}</View>}
    </View>
  );
};

export default withNavigation(Layout);

Layout.defaultProps = {
  navigation: undefined,
  backButton: true,
  style: {},
  headerStyle: {},
  showSpinner: false,
  notificationTitle: undefined,
  notificationText: undefined,
  notificationAnimationType: notificationEnum.notSet,
  bodyStyle: {},
  replaceBody: false,
  onBackPressCallback: undefined,
  notification: false,
  notificationAnimation: false,
  notificationAnimationComplete: undefined,
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.node,
  ]),
  headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  navigation: PropTypes.object,
  headerChildren: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  headerStyle: PropTypes.object,
  style: PropTypes.object,
  showSpinner: PropTypes.bool,
  notificationTitle: PropTypes.string,
  notificationText: PropTypes.string,
  notificationAnimationType: PropTypes.string,
  notificationAnimationHeight: PropTypes.number,
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? 43 : 32,
    paddingHorizontal: 15,
  },
  icon: {
    color: colors.g1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 15,
  },
  back: {
    width: 24,
  },
});
