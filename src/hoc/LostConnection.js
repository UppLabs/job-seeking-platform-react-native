import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { NetInfo } from 'react-native';

function LostConnection(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      console.log('INIT APP');
      NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    // none - device is offline
    // wifi - device is online and connected via wifi, or is the iOS simulator
    // cellular - device is connected via Edge, 3G, WiMax, or LTE
    // unknown - error case and the network status is unknown
    handleConnectivityChange = connectionInfo => {
      if (connectionInfo.type === 'none') {
        this.props.navigation.navigate('NoConnectivity');
      }
      alert(JSON.stringify(connectionInfo));
      console.log(
        'Type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType
      );
    };

    componentWillUnmount() {
      NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    render() {
      console.log(this.props);
      // Notice that we pass through any additional props
      return <WrappedComponent {...this.props} />;
    }
  };
}

const mapStateToProps = ({}, ownProps) => {
  console.log(ownProps);
  return {};
};

export default LostConnection;
