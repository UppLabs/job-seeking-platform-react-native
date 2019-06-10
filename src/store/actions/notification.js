import {
  SHOW_DISCOVERY_NOTIFICATION,
  HIDE_DISCOVERY_NOTIFICATION,
  DISCOVERY_NOTSET_NOTIFICATION,
} from '../constants/notification';

export const showDiscoveryNotification = () => ({ type: SHOW_DISCOVERY_NOTIFICATION });
export const hideDiscoveryNotification = () => ({ type: HIDE_DISCOVERY_NOTIFICATION });
export const discoveryNotSetNotification = () => ({ type: DISCOVERY_NOTSET_NOTIFICATION });
