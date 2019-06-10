import {
  SET_EVENTS,
  SET_EVENT,
  SET_EVENT_FEED,
  SET_EVENT_COMPANY,
  SET_EVENT_FILTER_APPLIED,
  SET_EVENT_FILTER_DEFAULT,
  SET_EVENT_FILTER,
} from '../constants/events';
import api from '../../utils/api';

export const getEvents = () => async (dispatch, getState) => {
  try {
    const response = await api.get('');
    dispatch({ type: SET_EVENTS, payload: response.data });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const setEvent = event => ({ type: SET_EVENT, payload: event });

export const eventJoin = data => async dispatch => {
  try {
    const response = await api.post('', data);

    if (response.data.succeed !== undefined && response.data.succeed === false) {
      return false;
    } else {
      dispatch(setEventFeed(response.data));
      if (data.code) {
        dispatch(
          setEventCode({
            [data.eventId]: data.code,
          })
        );
      }

      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setEventFeed = feed => ({ type: SET_EVENT_FEED, payload: feed });
export const setEventCompany = company => ({ type: SET_EVENT_COMPANY, payload: company });
export const setEventFilterApplied = value => ({ type: SET_EVENT_FILTER_APPLIED, payload: value });
export const setEventFilterDefault = () => ({ type: SET_EVENT_FILTER_DEFAULT });
export const setEventFilter = filter => ({ type: SET_EVENT_FILTER, payload: filter });
export const clearEventTmpFilter = { type: CLEAR_EVENT_TMP_FILTER };
export const toogleEventTmpPositionField = item => ({
  type: TOOGLE_EVENT_TMP_POSITION_FIELD,
  payload: item,
});
export const toogleEventTmpSpecificCompany = item => ({
  type: TOOGLE_EVENT_TMP_SPECIFIC_COMPANY,
  payload: item,
});

export const applyPosition = data => async (dispatch, getState) => {
  try {
    const response = await api.post('', data);
    if (response.status === 200) {
      const { events } = getState();
      const feed = { ...events.feed };

      feed.companies = feed.companies.map(company => {
        let newCompany = { ...company };
        newCompany.positions = company.positions.map(x => {
          if (x.id === data.positionId) {
            x.applied = true;
          }
          return x;
        });
        return newCompany;
      });

      dispatch(setEventFeed(feed));
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setEventCode = code => ({ type: SET_EVENT_CODE, payload: code });

export const getScheduleByEventId = eventId => async dispatch => {
  try {
    const response = await api.get(`eventId=${eventId}`);
    if (response) {
      dispatch({ type: SET_SCHEDULE, payload: response.data });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAvailableHours = (eventId, organizationId) => async dispatch => {
  try {
    const response = await api.get(
      `eventId=${eventId}&organizationId=${organizationId}`
    );
    if (response) {
      dispatch({
        type: SET_AVAILABLE_HOURS,
        payload: response.data.length > 0 ? response.data : [],
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setScheduleSlot = data => async dispatch => {
  try {
    const response = await api.post('', data);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
