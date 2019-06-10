import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Main from './src/Main';

class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return <Main />;
  }
}

export default App;
