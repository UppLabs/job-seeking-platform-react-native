import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS, AsyncStorage, Platform } from 'react-native';
import api from './api';

export const setPushNotification = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    async onRegister(token) {
      console.log(token);
      const pushNotificationToken = await AsyncStorage.getItem('pushNotificationToken');
      console.log(pushNotificationToken);
      if (token.token !== pushNotificationToken) {
        AsyncStorage.setItem('pushNotificationToken', token.token);
        api.post('/api/Tokens/Push', {
          platformType: Platform.OS === 'ios' ? 0 : 1,
          pushNotificationToken: token.token,
        });
      }
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification(notification) {
      console.log('NOTIFICATION:', notification);
      // process the notification
      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: '',

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true,
  });
};

export default setPushNotification;
