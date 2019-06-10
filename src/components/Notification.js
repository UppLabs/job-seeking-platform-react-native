import React, { Component } from 'react';
import { Text, StyleSheet, Animated, Platform } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import notificationEnum from '../constants/notificationEnum';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.animation) {
      if (nextProps.notificationAnimationType !== prevState.notificationAnimationType) {
        const value =
          Platform.OS === 'ios'
            ? -nextProps.notificationAnimationHeight - 12
            : -nextProps.notificationAnimationHeight - 5;
        const from =
          nextProps.notificationAnimationType === notificationEnum.hide
            ? new Animated.Value(0)
            : new Animated.Value(value);
        const to = nextProps.notificationAnimationType === notificationEnum.hide ? value : 0;
        Animated.timing(from, {
          toValue: to,
          duration: 1200,
        }).start(
          () => nextProps.notificationAnimationComplete && nextProps.notificationAnimationComplete()
        );
        return {
          from,
          notificationAnimationType: nextProps.notificationAnimationType,
        };
      }
      return null;
    }
    return null;
  }

  render() {
    const { title, text, textStyle, containerStyle, animation } = this.props;

    return (
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          animation
            ? {
                marginTop: this.state.from,
              }
            : {},
        ]}>
        <Text style={[styles.title, textStyle]}>{title}</Text>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </Animated.View>
    );
  }
}

export default Notification;

Notification.defaultProps = {
  textStyle: {},
  containerStyle: {},
  notificationAnimationType: notificationEnum.notSet,
  notificationAnimationComplete: undefined,
};

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  textStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  notificationAnimationType: PropTypes.string,
  animation: PropTypes.bool,
  notificationAnimationComplete: PropTypes.func,
  notificationAnimationHeight: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.purpleSecondary,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  title: {
    marginTop: 64,
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.white,
  },
  text: {
    marginTop: 5,
    marginBottom: 21,
    fontFamily: 'AvertaStd-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.white,
  },
});
