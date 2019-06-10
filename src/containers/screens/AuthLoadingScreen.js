import React, { Component } from 'react';
import { Platform, View, Dimensions } from 'react-native';
import Image from 'react-native-scalable-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleSignin } from 'react-native-google-signin';
import { AccessToken } from 'react-native-fbsdk';
import { logIn, resetAll } from '../../store/actions/user';
import socialNetwork from '../../store/constants/socialNetwork';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const { session, navigation, logInUser, reset } = this.props;
    let isNotExpired = true;
    let data = null;
    let token = session && session.token;
    if (session) {
      const socialType = session.socialType;
      if (socialType === socialNetwork.Google) {
        let config = {
          scopes: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ],
        };
        if (Platform.OS === 'android') {
          config.webClientId = '';
        }
        try {
          GoogleSignin.configure(config);
          const { idToken } = await GoogleSignin.signInSilently();
          token = idToken;
          isNotExpired = true;
        } catch (error) {
          isNotExpired = false;
        }
        console.log('Google', isNotExpired);
      }
      if (socialType === socialNetwork.Facebook) {
        isNotExpired = await AccessToken.getCurrentAccessToken();
        console.log('Facebook', isNotExpired);
      }
      if (socialType === socialNetwork.Linkedin) {
        const { expirationDate } = session;
        isNotExpired = expirationDate > new Date().getTime();
        console.log('LinkedIn', isNotExpired);
      }
      console.log('isNotExpired', isNotExpired);
      if (isNotExpired) {
        data = await logInUser(token, socialType);
        if (data.emailVerified) {
          navigation.navigate('Discovery');
        } else {
          navigation.navigate('CreateProfile', {
            fromAuth: true,
          });
        }
      } else {
        reset();
        navigation.navigate('Welcome');
      }
    } else {
      navigation.navigate('Welcome');
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          width={Dimensions.get('window').width}
          source={require('../../../assets/splash.png')}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { session } = user;

  return {
    session,
  };
};

const mapDispatchToProps = dispatch => ({
  logInUser: (token, socialNetwork) => dispatch(logIn(token, socialNetwork)),
  reset: () => dispatch(resetAll()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);

AuthLoadingScreen.defaultProps = {
  session: null,
};

AuthLoadingScreen.propTypes = {
  session: PropTypes.object,
  logInUser: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};
