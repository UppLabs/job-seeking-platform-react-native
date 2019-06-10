import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import { whenDate } from '../utils/dateHelper';

const EventInfoPopup = ({ isShow, onClose, event }) => (
  <Modal
    style={styles.container}
    isVisible={isShow}
    onBackButtonPress={onClose}
    onBackdropPress={onClose}
    useNativeDriver>
    <View style={styles.body}>
      <View style={[styles.row, { marginTop: 33 }]}>
        <Text style={[styles.headerRegular, { color: colors.purpleSecondary }]}>HOSTED BY </Text>
        <Text style={styles.headerRegular}>{event.hostName && event.hostName.toUpperCase()}</Text>
      </View>
      <Text style={styles.headerBold}>{event.eventName}</Text>
      <Text style={styles.mainText}>{`When: ${whenDate(
        event.startDateTime,
        event.endDateTime
      )}`}</Text>
      {event.location ? (
        <Text style={styles.mainText}>{`When: ${whenDate(
          event.startDateTime,
          event.endDateTime
        )}`}</Text>
      ) : null}
    </View>
  </Modal>
);

export default EventInfoPopup;

EventInfoPopup.propTypes = {
  isShow: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
  body: {
    // flex: 1,
    height: 167,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
  },
  headerBold: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    color: colors.black,
    marginTop: 10,
    marginBottom: 5,
  },
  headerRegular: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: colors.g2,
  },
  mainText: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.g1,
  },
});
