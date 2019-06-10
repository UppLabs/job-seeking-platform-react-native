import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import Tag from './Tag';
import { whenDate } from '../utils/dateHelper';
import { hideMax } from '../utils/stringHelper';

const Event = ({
  id,
  communityLogo,
  endDateTime,
  location,
  eventType,
  eventName,
  onPress,
}) => {
  return (
    <TouchableOpacity hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.top}>
          <ImageBackground source={{ uri: eventLogo }} style={styles.imgBg}>
            <View style={styles.leftContainer}>
              <Image source={{ uri: communityLogo }} style={styles.profile} />
            </View>
            <View style={styles.rightContainer}>
              <Tag type={eventType} />
            </View>
          </ImageBackground>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.career}>{hideMax(communityName.toUpperCase(), 40)}</Text>
          <Text style={styles.title}>{hideMax(eventName, 40)}</Text>
          {location && (
            <Text style={styles.description}>
              {`${location.city}, ${location.street} ${location.streetNumber} `}
            </Text>
          )}
          <Text style={styles.description}>{whenDate(startDateTime, endDateTime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Event;

Event.propTypes = {
  id: PropTypes.string,
  communityLogo: PropTypes.string,
  communityName: PropTypes.string,
  eventLogo: PropTypes.string,
  startDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  location: PropTypes.object,
  eventType: PropTypes.number,
  eventName: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginTop: 18,
    minHeight: 241,
  },
  imgBg: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    resizeMode: 'stretch',
  },
  top: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    height: 105,
  },
  bottom: {
    padding: 10,
  },
  career: {
    fontFamily: 'AvertaStd-Regular',
    paddingTop: 10,
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
  description: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.g1,
  },
});
