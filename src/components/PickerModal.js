import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

const PickerModal = ({ isPickerShowing, hidePicker, showPicker }) => (
  <Modal
    useNativeDriver
    style={{
      justifyContent: 'flex-end',
      flex: 1,
      paddingTop: 55,
    }}
    // animationTiming={1} // show modal and picker instantly to avoid undue delay, since picker can't show till after modal is showing
    isVisible={isPickerShowing}
    onBackdropPress={hidePicker}
    onBackButtonPress={hidePicker}
    onModalHide={hidePicker}
    onModalShow={showPicker}>
    {/* Modal is empty */}
    <View />
  </Modal>
);

export default PickerModal;

PickerModal.propTypes = {
  isPickerShowing: PropTypes.bool.isRequired,
  hidePicker: PropTypes.func.isRequired,
  showPicker: PropTypes.func.isRequired,
};
