import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import RNMinimizeApp from 'react-native-minimize';
import colors from '../../constants/colors';
import Event from '../../components/Event';
import { getEvents, setEvent } from '../../store/actions/events';
import Layout from '../Layout';
import notificationEnum from '../../constants/notificationEnum';
import {
  hideDiscoveryNotification,
  discoveryNotSetNotification,
} from '../../store/actions/notification';

class DiscoveryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      isLoading: false,
    };
  }
  componentWillUnmount() {
    this.willBlur();
  }

  willFocus = async () => {
    const { navigation, isAuth } = this.props;
    navigation.setParams({ tabBar: isAuth });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    await this.setState({
      ...this.state,
      isLoading: true,
    });
    await this.props.getEventsData();
    this.setState({
      ...this.state,
      isLoading: false,
    });
  };

  handleScroll = () => {
    if (this.props.isShow === notificationEnum.show) {
      this.props.hideNotification();
    }
  };

  handleSearch = text => {
    this.setState({
      search: text,
    });
  };

  results = () => {
    const search = this.state.search.toUpperCase();

    const results = this.props.list.filter(
      x =>
        x.eventName.toUpperCase().includes(search) ||
        x.communityName.toUpperCase().includes(search) ||
        (x.serialCode && x.serialCode.toUpperCase().includes(search))
    );

    return results;
  };

  clearSearch = () => {
    this.setState({
      search: '',
    });
  };

  goToDetails = event => {
    this.props.setEventData(event);
    this.props.navigation.navigate('Event');
  };

  willBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    RNMinimizeApp.minimizeApp();

    return true;
  };


  notificationAnimationComplete = () => {
    if (this.props.isShow === notificationEnum.hide) {
      this.props.notsetNotification();
    }
  };

  render() {
    const { search, isLoading } = this.state;
    const { isShow } = this.props;
    const events = this.results();
    return (
      <Layout
        notificationAnimationHeight={185}
        notificationAnimationComplete={this.notificationAnimationComplete}
        notificationAnimation
        // notificationAnimation={isShow !== notificationEnum.show}
        notification={isShow !== notificationEnum.notSet}
        showSpinner={isLoading}
        notificationAnimationType={isShow}
        replaceBody
        style={{ paddingHorizontal: 0, backgroundColor: colors.g4 }}
        backButton={false}
        notificationTitle="Awesome!"
        notificationText="Take a look at the upcoming relevant events for you! To get more personalized results, please complete your profile"
        headerComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.searchSection}>
                <Feather style={styles.searchIcon} name="search" size={24} color={colors.g2} />
                <TextInput
                  editable
                  maxLength={40}
                  style={styles.search}
                  placeholder="Search"
                  value={search}
                  onChangeText={this.handleSearch}
                />
                {search ? (
                  <TouchableOpacity
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    style={styles.closeIcon}
                    onPress={this.clearSearch}>
                    <Feather name="x-square" size={24} color={colors.g2} />
                  </TouchableOpacity>
                ) : null}
              </View>
              {/* <TouchableOpacity
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                style={styles.filter}>
                <Feather name="sliders" size={24} color={colors.g2} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.hr} />
          </View>
        }>
        {events.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            style={styles.body}
            onScroll={this.handleScroll}>
            <Text style={styles.text}>RECOMMENDED FOR YOU</Text>
            <Text style={styles.textHeader}>Upcoming Events</Text>
            {events.map(item => (
              <Event key={item.id} {...item} onPress={() => this.goToDetails(item)} />
            ))}
          </ScrollView>
        ) : !isLoading ? (
          <View
            style={{
              justifyContent: 'center',
              paddingBottom: 100,
              alignItems: 'center',
            }}>
            <Image style={styles.image} source={require('../../../assets/empty_state.png')} />
            <Text style={styles.emptyHeaderText}>
              Seems like we couldn't find what you were looking for
            </Text>
            <Text style={styles.emptyNoteText}>Please update your search and try again</Text>
          </View>
        ) : null}
        <NavigationEvents onWillFocus={this.willFocus} onWillBlur={this.willBlur} />
      </Layout>
    );
  }
}

const mapStateToProps = ({ events, user, notification }) => {
  const { list } = events;
  const { accessToken } = user;
  const { discoveryNotification } = notification;

  return {
    list,
    isAuth: !!accessToken,
    isShow: discoveryNotification,
  };
};

const mapDispatchToProps = dispatch => ({
  getEventsData: () => dispatch(getEvents()),
  setEventData: event => dispatch(setEvent(event)),
  hideNotification: () => dispatch(hideDiscoveryNotification()),
  notsetNotification: () => dispatch(discoveryNotSetNotification()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoveryScreen);

DiscoveryScreen.propTypes = {
  getEventsData: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string,
      communityName: PropTypes.string,
    })
  ),
  setEventData: PropTypes.func.isRequired,
  isShow: PropTypes.string.isRequired,
  hideNotification: PropTypes.func.isRequired,
  notsetNotification: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    width: 170,
    height: 190,
    marginTop: 64,
  },
  emptyHeaderText: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
    marginTop: 15,
  },
  emptyNoteText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.g1,
    marginTop: 3,
  },
  filter: {
    width: 68,
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  searchIcon: {
    zIndex: 2,
    left: 10,
    position: 'absolute',
  },
  closeIcon: {
    zIndex: 2,
    right: 25,
    position: 'absolute',
  },
  search: {
    width: '100%',
    flex: 1,
    paddingLeft: 40,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingRight: 30,
    marginRight: 15,
  },
  header: {
    height: 100,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.g4,
  },
  body: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.g4,
  },
  textHeader: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    color: colors.black,
  },
  text: {
    height: 24,
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.g2,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  // container: {
  //   flex: 1,
  //   paddingBottom: 10,
  // },
  hr: {
    height: 1,
    width: '100%',
    backgroundColor: colors.g3,
  },
});
