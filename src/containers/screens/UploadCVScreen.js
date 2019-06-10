import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Feather from 'react-native-vector-icons/Feather';
import GestureRecognizer from 'react-native-swipe-gestures';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../Layout';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import FloatButton from '../../components/FloatButton';
import { setUserFile, setUserCV } from '../../store/actions/user';
import CongratulationsPopup from '../../components/CongratulationsPopup';
import notificationEnum from '../../constants/notificationEnum';

const { height } = Dimensions.get('window');

class UploadCVScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: notificationEnum.notSet,
      file: props.file,
      isLoading: false,
      isModal: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.file != nextProps.file) {
      return {
        file: nextProps.file,
      };
    }

    return null;
  }

  skip = () => {
    this.setState({
      isModal: true,
    });
  };

  uploadFile = () => {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.pdf()],
      },
      (error, res) => {
        console.log(error, res);
        if (res) {
          // kb
          if (res.fileSize / 1024 > 16384) {
            this.setState({
              isShow: notificationEnum.show,
            });
          } else {
            this.props.navigation.navigate('ViewCV', {
              file: res,
            });
          }
        }
      }
    );
  };

  removeFile = () => {
    this.props.setFile(null);
  };

  onSwipeUp = () => {
    if (this.state.isShow === notificationEnum.show) {
      this.setState({
        isShow: notificationEnum.hide,
      });
    }
  };

  next = async () => {
    const { navigation, setCV } = this.props;
    const fromProfile = navigation.getParam('fromProfile');

    this.setState({
      isLoading: true,
    });
    await setCV();
    this.setState({
      isLoading: false,
    });

    if (fromProfile) {
      navigation.goBack();
    } else {
      this.setState({
        isModal: true,
      });
    }
  };

  closeModal = () => {
    this.setState({
      isModal: false,
    });
  };

  backToTheEvent = () => {
    this.props.navigation.navigate('Event');
  };

  goToProfile = () => {
    this.props.navigation.navigate('UserProfile');
  };

  openEmail = () => {
    Linking.openURL('mailto:support@mail.com?subject=I have problem uploading my CV');
  };

  notificationAnimationComplete = () => {
    if (this.state.isShow === notificationEnum.hide) {
      this.setState({
        isShow: notificationEnum.notSet,
      });
    }
  };

  render() {
    const { isShow, file, isModal, isLoading } = this.state;
    const { navigation } = this.props;
    const fromProfile = navigation.getParam('fromProfile');

    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <GestureRecognizer
          onSwipeUp={this.onSwipeUp}
          style={{
            flex: 1,
          }}>
          <CongratulationsPopup
            backToTheEvent={this.backToTheEvent}
            isVisible={isModal}
            onClose={this.closeModal}
            goToProfile={this.goToProfile}
          />
          <Layout
            notificationAnimationHeight={140}
            notificationAnimationComplete={this.notificationAnimationComplete}
            notificationAnimation
            notification={isShow !== notificationEnum.notSet}
            showSpinner={isLoading}
            notificationAnimationType={isShow}
            notificationTitle="Your file is too heavy"
            notificationText="Please choose a pdf file that is max. 16MB"
            notificationTextStyle={{ color: colors.marigold }}
            notificationContainerStyle={{ backgroundColor: '#fff4cb' }}
            headerStyle={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
            }}
            headerChildren={
              <View style={styles.header}>
                {!fromProfile && (
                  <TouchableOpacity
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    onPress={this.skip}>
                    <Text style={styles.skip}>Skip</Text>
                  </TouchableOpacity>
                )}
              </View>
            }>
            <Image style={styles.image} source={require('../../../assets/artwork.png')} />
            <Text style={styles.text}>WE SUPPORT PDF FILES ONLY, UP TO 16MB</Text>
            <Text style={styles.headerText}>Share your resume</Text>
            {!file ? (
              <Button
                onPress={this.uploadFile}
                style={styles.button}
                title="Upload your resume"
                iconRight={<Feather name="arrow-up" size={24} color={colors.white} />}
              />
            ) : (
              <Button
                onPress={this.removeFile}
                textStyle={[styles.buttonText, { flex: 9 }]}
                style={styles.removeButton}
                title={file.fileName}
                iconRight={
                  <Feather
                    style={file.fileName ? { flex: 1, paddingRight: 10 } : ''}
                    name="trash-2"
                    size={24}
                    color={colors.orangeyRed}
                  />
                }
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: height >= 667 ? 189 : 120,
              }}>
              <View
                style={{
                  bottom: 34,
                }}>
                <Text
                  style={{
                    color: colors.g1,
                    flexWrap: 'wrap',
                  }}>
                  Need help to upload?
                </Text>
                <TouchableOpacity
                  hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                  onPress={this.openEmail}>
                  <Text
                    style={{
                      color: colors.g1,
                      textDecorationLine: 'underline',
                    }}>
                    contact the support
                  </Text>
                </TouchableOpacity>
              </View>
              <FloatButton
                disabled={!file}
                style={{
                  position: 'relative',
                }}
                type="done"
                onPress={this.next}
              />
            </View>
          </Layout>
        </GestureRecognizer>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { file } = user;
  return {
    file,
  };
};

const mapDispatchToProps = dispatch => ({
  setFile: file => dispatch(setUserFile(file)),
  setCV: () => dispatch(setUserCV()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadCVScreen);

UploadCVScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  file: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setFile: PropTypes.func.isRequired,
  setCV: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skip: {
    textDecorationLine: 'underline',
    ...Platform.select({ ios: { top: 3 } }),
  },
  image: {
    width: 170,
    height: 195,
    alignSelf: 'flex-end',
  },
  text: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
  },
  headerText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
    marginTop: 5,
  },
  button: {
    marginTop: 33,
    width: '90%',
    alignSelf: 'center',
  },
  removeButton: {
    marginTop: 33,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: colors.g3,
  },
  buttonText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    letterSpacing: 0,
    color: colors.black,
  },
});
