import React from 'react';
import { Provider } from 'react-redux';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import WelcomeScreen from './containers/screens/WelcomeScreen';
import DiscoveryScreen from './containers/screens/DiscoveryScreen';
import NoConnectivityScreen from './containers/screens/NoConnectivityScreen';

const rootStack = createStackNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Welcome: WelcomeScreen,
    Discovery: {
      screen: DiscoveryScreen,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    NoConnectivity: NoConnectivityScreen,
    Event: EventScreen,
    SignUp: SignUpScreen,
    CreateProfile: CreateProfileScreen,
    UploadCV: UploadCVScreen,
    ViewCV: ViewCVScreen,
    MainFeed: MainFeedScreen,
    CompanyDescription: CompanyDescriptonScreen,
    EventFilter: EventFilterScreen,
    PositionFields: PositionFieldsScreen,
    SpecificCompany: SpecificCompanyScreen,
    Schedules: SchedulesScreen,
    ScheduleMeeting: ScheduleMeetingScreen,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      const routes = navigation.state.routes;
      const route = routes[routes.length - 1];
      const isShow = route.params ? !!route.params.tabBar : false;

      return {
        tabBarVisible: isShow,
        animationEnabled: true,
      };
    },
  }
);

const bottomStack = createStackNavigator(
  {
    UserProfile: UserProfileScreen,
    AddLanguageList: AddLanguageListScreen,
    UploadCV: UploadCVScreen,
  },
  {
    initialRouteName: 'UserProfile',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.index < 1,
      headerVisible: false,
    }),
  }
);

let mainFlowTabNav = createBottomTabNavigator(
  {
    Root: rootStack,
    Profile: bottomStack,
  },
  {
    initialRouteName: 'Root',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Root') {
          if (focused) {
            return <DiscoveryIconTinted width="30" height="30" />;
          }
          return <DiscoveryIcon width="30" height="30" />;
        } else if (routeName === 'Activities') {
          if (focused) {
            return <ActivitiesIconTinted width="30" height="30" />;
          }
          return <ActivitiesIcon width="30" height="30" />;
        } else {
          if (focused) {
            return <UserProfileIconTinted width="30" height="30" />;
          }
          return <UserProfileIcon width="30" height="30" />;
        }
      },
    }),
    tabBarComponent: CustomBottomTabbarNav,
  }
);

let Navigation = createAppContainer(mainFlowTabNav);

const store = configureStore();

class Main extends React.Component {
  render() {
    return (
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <Navigation
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}

export default Main;
