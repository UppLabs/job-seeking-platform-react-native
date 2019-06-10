import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import Input from '../components/Input';
import colors from '../constants/colors';
import Button from '../components/Button';
import { eventJoin } from '../store/actions/events';
import Spinner from '../components/Spinner';

class EventAccessCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      isValid: false,
      isLoading: false,
      isError: false,
    };
  }

  joinNow = async () => {
    const { code } = this.state;
    if (code && code.length > 0) {
      await this.setState({
        isLoading: true,
      });
      const { event, joinToEvent } = this.props;
      const data = {
        eventId: event.id,
        code: this.state.code,
      };
      const res = await joinToEvent(data);
      if (!res) {
        this.setState({ isError: true });
      } else {
        this.setState({ isError: false });
        this.props.onClose();
        this.props.join();
      }

      this.setState({
        isLoading: false,
      });
    }
  };

  handleChange = value => {
    this.setState({
      code: value,
    });
  };

  render() {
    const { isVisible, onClose } = this.props;
    const { isError, isLoading, code } = this.state;
    return (
      <Modal
        style={styles.container}
        isVisible={isVisible}
        onBackdropPress={onClose}
        useNativeDriver>
        <Spinner show={isLoading} />
        <View style={styles.modal}>
          <TouchableOpacity
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            style={styles.close}
            onPress={onClose}>
            <Feather style={styles.icon} name="x" size={24} />
          </TouchableOpacity>
          <Text style={styles.header}>Enter event code</Text>
          <Text style={styles.note}>
            You’re almost there! Just add event code to join the event
          </Text>
          <Input
            value={code}
            style={{ width: '100%', flex: 0, paddingTop: 10 }}
            label="ENTER EVENT CODE"
            returnKeyType="go"
            onSubmitEditing={this.joinNow}
            onChangeText={this.handleChange}
          />
          {isError ? (
            <Text style={{ color: colors.orangeyRed, marginTop: 10 }}>
              Wrong code, Please try again.
            </Text>
          ) : null}
          <View style={{ width: '100%', marginTop: 40 }}>
            <Button
              disabled={!(code && code.length > 0)}
              style={styles.button}
              title="Join now!"
              onPress={this.joinNow}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = ({ events }) => {
  const { event } = events;

  return {
    event,
  };
};

const mapDispatchToProps = dispatch => ({
  joinToEvent: data => dispatch(eventJoin(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventAccessCodeModal);

EventAccessCodeModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  join: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  close: {
    alignSelf: 'flex-end',
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
    paddingBottom: 40,
  },
  header: {
    fontFamily: 'AvertaStd-Bold',
    fontSize: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
    paddingTop: 10,
  },
  note: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.g1,
  },
});
