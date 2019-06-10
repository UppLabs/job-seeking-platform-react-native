import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import Button from './Button';
import Party from '../../assets/party.svg';
class CongratulationsPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isVisible, onClose, backToTheEvent, goToProfile } = this.props;
    return (
      <Modal style={styles.container} isVisible={isVisible} useNativeDriver>
        <View style={styles.modal}>
          <Party style={styles.image} />
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            style={styles.close}
            onPress={onClose}>
            <Feather style={styles.icon} name="x" size={24} />
          </TouchableOpacity>
          <Text style={styles.header}>Congratulation!</Text>
          <Text style={styles.note}>
            You finished building your initial profile, now you can review opportunities and apply!
          </Text>
          <Button
            title="Back to the event"
            onPress={() => {
              onClose();
              backToTheEvent();
            }}
          />
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              onClose();
              goToProfile();
            }}>
            <Text style={styles.link}>I want to update my full profile</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default CongratulationsPopup;

CongratulationsPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  backToTheEvent: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  image: {
    width: 79,
    height: 79,
    marginVertical: 20,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  icon: {
    color: colors.g1,
  },
  container: {
    flex: 1,
  },
  modal: {
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 30,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  note: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
    marginTop: 10,
    marginBottom: 20,
  },
  link: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.g2,
    textDecorationLine: 'underline',
    marginTop: 25,
    marginBottom: 32,
  },
});
