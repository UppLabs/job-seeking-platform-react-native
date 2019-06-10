import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }

  onFocus = () => {
    this.props.onFocus && this.props.onFocus();
    this.setState({
      focus: true,
    });
  };

  onBlur = () => {
    this.props.onBlur && this.props.onBlur();
    this.setState({
      focus: false,
    });
  };

  render() {
    const {
      onChangeText,
      value,
      inputStyle,
      label,
      error,
      style,
      getRef,
      placeholder,
    } = this.props;
    const { focus } = this.state;
    return (
      <View style={[styles.container, style]}>
        {label && <Text style={styles.label}>{focus || value ? label : null}</Text>}
        <TextInput
          {...this.props}
          style={[
            styles.input,
            inputStyle,
            focus ? styles.active : null,
            error ? { borderBottomColor: colors.orangeyRed } : null,
          ]}
          onChangeText={value => (onChangeText ? onChangeText(value, this.props.name) : null)}
          value={value}
          placeholder={placeholder ? placeholder : !focus ? label : null}
          selectionColor={colors.aquaMarine}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={getRef}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }
}

export default Input;

Input.defaultProps = {
  inputStyle: undefined,
  placeholder: null,
  style: {},
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onChange: PropTypes.func,
  inputStyle: PropTypes.object,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  style: PropTypes.object,
  getRef: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
    height: 24,
    marginTop: 15,
  },
  error: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.orangeyRed,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.g3,
    height: 40,
  },
  active: {
    borderBottomColor: colors.aquaMarine,
    borderBottomWidth: 2,
  },
  errorBorder: {
    borderBottomColor: colors.orangeyRed,
    borderBottomWidth: 1,
  },
});
