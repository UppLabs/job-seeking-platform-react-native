import { combineReducers } from 'redux';
import user from '../reducers/user';
import events from '../reducers/events';
import notification from '../reducers/notification';

const rootReducer = combineReducers({
  user,
  events,
  notification,
});

export default rootReducer;
