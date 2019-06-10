import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../constants/colors';
import Logo from '../../../assets/logo.svg';
import Background from '../../../assets/background.svg';
import Button from '../../components/Button';

class WelcomeScreen extends React.Component {
  goToDiscovery = () => {
    const { navigation } = this.props;
    navigation.navigate('Discovery');
  };
  render() {
    return (
      <View style={styles.container}>
        <Background width={'100%'} height={'100%'} style={styles.background} />
        <Logo width={74.5} height={68.4} />
        <Text style={[styles.text, styles.textWelcome]}>Welcome To</Text>
        <Text style={[styles.text, styles.textBold]}>Jooblix</Text>
        <Text style={styles.textDescription}>Find job opportunities hidden in your community</Text>
        <Button style={styles.button} title="Get Started" onPress={this.goToDiscovery} />
        {/* <TouchableOpacity hitSlop={{ top: 5, left: 20, bottom: 5, right: 20 }}>
          <Text style={styles.link}>I have an account already</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

export default WelcomeScreen;

WelcomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  button: {
    width: '90%',
  },
  background: {
    position: 'absolute',
    zIndex: -1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWelcome: {
    paddingTop: 20,
  },
  textDescription: {
    height: 70,
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
    paddingTop: 20,
    marginBottom: 64,
  },
  text: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 30,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  textBold: {
    fontFamily: 'AvertaStd-Bold',
  },
  link: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
    textDecorationLine: 'underline',
    marginTop: 26,
  },
});
