import React, { Component } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';
import colors from '../../constants/colors';
import UserBlock from '../../components/UserBlock';
import * as key from '../../constants/skillsDescription';
import Education from '../../../assets/icons/skills/graduate.svg';
import Experience from '../../../assets/icons/skills/exp.svg';
import Superpowers from '../../../assets/icons/skills/superpowers.svg';
import Skills from '../../../assets/icons/skills/skills.svg';
import CV from '../../../assets/icons/skills/CV.svg';
import Language from '../../../assets/icons/skills/language.svg';

import LogoutModal from '../../components/LogoutModal';

import { getUserProfileInfo, getUserCV, removeCV } from '../../store/actions/user';

class UserProfileScreen extends Component {
  state = {
    isModalVisible: false,
  };

  renderOptionButtons = () => (
    <View style={styles.headerButtonWrapper}>
      {/* <TouchableOpacity hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}>
        <Feather size={24} color={colors.g1} name="share-2" style={{ paddingRight: 15 }} />
      </TouchableOpacity> */}
      <TouchableOpacity
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => {
          this.setState({ isModalVisible: true });
        }}>
        <Feather size={24} color={colors.g1} name="log-out" />
      </TouchableOpacity>
    </View>
  );

  willFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.props.getUserData();
    this.props.getCV();
  };

  onUpdateStatusAndSeekerClick = () => {};

  isProfilePresent = () => this.props.profileInfo !== undefined && this.props.profileInfo !== null;

  onLogoutComplete = () => {
    this.props.navigation.navigate('Welcome');
    this.closeModal();
  };

  goToNext = screenName => {
    this.props.navigation.navigate(screenName, {
      fromProfile: true,
    });
  };

  closeModal = () => this.setState({ isModalVisible: false });

  onOpenCVClick = () => {
    this.props.navigation.navigate('ViewCV', {
      file: this.props.cvFile,
    });
  };

  willBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    this.props.navigation.navigate('Discovery');

    return true;
  };

  render() {
    const { profileInfo, cvFile, deleteCV } = this.props;
    const profilePic = this.isProfilePresent() ? profileInfo.profilePicUrl : '';
    const firstName = this.isProfilePresent() ? profileInfo.firstName : '';
    const lastName = this.isProfilePresent() ? profileInfo.lastName : '';

    return (
      <ScrollView
        scrollEnabled
        style={{ flex: 1 }}
        contentContainerStyle={styles.wrappingScrollView}>
        <NavigationEvents onWillFocus={this.willFocus} onWillBlur={this.willBlur} />
        <View style={styles.headerUnfilled}>{this.renderOptionButtons()}</View>
        <View style={styles.userDataViewUnfilled}>
          <Image style={styles.imageUnfilled} source={{ uri: profilePic }} />
          <View style={styles.userDetailsUnfilled}>
            <Text style={styles.userNameText}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>

        <LogoutModal
          isVisible={this.state.isModalVisible}
          onComplete={this.onLogoutComplete}
          onClose={this.closeModal}
        />

        {/* WORKS */}
        <UserBlock
          data={profileInfo.degrees}
          title={key.kEDUCATION}
          description={key.kEDUCATIONDESC}
          onSkillPressed={() => this.goToNext('AddEducation')}>
          <Education width="80" height="80" />
        </UserBlock>

        <UserBlock
          data={profileInfo.workExperiences}
          title={key.kEXPERIENCE}
          description={key.kEXPERIENCEDESC}
          onSkillPressed={() => this.goToNext('AddExperience')}>
          <Experience width="80" height="80" />
        </UserBlock>

        <UserBlock
          data={[profileInfo.superPower1, profileInfo.superPower2]}
          title={key.kSUPERPOWERS}
          description={key.kSUPERPOWERSDESC}
          onSkillPressed={() => this.goToNext('SuperPowers')}>
          <Superpowers width="80" height="80" />
        </UserBlock>

        <UserBlock
          data={profileInfo.skills}
          title={key.kSKILLS}
          description={key.kSKILLSDESC}
          onSkillPressed={() => this.goToNext('AddSkillList')}>
          <Skills width="80" height="80" />
        </UserBlock>

        <UserBlock
          data={profileInfo.languageSkills}
          title={key.kLANGUAGESPEAKING}
          description={key.kLANGUAGESPEAKINGDESC}
          onSkillPressed={() => this.goToNext('AddLanguageList')}>
          <Language width="80" height="80" />
        </UserBlock>

        <UserBlock
          data={cvFile}
          title={key.kCVFILES}
          description={key.kCVFILESDESC}
          onSkillPressed={() => this.goToNext('UploadCV')}
          onItemClick={this.onOpenCVClick}
          deleteCV={deleteCV}>
          <CV width="80" height="80" />
        </UserBlock>
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  profileInfo: state.user.userProfile,
  cvFile: state.user.file,
});

const mapDispatchToProps = dispatch => ({
  getUserData: () => dispatch(getUserProfileInfo()),
  getCV: () => dispatch(getUserCV()),
  deleteCV: () => dispatch(removeCV()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileScreen);

UserProfileScreen.propTypes = {
  getUserData: PropTypes.func.isRequired,
  getCV: PropTypes.func.isRequired,
  deleteCV: PropTypes.func.isRequired,
  profileInfo: PropTypes.object.isRequired,
  cvFile: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  wrappingScrollView: {
    backgroundColor: colors.g4,
    paddingBottom: 80,
  },
  headerFilled: {
    alignSelf: 'center',
    width: '90%',
    height: 85,
    borderBottomColor: colors.g2,
    borderBottomWidth: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imageFilled: {
    width: 30,
    height: 30,
    backgroundColor: colors.g2,
    borderRadius: 15,
  },
  userNameSmallText: {
    fontSize: 16,
    fontFamily: 'AvertaStd-Bold',
    alignSelf: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  headerUnfilled: {
    width: '100%',
    height: 75,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  headerButtonWrapper: {
    flexDirection: 'row',
    paddingBottom: 15,
    marginHorizontal: 20,
  },
  userDataViewUnfilled: {
    width: '100%',
    height: 125,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUnfilled: {
    width: 80,
    height: 80,
    backgroundColor: colors.g2,
    marginLeft: 18,
    borderRadius: 40,
  },
  userDetailsUnfilled: {
    width: '100%',
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  userNameText: {
    fontSize: 24,
    fontFamily: 'AvertaStd-Bold',
  },
  userLocationText: {
    marginTop: 2,
    marginLeft: 4,
    fontSize: 15,
    color: colors.g2,
    fontFamily: 'AvertaStd-Regular',
  },
  progressBarWrapper: {
    width: '100%',
    height: 70,
    // backgroundColor: 'yellow'
  },
  progressBarText: {
    flexDirection: 'row',
    marginLeft: 18,
  },
  stepsLeftText: {
    fontSize: 13,
    color: colors.g2,
    fontFamily: 'AvertaStd-Regular',
  },
  percentageText: {
    fontSize: 20,
    // color: colors.g1,
    fontFamily: 'AvertaStd-Bold',
    paddingBottom: 5,
  },
});
