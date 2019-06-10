import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constants/colors';

const FloatButton = ({ children, disabled, style, onPress, type }) => {
  const byType = () => {
    switch (type) {
      case 'next':
        return <Feather style={styles.icon} name="arrow-right" size={24} />;
      case 'done':
        return (
          <View style={[{ flexDirection: 'row' }, style]}>
            <Text style={styles.doneText}>Done</Text>
            <Feather style={styles.doneIcon} name="check" size={24} />
          </View>
        );
      case 'confirm':
        return <Text style={styles.confirmText}>Confirm</Text>;
      case 'apply':
        return <Text style={styles.applyText}>Apply</Text>;
      case 'applied':
        return (
          <View style={styles.applied}>
            <Feather style={styles.appliedIcon} name="check" size={24} />
            <Text style={styles.appliedText}>Applied</Text>
          </View>
        );
      default:
        break;
    }

    return null;
  };
  return (
    <TouchableOpacity
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      disabled={disabled || type === 'applied'}
      onPress={onPress}
      style={[
        styles.container,
        style,
        disabled ? styles.disabled : null,
        type ? styles[type] : null,
      ]}>
      {children ? children : byType()}
    </TouchableOpacity>
  );
};

export default FloatButton;

FloatButton.defaultProps = {
  disabled: false,
  style: null,
  onPress: undefined,
};

FloatButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
  type: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 49,
    right: 15,
    backgroundColor: colors.aquaMarine,
    justifyContent: 'center',
    alignContent: 'center',
  },
  disabled: {
    backgroundColor: colors.g3,
  },
  icon: {
    color: colors.white,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  next: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
  },
  done: {
    width: 140,
    height: 60,
    borderRadius: 30,
  },
  doneText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.white,
    flex: 1,
    ...Platform.select({ ios: { top: 3 } }),
  },
  doneIcon: {
    color: colors.white,
    paddingLeft: 5,
    paddingRight: 18,
  },
  confirm: {
    height: 60,
    borderRadius: 30,
    width: '100%',
  },
  confirmText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.white,
  },
  apply: {
    width: 117,
    height: 40,
    borderRadius: 20,
  },
  applyText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.white,
  },
  applied: {
    width: 133,
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.g2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appliedIcon: {
    color: colors.white,
  },
  appliedText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.white,
    marginLeft: 10,
  },
});
