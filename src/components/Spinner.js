import React, { Component } from 'react';
import { StyleSheet, Image, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

class Spinner extends Component {
  state = {
    fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
  };

  componentDidMount() {
    this.listener = this.props.navigation.addListener('willFocus', () => {
      console.log('spinner: ' + this.props.show);
      Animated.timing(
        // Animate over time
        this.state.fadeAnim, // The animated value to drive
        {
          toValue: 1, // Animate to opacity: 1 (opaque)
          duration: 1000, // Make it take a while
          useNativeDriver: true,
        }
      ).start(); // Starts the animation
    });
  }
  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    const { fadeAnim } = this.state;
    return this.props.show ? (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Image style={styles.image} source={require('../../assets/spinner.gif')} />
      </Animated.View>
    ) : null;
  }
}
export default withNavigation(Spinner);

Spinner.defaultProps = {
  show: false,
};

Spinner.propTypes = {
  show: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '110%',
    backgroundColor: 'rgba(0,0,0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  image: {
    top: -64,
  },
});
