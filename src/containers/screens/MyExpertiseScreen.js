import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import Feather from 'react-native-vector-icons/Feather';
import Layout from '../Layout';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import BackgroundItem from '../../components/BackgroundItem';
import FloatButton from '../../components/FloatButton';
import { clearExpertise } from '../../store/actions/user';

class MyExpertiseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goToAddEducation = () => {
    this.props.navigation.navigate('AddEducation');
  };

  goToAddExperience = () => {
    this.props.navigation.navigate('AddExperience');
  };

  skip = () => {
    this.props.clearAllExpertise();
    this.props.navigation.navigate('SuperPowers');
  };

  goNext = () => {
    this.props.navigation.navigate('SuperPowers');
  };

  willFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

  willBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    this.props.navigation.navigate('Event');

    return true;
  };

  render() {
    const { expertise } = this.props;
    return (
      <Layout
        backButton={false}
        headerChildren={
          <View style={styles.header}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={this.skip}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>
          </View>
        }>
        <NavigationEvents onWillFocus={this.willFocus} onWillBlur={this.willBlur} />
        <View style={styles.topBody}>
          <Text style={styles.topHeaderText}>Tell us what you've got</Text>
          <Text>The more expertise you add, your chances to get hired are higher!</Text>
          <Button
            style={styles.buttonEducation}
            title="+ Add a Education"
            onPress={this.goToAddEducation}
          />
          <Button
            style={styles.buttonExperience}
            title="+ Add a Experience"
            onPress={this.goToAddExperience}
          />
        </View>
        <View style={styles.buttonBody}>
          <Text>MY BACKGROUND</Text>
          <ScrollView>
            {expertise.map((item, i) => (
              <BackgroundItem item={item} key={i} />
            ))}
          </ScrollView>
        </View>
        <FloatButton
          onPress={this.goNext}
          style={styles.floatButton}
          disabled={expertise.length <= 0}>
          <Feather style={styles.icon} name="arrow-right" size={24} />
        </FloatButton>
      </Layout>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { expertise } = user;
  return {
    expertise,
  };
};

const mapDispatchToProps = dispatch => ({
  clearAllExpertise: () => dispatch(clearExpertise()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyExpertiseScreen);

MyExpertiseScreen.defaultProps = {
  expertise: [],
};
MyExpertiseScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  expertise: PropTypes.array,
  clearAllExpertise: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  icon: {
    color: colors.white,
    alignSelf: 'center',
  },
  skip: {
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  topHeaderText: {
    marginTop: 25,
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
  },
  text: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.g1,
  },
  buttonEducation: {
    width: '100%',
    borderRadius: 10,
    marginTop: 15,
  },
  buttonExperience: {
    width: '100%',
    backgroundColor: colors.purpleSecondary,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonBody: {
    marginTop: 30,
    flex: 1,
  },
  headerText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.black,
  },
  floatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
  },
});
