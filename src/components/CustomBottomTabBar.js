import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import colors from '../constants/colors';

export default class CustomBottomTabbar extends Component {
  navigationStateIndex = null;

  state = {
    y: new Animated.Value(200),
  };
  componentDidMount() {
    this.slide();
  }

  slide = () => {
    Animated.timing(this.state.y, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  renderTabbarButton = (route, index) => {
    const { navigation, getLabelText, renderIcon } = this.props;
    const currentIndex = navigation.state.index;
    const color = currentIndex === index ? colors.deepSkyBlue : colors.g2;
    let label = getLabelText({ route, focused: currentIndex === index, index });

    const screen = route.routeName === 'Root' ? 'Discovery' : route;
    label = route.routeName === 'Root' ? 'Discovery' : label;
    return (
      <TouchableOpacity
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => {
          if (currentIndex !== index) {
            navigation.navigate(screen);
          }
        }}
        style={styles.button}
        key={route.routeName}>
        {renderIcon({
          route,
          tintColor: colors.deepSkyBlue,
          focused: currentIndex === index,
          index,
        })}
        <Text style={[styles.buttonsText, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const tabbarButtons = this.props.navigation.state.routes.map(
      this.renderTabbarButton.bind(this)
    );

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: this.state.y,
              },
            ],
          },
        ]}>
        <View style={styles.buttonsWrapper}>{tabbarButtons}</View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    backgroundColor: colors.g4,
    position: 'absolute',
    bottom: 0,
  },
  buttonsWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.g4,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    width: '28%',
    height: 50,
    marginHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsText: {
    marginTop: 3,
    fontSize: 14,
    fontFamily: 'AvertaStd-Bold',
  },
});
