import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import colors from '../constants/colors';
import LogoutIcon from '../../assets/icons/logout.svg';
import { logoutUser } from '../store/actions/user';

const { height } = Dimensions.get('window');

const LogoutModal = ({ onComplete, onLogout, onClose, isVisible }) => (
  <Modal animationType="slide" transparent visible={isVisible} useNativeDriver>
    <TouchableOpacity
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      onPress={onClose}
      style={suppStyles.background}>
      <TouchableWithoutFeedback>
        <View style={suppStyles.modalContainer}>
          <View style={suppStyles.closeBtnWrapper}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={onClose}>
              <Feather color={colors.g2} name="x" size={28} />
            </TouchableOpacity>
          </View>
          <View style={suppStyles.wrapper}>
            <LogoutIcon width="80" height="80" />
          </View>
          <View style={[suppStyles.wrapper, suppStyles.textWrapper]}>
            <Text style={suppStyles.bolderTitle}>Are you sure?</Text>
          </View>
          <View style={[suppStyles.wrapper]}>
            <Text style={suppStyles.thinDescription}>
              If you log out, we want be able to offer you the most relevant positions for you
            </Text>
          </View>

          <View style={suppStyles.deleteModalBtnWrapper}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={suppStyles.deleteModalBtn}
              onPress={onClose}>
              <Text style={suppStyles.deleteBtnText}>Stay login</Text>
            </TouchableOpacity>
          </View>

          <View style={[suppStyles.deleteModalBtnWrapper, { marginTop: 5 }]}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 0.5,
              }}
              onPress={() => {
                onLogout();
                onComplete();
              }}>
              <Text style={suppStyles.dismissText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  </Modal>
);

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logoutUser()),
});

export default connect(
  null,
  mapDispatchToProps
)(LogoutModal);