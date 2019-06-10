import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import PropTypes from 'prop-types';
import HeaderForTextSkill from './HeaderTextForSkill';
import colors from '../constants/colors';
import * as keys from '../constants/skillsDescription';
import SkillDetailSubItem from './SkillDetailSubItem';
import DeleteCVModal from './DeleteSkillModal';
import Education from '../../assets/icons/skills/graduate.svg';
import Experience from '../../assets/icons/skills/exp.svg';

import SkillLevel from './SkillLevel';
import * as userKeys from '../constants/users';
import BigTag from '../components/BigTag';

class UserBlock extends Component {
  state = {
    isModalVisible: false,
    shouldUpdateResponder: false,
    cvName: '',
  };

  renderBlock = () => {
    const { title } = this.props;

    switch (title) {
      case keys.kEDUCATION:
        return this.renderSectionDetailForEducation();
      case keys.kEXPERIENCE:
        return this.renderSectionDetailForExperience();
      case keys.kSKILLS:
        return this.renderButtonSkillWithRating();
      case keys.kLANGUAGESPEAKING:
        return this.renderButtonLanguageWithRating();
      case keys.kSTATUSANDSEEKER:
        return this.renderButtonSkillTexts();
      case keys.kSUPERPOWERS:
        return this.renderSuperpowers();
      default:
        return this.renderCVAttachement();
    }
  };

  renderButtonSkillWithRating = () => {
    const { data: skills } = this.props;
    const skillSet = [];
    for (let i = 0; i < skills.length; i++) {
      skillSet.push(
        <View style={[styles.levelSkillsSet]} key={i}>
          <View style={styles.levelSkillSetTextWrapper}>
            <Text style={styles.userSkillText}>{skills[i].name}</Text>
          </View>
          {/* <SkillLevel fillLevel={skills[i].numberOfYears} /> */}
        </View>
      );
    }

    return <View style={styles.levelSkillSetContainer}>{skillSet}</View>;
  };

  renderButtonLanguageWithRating = () => {
    const { data: languageSkills } = this.props;
    const skillSet = [];

    for (let i = 0; i < languageSkills.length; i++) {
      skillSet.push(
        <View style={styles.levelSkillsSet} key={i}>
          <View style={styles.levelSkillSetTextWrapper}>
            <Text style={styles.userSkillText}>{languageSkills[i].language}</Text>
          </View>
          <SkillLevel fillLevel={languageSkills[i].proficiencyLevel} />
        </View>
      );
    }

    return <View style={styles.levelSkillSetContainer}>{skillSet}</View>;
  };

  renderSuperpowers = () => {
    const { data } = this.props;
    const skillSet = [];

    for (let superpower of data) {
      superpower &&
        skillSet.push(
          <BigTag
            style={{ flex: 1, justifyContent: 'center' }}
            key={superpower}
            title={superpower.toUpperCase()}
            active
            icon={false}
          />
        );
    }

    return <View style={styles.skillsFilledContainer}>{skillSet}</View>;
  };

  renderButtonSkillTexts = () => {
    const skillSet = [];
    const allColors = [colors.purpleSecondary, colors.white, colors.aquaMarine];
    const allText = ['Student', 'Full-time Job', 'Part-time job'];

    for (let i = 0; i < this.props.profileInfo.seekerMode; i++) {
      let color = allColors[Math.floor(Math.random() * allColors.length)];
      let text = allText[Math.floor(Math.random() * allText.length)];
      skillSet.push(
        <View
          style={{
            ...styles.userSkillTextWrapper,
            minWidth: '20%',
            maxWidth: '75%',
            backgroundColor: color,
          }}
          key={i}>
          <Text
            style={{
              ...styles.userSkillText,
              color: color == colors.white ? 'black' : 'white',
            }}>
            {text}
          </Text>
        </View>
      );
    }

    return <View style={styles.skillsFilledContainer}>{skillSet}</View>;
  };

  renderCVAttachement = () => {
    return (
      <View style={{ justifyContent: 'flex-start', flexDirection: 'row', marginHorizontal: 15 }}>
        <TouchableOpacity
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          style={{ marginTop: 10 }}
          onPress={this.props.onItemClick}>
          <View style={styles.cvContainer}>
            <View style={styles.cvNameContainer}>
              <View style={{ marginTop: 3, flex: 9 }}>
                <Text style={styles.cvText}>CV.pdf</Text>
              </View>
              <TouchableOpacity
                style={{ flex: 1 }}
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                onPress={this.showModal}>
                <Feather name="x" size={19} color={colors.g2} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <DeleteCVModal
          onClose={this.closeModal}
          onDelete={this.onDeleteUserCV}
          isVisible={this.state.isModalVisible}
          title={this.state.cvName}
        />
      </View>
    );
  };

