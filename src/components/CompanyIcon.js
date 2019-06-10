import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

const CompanyIcon = ({ style, logoUrl, onPress }) => (
  <TouchableOpacity style={[styles.container, style]} disabled={!onPress} onPress={onPress}>
    {logoUrl && <Image height={50} source={{ uri: logoUrl }} />}
  </TouchableOpacity>
);

export default CompanyIcon;

CompanyIcon.defaultProps = {
  style: {},
  logoUrl: null,
  onPress: undefined,
};

CompanyIcon.propTypes = {
  style: PropTypes.object,
  logoUrl: PropTypes.string,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: 51,
    height: 51,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.g3,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
