import { Platform, AsyncStorage } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { GoogleSignin } from 'react-native-google-signin';
import { LoginManager } from 'react-native-fbsdk';
import api from '../../utils/api';
import token from '../../utils/token';
import configureStore from '../configureStore';
import setPushNotification from '../../utils/pushNotification';

export const setUserToken = accessToken => ({ type: SET_USER_TOKEN, payload: accessToken });
export const setUser = user => ({ type: SET_USER, payload: user });

export const logIn = (accessToken, socialNetwork) => async dispatch => {
  try {
    const pushNotificationToken = await AsyncStorage.getItem('pushNotificationToken');
    const data = {
      socialNetwork,
      accessToken,
      platformType: Platform.OS === 'ios' ? 0 : 1,
      pushNotificationToken,
    };
    const response = await api.post('', data);
    dispatch(setUser(response.data));
    token.setToken(response.data.accessToken);
    setPushNotification();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = data => async dispatch => {
  try {
    const response = await api.post('', data);

    dispatch(setUserProfile(data));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const verifyEmail = code => async () => {
  try {
    const data = {
      code,
    };
    const response = await api.post('', data);

    return response.status;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const resendEmail = () => async () => {
  try {
    const response = await api.put('');

    console.log(response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addEducation = data => async dispatch => {
  try {
    const response = await api.post('', data);

    if (response.data) {
      dispatch({ type: ADD_USER_EXPERTISE, payload: data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addExperience = data => async dispatch => {
  try {
    const response = await api.post('', data);
    if (response.data) {
      if (response.status === 200) {
      }
      dispatch({ type: ADD_USER_EXPERTISE, payload: data });
    }
    return response.data;
  } catch (error) {
    console.log('error while getting experience: ', error);
  }
};

export const clearExpertise = () => ({ type: CLEAR_EXPERTISE });
export const setUserProfile = profile => ({ type: SET_USER_PROFILE, payload: profile });

export const setUserFile = file => ({ type: SET_USER_FILE, payload: file });

export const setUserCV = file => async (dispatch, getState) => {
  try {
    const { fileName, fileSize, type, uri } = getState().user.file;
    const response = await api.post('', {
      fileName,
    });
    const { uploadUrl } = response.data;
    const result = await RNFetchBlob.fetch(
      'PUT',
      uploadUrl,
      {
        // 'Content-Type': type,
      },
      Platform.OS === 'ios' ? RNFetchBlob.wrap(uri.replace('file:', '')) : RNFetchBlob.wrap(uri)
    );
    if (result.respInfo.status === 200) {
      const saveResponse = await api.put('', {
        fileName,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUserCV = () => async dispatch => {
  const cvResponse = await api.get('');
  if (cvResponse.status === 200) {
    dispatch({ type: GET_USER_CV, payload: cvResponse.data });
  }
  if (cvResponse.status === 204) {
    dispatch({ type: GET_USER_CV, payload: {} });
  }
};

export const getUserProfileInfo = () => async dispatch => {
  try {
    const profileResponse = await api.get('');
    if (profileResponse.status === 200) {
      dispatch({ type: GET_USER_PROFILE_INFO, payload: profileResponse.data });
      dispatch({
        type: UPDATE_SUPERPOWERS,
        payload: [profileResponse.data.superPower1, profileResponse.data.superPower2],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeSkill = (id, skillType) => async dispatch => {
  dispatch({ type: REMOVE_SKILL, payload: { id, skillType } });
  console.log('skills id: ', id);

  try {
    if (skillType === userKeys.DEGRESS) {
      await api.delete(`${id}`);
    } else if (skillType === userKeys.WORK_EXPERIENCES) {
      await api.delete(`${id}`);
    }
  } catch (err) {
    console.log('Error while trying to delete user exp or education: ', err);
  }
};

export const removeCV = () => async dispatch => {
  dispatch({ type: REMOVE_CV });
  try {
    await api.delete(``);
  } catch (err) {
    console.log('user cv delete error: ', err);
  }
};

export const logoutUser = () => async dispatch => {
  try {
    await LoginManager.logOut();
  } catch (e) {}
  try {
    await GoogleSignin.signOut();
  } catch (err) {
    console.log("We are not auth'ed with google: ", err);
  }
  token.removeToken();
  token.clearAll();
  dispatch({ type: LOGOUT_USER });
  dispatch(resetAll());
};

export const submitAllSkills = (skillName, years) => async dispatch => {
  try {
    // alert()
    const res = await api.post('', {
      name: skillName,
      numberOfYears: years,
    });

    if (res.status === 200) {
      console.log('callback created skill success: ', res.data);
      dispatch({ type: SAVED_SKILLS, payload: res.data });
    }
    console.log('res sent skills: ', res.data);
  } catch (err) {
    console.log('could not save skills: ', err);
  }
};

export const removedStagedSkills = skills => ({
  type: REMOVE_STAGED_SKILLS,
  payload: skills,
});

export const setSocialSession = (socialType, token, expirationDate) => ({
  type: SET_SOCIAL_SESSION,
  payload: {
    socialType,
    token,
    expirationDate,
  },
});

export const resetAll = () => async dispatch => {
  await dispatch({ type: 'RESET' });
  const store = configureStore();
  await store.persistor.purge();
  await store.persistor.persist();
};
