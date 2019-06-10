import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constants/colors';

const Checkbox = ({ name, checked, onChange, additionaStyles }) => (
  <TouchableOpacity
    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
    disabled={!onChange}
    style={[
      styles.container,
      checked ? styles.checked : styles.unchecked,
      additionaStyles !== undefined ? additionaStyles : {},
    ]}
    onPress={() => onChange(name, !checked)}>
    {checked ? <Feather name="check" size={20} color={colors.white} /> : null}
  </TouchableOpacity>
);

export default Checkbox;

Checkbox.defaultProps = {
  name: undefined,
  onChange: undefined,
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 3,
    width: 24,
    height: 24,
  },
  checked: {
    backgroundColor: colors.aquaMarine,
    borderColor: colors.aquaMarine,
  },
  unchecked: {
    borderColor: colors.g2,
  },
});
