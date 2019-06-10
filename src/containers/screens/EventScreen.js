import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { NavigationEvents } from 'react-navigation';
import colors from '../../constants/colors';
import { whenDate } from '../../utils/dateHelper';
import Tag from '../../components/Tag';
import { hideMax } from '../../utils/stringHelper';
import EventAccessCodeModal from '../EventAccessCodeModal';
import { eventJoin } from '../../store/actions/events';
import Spinner from '../../components/Spinner';

class EventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isLoading: false,
    };
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  toogleModal = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };

  join = () => {
    const { isAuth, event, navigation } = this.props;
    if (!isAuth) {
      navigation.navigate('SignUp');
    } else {
      if (event.close && !this.getCode()) {
        this.toogleModal();
      } else {
        this.goEventFeed();
      }
    }
  };

  goEventFeed = async () => {
    this.setState({
      isLoading: true,
    });
    const { event, joinToEvent, navigation } = this.props;
    const res = await joinToEvent({
      eventId: event.id,
      code: this.getCode(),
    });

    if (res) {
      navigation.navigate('MainFeed');
    }
    this.setState({
      isLoading: false,
    });
  };

  getCode = () => {
    const { event, codes } = this.props;
    return codes[event.id];
  };

  willFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

  willBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    this.props.navigation.navigate('Discovery');

    return true;
  };

  render() {
    const { event, isAuth } = this.props;
    const { isVisible, isLoading } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Spinner show={isLoading} />
        <EventAccessCodeModal
          isVisible={isVisible}
          onClose={this.toogleModal}
          join={() => this.props.navigation.navigate('MainFeed')}
        />
        <NavigationEvents onWillFocus={this.willFocus} onWillBlur={this.willBlur} />
        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.backgroundContainer}>
              {event.eventLogo ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: event.eventLogo }}
                  style={styles.background}
                />
              ) : (
                <Image
                  source={require('../../../assets/backgrounds/Default_event_background.png')}
                  style={styles.backgroundImage}
                />
              )}
            </View>
            <View style={styles.header}>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                onPress={this.goBack}
                style={{ flex: 1 }}>
                <Feather style={styles.icon} name="arrow-left" size={24} />
              </TouchableOpacity>
              <Tag type={event.eventType} style={{ flex: 1 }} />
              <View style={styles.headerRight}>
                {/* <Feather style={[styles.icon, styles.heart]} name="heart" size={24} />
                <Feather style={styles.icon} name="share-2" size={24} /> */}
              </View>
            </View>
            <ScrollView style={styles.body}>
              <View style={styles.top}>
                <Image source={{ uri: event.communityLogo }} style={styles.profile} />
                <View style={styles.careerContainer}>
                  <Text style={styles.careerHosted}>HOSTED BY </Text>
                  <Text style={styles.career}>
                    {hideMax(event.communityName.toUpperCase(), 35)}
                  </Text>
                </View>
                <Text style={styles.title}>{hideMax(event.eventName, 35)}</Text>
                <Text style={styles.locationText}>{`When: ${whenDate(
                  event.startDateTime,
                  event.endDateTime
                )}`}</Text>
                {event.location && (
                  <Text style={styles.locationText}>{`Where: ${event.location.placeName}`}</Text>
                )}
              </View>
              <View style={styles.middle}>
                <View style={[styles.border, styles.borderLeft]}>
                  <Text style={styles.numberHeader}>PARTICIPANT COMPANIES</Text>
                  <View style={styles.rect}>
                    <Text style={styles.number}>{event.numberOfCompanies}</Text>
                  </View>
                </View>
                <View style={[styles.border, styles.borderRight]}>
                  <Text style={styles.numberHeader}>NUMBER OF POSITIONS</Text>
                  <View style={styles.rect}>
                    <Text style={styles.number}>{event.numberOfPositions}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.bottom}>
                <Text style={styles.numberHeader}>EVENT STORY</Text>
                <Text>{event.description}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.g4,
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            width: '100%',
          }}>
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={this.join}>
            {event.close && !this.getCode() ? (
              <View
                style={[
                  styles.bottomMenu,
                  styles.privateCodeMenu,
                  { backgroundColor: colors.marigold },
                ]}>
                <Feather style={[styles.iconLock, { flex: 1 }]} name="lock" size={24} />
                <Text style={[styles.bottomMenuText, { flex: 5 }]}>Enter private event code</Text>
                <View style={{ flex: 1 }} />
              </View>
            ) : (
              <View style={[styles.bottomMenu, { backgroundColor: colors.aquaMarine }]}>
                <Text style={styles.bottomMenuText}>{isAuth ? 'Event Feed' : 'Join Now'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ events, user }, ownProps) => {
  const { event, codes } = events;
  const { accessToken } = user;
  return {
    event,
    isAuth: !!accessToken,
    codes,
  };
};

const mapDispatchToProps = dispatch => ({
  joinToEvent: data => dispatch(eventJoin(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventScreen);

EventScreen.propTypes = {
  event: PropTypes.shape({
    communityLogo: PropTypes.string,
    communityName: PropTypes.string,
    eventLogo: PropTypes.string,
    startDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    location: PropTypes.object,
    eventType: PropTypes.number,
    eventName: PropTypes.string,
    close: PropTypes.bool,
  }),
  navigation: PropTypes.object,
  isAuth: PropTypes.bool.isRequired,
  joinToEvent: PropTypes.func.isRequired,
  codes: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  heart: {
    paddingRight: 10,
  },
  icon: {
    color: colors.g1,
  },
  iconLock: {
    color: colors.white,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.g4,
  },
  backgroundContainer: {
    width: '100%',
    height: 280,
    position: 'absolute',
  },
  background: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingTop: 40,
    paddingBottom: 25,
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  body: {
    marginHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
    alignSelf: 'stretch',
  },
  top: {
    padding: 10,
  },
  careerHosted: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    color: colors.purpleSecondary,
  },
  careerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  career: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
  },
  title: {
    paddingVertical: 10,
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    color: colors.black,
  },
  locationText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    letterSpacing: 0,
    color: colors.g1,
  },
  middle: {
    flexDirection: 'row',
  },
  rect: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#e5dcff',
    justifyContent: 'center',
    width: '100%',
  },
  border: {
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  borderLeft: {
    borderLeftWidth: 0,
    borderRightWidth: 0.5,
  },
  borderRight: {
    borderRightWidth: 0,
    borderLeftWidth: 0.5,
  },
  number: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.purpleSecondary,
    textAlign: 'center',
    ...Platform.select({ ios: { top: 5 } }),
  },
  numberHeader: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g1,
  },
  bottom: {
    padding: 10,
    paddingBottom: 200,
  },
  description: {
    paddingTop: 10,
  },
  headerRight: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomMenu: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    padding: 10,
  },
  bottomMenuText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.white,
  },
  privateCodeMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
