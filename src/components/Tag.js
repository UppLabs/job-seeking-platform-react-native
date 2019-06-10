import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import eventType from '../constants/eventType';

const Tag = ({ type, style }) => {
  const color = () => {
    switch (type) {
      case 0:
        return colors.marigold;
      case 1:
      case 2:
      case 7:
        return colors.purpleSecondary;
      case 3:
      case 4:
      case 8:
        return colors.deepSkyBlue;
      case 5:
        return colors.orangeyRed;
      case 6:
        return colors.aquaMarine;
      case 9:
        return colors.marigold;
      default:
        break;
    }
  };
  const text = () => {
    return eventType[type];
  };

  return (
    <View style={[styles.container, { backgroundColor: color() }, style]}>
      <Text style={styles.label}>{text()}</Text>
    </View>
  );
};

export default Tag;

Tag.propTypes = {
  type: PropTypes.number,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    width: 109,
    height: 24,
    borderRadius: 20,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  label: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 12,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    ...Platform.select({ ios: { top: 2 } }),
  },
});
