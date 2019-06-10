import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import PhoneInput from 'react-native-phone-input';
import { NavigationEvents } from 'react-navigation';
import RNMinimizeApp from 'react-native-minimize';
import colors from '../../constants/colors';
import Input from '../../components/Input';
import Profile from '../../../assets/icons/profile_gray.svg';
import { notEmpty, emailValidator } from '../../utils/validators';
import genderList from '../../constants/genderList';
import { updateUser } from '../../store/actions/user';
import Spinner from '../../components/Spinner';
import FloatButton from '../../components/FloatButton';
// import ModalPickerImage from '../../components/ModalPickerImage';

const validators = {
  firstName: [notEmpty],
  lastName: [notEmpty],
  emailAddress: [notEmpty, emailValidator],
  gender: [notEmpty],
};

class CreateProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidateBasicInfo: this.props.candidateBasicInfo,
      gender: null,
      errors: {},
      isLoading: false,
      phoneNumber: {
        countryPrefix: '+972',
        number: '',
      },
    };
    this.inputs = {};
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.candidateBasicInfo) {
      return {
        candidateBasicInfo: nextProps.candidateBasicInfo,
      };
    }

    return null;
  }
  willFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

  willBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    const fromAuth = this.props.navigation.getParam('fromAuth');
    if (fromAuth) {
      RNMinimizeApp.minimizeApp();
      return true;
    }
  };

  focusTheField = id => {
    this.inputs[id].focus();
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  goNext = async () => {
    const { firstName, lastName, emailAddress } = this.state.candidateBasicInfo;
    const { gender, phoneNumber } = this.state;
    const isValid = this.isValid(true);
    if (isValid) {
      await this.setState({
        ...this.state,
        isLoading: true,
      });
      const data = {
        firstName,
        lastName,
        emailAddress,
        gender,
      };

      if (phoneNumber && phoneNumber.countryPrefix.length > 0 && phoneNumber.number.length > 0) {
        data.phoneNumber = phoneNumber;
      }
      const res = await this.props.update(data);

      if (res) {
        this.props.navigation.navigate('EmailVerification');
      }
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  };

  handleChange = (value, name) => {
    this.setState({
      ...this.state,
      candidateBasicInfo: {
        ...this.state.candidateBasicInfo,
        [name]: value,
      },
    });
  };

  handleChangePhone = (value, name) => {
    this.setState({
      ...this.state,
      phoneNumber: {
        ...this.state.phoneNumber,
        [name]: value,
      },
    });
  };

  handleChangeSelect = value => {
    this.setState(
      {
        ...this.state,
        gender: value,
      },
      () => {
        this.isValid();
      }
    );
  };

  isValid = (updateState = true) => {
    const { firstName, lastName, emailAddress } = this.state.candidateBasicInfo;
    const { gender } = this.state;
    const fields = { firstName, lastName, emailAddress, gender };
    let errors = {};
    for (let key in fields) {
      const validatorsList = validators[key];
      for (let index in validatorsList) {
        const result = validatorsList[index](fields[key]);
        if (result) {
          errors = {
            ...errors,
            [key]: result,
          };
        }
      }
    }

    if (updateState) {
      this.setState({
        ...this.state,
        errors,
      });
    }

    if (Object.keys(errors).length > 0) return false;

    return true;
  };

  render() {
    const { candidateBasicInfo, errors, isLoading, phoneNumber } = this.state;
    const fromAuth = this.props.navigation.getParam('fromAuth');

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.willFocus} onWillBlur={this.willBlur} />
        <Spinner show={isLoading} />
        <View style={styles.container}>
          <View style={styles.header}>
            {!fromAuth && (
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                onPress={this.goBack}>
                <Feather style={styles.icon} name="arrow-left" size={24} />
              </TouchableOpacity>
            )}
          </View>
          <KeyboardAwareScrollView>
            <View style={styles.body}>
              <View style={styles.camera}>
                {candidateBasicInfo.profilePicUrl ? (
                  <Image
                    style={styles.profile}
                    source={{ uri: candidateBasicInfo.profilePicUrl }}
                  />
                ) : (
                  <Profile height={40} width={40} />
                )}
              </View>
              <Text style={styles.headerText}>Hello there</Text>
              <Text style={styles.note}>We just want to make sure it's you</Text>
              <View style={{ flexDirection: 'row' }}>
                <Input
                  name="firstName"
                  onChangeText={this.handleChange}
                  value={candidateBasicInfo.firstName}
                  label="FIRST NAME*"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.focusTheField('lastName');
                  }}
                  error={errors.firstName}
                  onBlur={this.isValid}
                />
                <Input
                  name="lastName"
                  onChangeText={this.handleChange}
                  value={candidateBasicInfo.lastName}
                  label="LAST NAME*"
                  getRef={input => (this.inputs['lastName'] = input)}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.focusTheField('emailAddress');
                  }}
                  error={errors.lastName}
                  onBlur={this.isValid}
                />
              </View>
              <Input
                name="emailAddress"
                onChangeText={this.handleChange}
                value={candidateBasicInfo.emailAddress}
                label="EMAIL*"
                getRef={input => (this.inputs['emailAddress'] = input)}
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.focusTheField('number');
                }}
                error={errors.emailAddress}
                onBlur={this.isValid}
              />
              <Text style={styles.textLabel}>PHONE NUMBER</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <PhoneInput
                  initialCountry="il"
                  onSelectCountry={() =>
                    this.handleChangePhone(this.inputs['phone'].getValue(), 'countryPrefix')
                  }
                  ref={input => (this.inputs['phone'] = input)}
                  flagStyle={{
                    marginTop: 6,
                  }}
                  textStyle={{
                    fontFamily: 'AvertaStd-Regular',
                    width: 0,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'AvertaStd-Regular',
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.g3,
                    paddingBottom: 10,
                  }}
                />
                {/* <ModalPickerImage
                  ref={ref => {
                    this.myCountryPicker = ref;
                  }}
                  data={this.state.pickerData}
                  onChange={country => {
                    this.selectCountry(country);
                  }}
                  cancelText="Cancel"
                /> */}
                <Input
                  editable={false}
                  name="countryPrefix"
                  value={phoneNumber.countryPrefix}
                  getRef={input => (this.inputs['countryPrefix'] = input)}
                  onSubmitEditing={() => {
                    this.focusTheField('number');
                  }}
                  returnKeyType="next"
                  style={{ flex: 2, marginRight: 10 }}
                />
                <Input
                  name="number"
                  onChangeText={this.handleChangePhone}
                  value={phoneNumber.number}
                  getRef={input => (this.inputs['number'] = input)}
                  style={{ flex: 8 }}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>MY GENDER * </Text>
                <RNPickerSelect
                  placeholder={{ label: 'Choose', value: null }}
                  items={genderList}
                  onValueChange={this.handleChangeSelect}
                  style={{
                    inputIOS: {
                      width: 210,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: colors.white,
                      borderStyle: 'solid',
                      borderWidth: 0.5,
                      borderColor: errors.gender ? colors.orangeyRed : colors.g3,
                      padding: 20,
                      fontFamily: 'AvertaStd-Bold',
                      color: colors.black,
                      fontSize: 18,
                    },
                    inputAndroid: {
                      width: 210,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: colors.white,
                      borderStyle: 'solid',
                      borderWidth: 0.5,
                      borderColor: errors.gender ? colors.orangeyRed : colors.g3,
                      padding: 20,
                      fontFamily: 'AvertaStd-Bold',
                      color: colors.black,
                      fontSize: 18,
                    },
                    iconContainer: {
                      left: 165,
                      top: 17,
                      right: 12,
                    },
                    viewContainer: {
                      width: 210,
                      height: 60,
                      marginVertical: 10,
                    },
                    headlessAndroidContainer: {
                      width: 210,
                      height: 60,
                      marginVertical: 10,
                    },
                  }}
                  value={this.state.gender}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <Feather name="chevron-down" size={24} color="gray" />;
                  }}
                />
                {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <FloatButton
          disabled={!this.isValid(false)}
          style={styles.go}
          type="next"
          onPress={this.goNext}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    candidateBasicInfo: user.candidateBasicInfo,
  };
};

const mapDispatchToProps = dispatch => ({
  update: data => dispatch(updateUser(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProfileScreen);

CreateProfileScreen.defaultProps = {
  candidateBasicInfo: {},
};

CreateProfileScreen.propTypes = {
  candidateBasicInfo: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    height: 74,
  },
  icon: {
    color: colors.g1,
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  camera: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.g3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  headerText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
    marginTop: 20,
  },
  note: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    color: colors.black,
  },
  label: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
    marginTop: 20,
    marginBottom: 16,
  },
  go: {
    // bottom: 0,
  },
  error: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.orangeyRed,
  },
  textLabel: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
    height: 24,
    marginTop: 15,
  },
});
