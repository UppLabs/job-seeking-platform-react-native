import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../Layout';
import FloatButton from '../../components/FloatButton';
import colors from '../../constants/colors';
import { setUserFile } from '../../store/actions/user';

class ViewCVScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  confirm = () => {
    const { navigation, setFile } = this.props;
    setFile(navigation.getParam('file'));
    navigation.navigate('UploadCV');
  };

  cancel = () => {
    this.props.navigation.goBack();
  };

  render() {
    const file = this.props.navigation.getParam('file');
    const isObj = typeof file === 'object';
    const source = {
      uri: isObj ? file.uri : file,
      cache: true,
    };

    return (
      <Layout
        headerStyle={{
          backgroundColor: colors.black,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: Platform.OS === 'ios' ? 43 : 32,
          paddingBottom: 20,
          marginTop: 0,
        }}
        headerChildren={
          <View style={styles.header}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              onPress={this.cancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        }>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.container}>
          <Pdf
            source={source}
            // onLoadComplete={(numberOfPages, filePath) => {
            //   console.log(`number of pages: ${numberOfPages}`);
            // }}
            // onPageChanged={(page, numberOfPages) => {
            //   console.log(`current page: ${page}`);
            // }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        </View>
        {isObj && <FloatButton type="confirm" onPress={this.confirm} />}
      </Layout>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setFile: file => dispatch(setUserFile(file)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewCVScreen);

ViewCVScreen.propTypes = {
  setFile: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  cancel: {
    fontFamily: 'AvertaStd-Regular',
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.g1,
    textDecorationLine: 'underline',
  },
});