  showModal = () => this.setState(prevState => ({ ...prevState, isModalVisible: true }));
  closeModal = () => this.setState(prevState => ({ ...prevState, isModalVisible: false }));
  onDeleteUserCV = () => {
    this.closeModal();
    this.props.deleteCV();
  };

  renderSectionDetailForExperience = () => {
    const { data: workExperiences } = this.props;
    const skillItems = [];
    const sectionImage = <Experience width="80" height="80" />;

    if (workExperiences !== null) {
      for (let i = 0; i < workExperiences.length; i++) {
        let experience = '';

        if (workExperiences[i].stillWorkThere) {
          experience = `${moment(workExperiences[i].startDate).format('DD MMM, YYYY')} - CURRENT`;
        } else {
          experience = `${moment(workExperiences[i].startDate).format('DD MMM, YYYY')} - ${moment(
            workExperiences[i].endDate
          ).format('DD MMM, YYYY')}`;
        }
        skillItems.push(
          <SkillDetailSubItem
            id={workExperiences[i].id}
            title={experience}
            position={workExperiences[i].title}
            details={workExperiences[i].description}
            skillType={userKeys.WORK_EXPERIENCES}
            // onDelete
            key={i}>
            {sectionImage}
          </SkillDetailSubItem>
        );
      }

      return skillItems;
    }

    return null;
  };

  renderSectionDetailForEducation = () => {
    const { data } = this.props;
    const skillItems = [];
    const sectionImage = <Education width="80" height="80" />;

    for (let i = 0; i < data.length; i++) {
      skillItems.push(
        <SkillDetailSubItem
          id={data[i].id}
          title={'Student'}
          position={data[i].instituteName}
          details={data[i].facultyName}
          skillType={userKeys.DEGRESS}
          key={i}>
          {sectionImage}
        </SkillDetailSubItem>
      );
    }
    return skillItems;
  };

  isEmpty = () => {
    const { data } = this.props;
    if (!data) return true;

    if (typeof data === 'string' && data.length > 0) return false;

    if (data.length > 0 && data.some(x => x)) return false;

    return true;
  };

  isCVIcon = () => {
    const { title, data } = this.props;
    if (title === keys.kCVFILES && data) {
      return false;
    }
    return true;
  };

  render() {
    const { title, onSkillPressed, description, children } = this.props;
    return (
      <View style={styles.container}>
        <HeaderForTextSkill
          skillTitle={title}
          onAddSkillClick={onSkillPressed}
          isIcon={this.isCVIcon()}
        />

        {this.isEmpty() ? (
          <View style={styles.skillContainerUnfilled}>
            <>
              {children}
              <View style={styles.skillDescriptionContainer}>
                <Text style={styles.skillDescriptionText}>{description}</Text>
              </View>
            </>
          </View>
        ) : (
          this.renderBlock()
        )}
      </View>
    );
  }
}

export default UserBlock;

UserBlock.defaultProps = {
  data: null,
  description: '',
  deleteCV: undefined,
};

UserBlock.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  title: PropTypes.string.isRequired,
  onSkillPressed: PropTypes.func.isRequired,
  description: PropTypes.string,
  deleteCV: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 15,
  },
  skillContainerUnfilled: {
    alignSelf: 'center',
    marginTop: 3,
    width: '90%',
    height: 80,
    flexDirection: 'row',
    // backgroundColor: 'gray',
  },
  skillSmallPicture: {
    width: 50,
    height: 50,
    backgroundColor: 'yellow',
  },
  skillBigPicture: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  skillDescriptionContainer: {
    marginVertical: 10,
    width: '75%',
  },
  skillDescriptionText: {
    color: colors.g2,
    fontFamily: 'AvertaStd-Regular',
  },
  skillsFilledContainer: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 15,
    minHeight: 50,
    // maxHeight: 300,
    flexWrap: 'wrap',
  },
  userSkillTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    alignSelf: 'center',
    borderRadius: 15,
    margin: 5,
  },
  userSkillText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontFamily: 'AvertaStd-Regular',
  },
  cvContainer: {
    marginTop: 5,
    marginLeft: 5,
  },
  cvNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 10,
    minWidth: 100,
  },
  cvText: {
    textAlign: 'center',
    color: 'black',
    fontFamily: 'AvertaStd-Thin',
    fontSize: 16,
  },
  levelSkillSetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    minHeight: 50,
    // maxHeight: 300,
    marginTop: 15,
    alignSelf: 'center',
  },
  levelSkillsSet: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 40,
    margin: 5,
    justifyContent: 'center',
    borderRadius: 10,
  },
  levelSkillSetTextWrapper: {
    height: '100%',
    justifyContent: 'center',
    marginVertical: 2,
  },
});
