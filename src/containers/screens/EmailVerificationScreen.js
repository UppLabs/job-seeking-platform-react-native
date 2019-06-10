import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Layout from '../Layout';
import Email from '../../../assets/icons/EmailOne.svg';
import colors from '../../constants/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { verifyEmail, resendEmail } from '../../store/actions/user';
import screens from '../../constants/screens';

const { height } = Dimensions.get('window');
class EmailVerificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      isError: false,
    };
  }

  handleChange = value => {
    this.setState({
      ...this.state,
      code: value,
    });
  };

  joinNow = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
    });
    const status = await this.props.verify(this.state.code);
    this.setState({
      ...this.state,
      isLoading: false,
      isError: false,
    });

    if (status === 204) {
      this.props.navigation.navigate('MyExpertise');
    } else if (status === 200) {
      this.props.navigation.navigate('Event');
    } else {
      this.setState({
        ...this.state,
        isError: true,
      });
    }
  };

  resend = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
    });
    await this.props.resendEmail();
    this.setState({
      ...this.state,
      isLoading: false,
    });
  };

  render() {
    return (
      <ScrollView>
        <Layout showSpinner={this.state.isLoading} navigation={this.props.navigation}>
          <View style={styles.body}>
            <Email width="80" height="80" />
            <Text style={styles.header}>Enter verification code</Text>
            <Text style={styles.note}>
              We sent you a 4-digits code to verify your email address, please type it
            </Text>
            <Input
              returnKeyType="done"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={this.handleChange}
              value={this.state.code}
              maxLength={4}
              inputStyle={{
                fontSize: 30,
                height: 55,
                width: 80,
              }}
              onSubmitEditing={this.joinNow}
              error={this.state.isError ? 'Incorrect code' : null}
            />
            <View style={{ marginTop: 47 }}>
              <Text style={styles.recendText}>I didn’t receive a code</Text>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                onPress={this.resend}>
                <Text
                  style={[
                    styles.recendText,
                    {
                      color: colors.aquaMarine,
                    },
                  ]}>
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.code.length < 4 ? null : (
              <Button onPress={this.joinNow} style={styles.button} title="Join now!" />
            )}
          </View>
        </Layout>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ events }, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  verify: code => dispatch(verifyEmail(code)),
  resendEmail: () => dispatch(resendEmail()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailVerificationScreen);

EmailVerificationScreen.propTypes = {
  navigation: PropTypes.object,
  verify: PropTypes.func.isRequired,
  resendEmail: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 39,
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  note: {
    marginTop: 10,
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  input: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recendText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  button: {
    marginTop: height > screens.ios.fiveS.height ? 60 : 0,
  },
});
