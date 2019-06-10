import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

const Button = ({ onPress, title, style, disabled, textStyle, iconRight }) => (
  <TouchableOpacity
    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
    disabled={disabled}
    onPress={onPress}
    style={[styles.button, style, disabled ? styles.disabled : null]}>
    {title ? <Text style={[styles.buttonText, textStyle]}>{title}</Text> : null}
    {iconRight}
  </TouchableOpacity>
);

export default Button;

Button.defaultProps = {
  style: {},
  disabled: false,
  textStyle: {},
  iconRight: null,
  title: null,
};

Button.propTypes = {
  title: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconRight: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.white,
    ...Platform.select({ ios: { top: 3 } }),
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.aquaMarine,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  disabled: {
    backgroundColor: colors.g3,
  },
});
