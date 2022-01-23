/* eslint-disable max-len */
import {
  GoogleSignin
} from '@react-native-community/google-signin';
import axios from 'axios';
import { ToastAndroid } from 'react-native';

const baseURL = 'https://letsmeatapi.azurewebsites.net/';

const printAndPassError = (e) => {
  if (e.response) {
    if (e.response.status === 401) {
      ToastAndroid.show('You might try relogging', ToastAndroid.SHORT);
    }
  }
  ToastAndroid.show(e.message, ToastAndroid.SHORT);
  throw e;
};

const tryLoggingIn = async (state, dispatch) => {
  try {
    await GoogleSignin.signInSilently();
  } catch (error) {
    dispatch({ type: 'LOGOUT' });
    dispatch({ type: 'SET_LOADED' });
    return;
  }
  try {
    let user = await GoogleSignin.getCurrentUser();
    user = await appendAPIToken(user);
    user = await appendUserID(user);
    dispatch({ type: 'SET_USER', payload: user });
  } catch (error) {
    dispatch({ type: 'SET_LOADED' });
  }
};

// For future use
// eslint-disable-next-line no-unused-vars
const executeRequest = (request, dispatch) => request()
  .catch(printAndPassError);

const get = ({ state, dispatch }, endpoint, params = undefined) => {
  const axiosConfig = { baseURL, params: { token: state.user.token, ...params } };
  const request = () => axios.get(endpoint, axiosConfig);
  return executeRequest(request, dispatch);
};

const post = ({ state, dispatch }, endpoint, data, params) => {
  const axiosConfig = { baseURL, params: { token: state.user.token, ...params } };
  const request = () => axios.post(endpoint, data, axiosConfig);
  return executeRequest(request, dispatch);
};

const patch = ({ state, dispatch }, endpoint, data, params) => {
  const axiosConfig = { baseURL, params: { token: state.user.token, ...params } };
  const request = () => axios.patch(endpoint, data, axiosConfig);
  return executeRequest(request, dispatch);
};

// _delete because delete is a JS keyword
// eslint-disable-next-line no-underscore-dangle
const _delete = ({ state, dispatch }, endpoint, data) => {
  const axiosConfig = { baseURL, data, params: { token: state.user.token } };
  const request = () => axios.delete(endpoint, axiosConfig);
  return executeRequest(request, dispatch);
};

const getAPIToken = (googleToken) => {
  const axiosConfig = { baseURL, params: { googleTokenId: googleToken } };
  return axios.post('/Login/google', null, axiosConfig);
};

const appendAPIToken = (userInfo) => {
  const axiosConfig = { baseURL, params: { googleTokenId: userInfo.idToken } };
  return axios.post('/Login/google', null, axiosConfig).then((token) => ({ ...userInfo, token: token.data }));
};

const appendUserID = (userInfo) => {
  const axiosConfig = { baseURL, params: { token: userInfo.token } };
  return axios.get('/Users/info', axiosConfig).then((response) => ({ ...userInfo, ...response.data }));
};

const extractData = (response) => response.data;

const getGroups = ({ state, dispatch }) => get({ state, dispatch }, '/Users/info').then(extractData).then((data) => data.groups);

const getGroupInfo = ({ state, dispatch }, id) => get({ state, dispatch }, '/Groups/info', { id }).then(extractData);

const createGroup = ({ state, dispatch }, name) => post({ state, dispatch }, '/Groups/create/', { name }).then(extractData);

const deleteGroup = ({ state, dispatch }, id) => _delete({ state, dispatch }, '/Groups/delete/', { id });

const leaveGroup = ({ state, dispatch }, id) => post({ state, dispatch }, '/Groups/leave/', { id });

const createEvent = ({ state, dispatch }, groupId, name, deadline) => post({ state, dispatch }, '/Events/create', { group_id: groupId, name, deadline }).then(extractData);

const getEventInfo = ({ state, dispatch }, eventId) => get({ state, dispatch }, '/Events/info', { id: eventId }).then(extractData);

const updateEvent = ({ state, dispatch }, event) => patch({ state, dispatch }, '/Events/update', event).then(extractData);

const deleteEvent = ({ state, dispatch }, id) => _delete({ state, dispatch }, '/Events/delete', { id });

const searchUsers = ({ state, dispatch }, name) => get({ state, dispatch }, '/Users/search', { name }).then(extractData);

const getUsersInfo = ({ state, dispatch }, ids) => post({ state, dispatch }, '/Users/info', { ids: (Array.isArray(ids) ? ids : [ids]) }).then(extractData);

const updatePrefs = ({ state, dispatch }, prefs) => post({ state, dispatch }, '/Users/update_prefs', { ...prefs });

const sendInvitation = ({ state, dispatch }, userId, groupId) => post({ state, dispatch }, '/Invitations/send', { to_id: userId, group_id: groupId });

const getInvitations = ({ state, dispatch }) => get({ state, dispatch }, '/Invitations/get').then(extractData);

const rejectInvitation = ({ state, dispatch }, groupId) => _delete({ state, dispatch }, '/Invitations/reject', { group_id: groupId });

const joinGroup = ({ state, dispatch }, groupId) => post({ state, dispatch }, '/Groups/join', { id: groupId });

const acceptInvitation = joinGroup;

// For future use
// eslint-disable-next-line no-unused-vars
const uploadImage = ({ state, dispatch }, eventId, image) => {
  // eslint-disable-next-line no-undef
  const form = new FormData();
  form.append('file', { uri: image.uri, type: image.type, name: image.fileName });
  return fetch(`${baseURL}Images/upload?${new URLSearchParams({ token: state.user.token, event_id: eventId })}`, {
    method: 'POST',
    headers: {
      Accept: 'text/',
      'Content-Type': 'multipart/form-data',
    },
    body: form
  }).then((response) => response.json());
};

const getImagesInfo = ({ state, dispatch }, ids) => post({ state, dispatch }, '/Images/info', { image_ids: (Array.isArray(ids) ? ids : [ids]) }).then(extractData);

const deleteImage = ({ state, dispatch }, id) => _delete({ state, dispatch }, '/Images/delete', { id });

const getVote = ({ state, dispatch }, eventId) => get({ state, dispatch }, '/Votes/get', { event_id: eventId })
  .then(extractData);

const getVoteTimes = ({ state, dispatch }, eventId) => getVote({ state, dispatch }, eventId)
  .then((data) => data.times);

const getVoteLocations = ({ state, dispatch }, eventId) => getVote({ state, dispatch }, eventId)
  .then((data) => data.locations);

const castVote = ({ state, dispatch }, eventId, times, locations) => post({ state, dispatch }, '/Votes/cast',
  {
    event_id: eventId,
    vote_information: {
      times,
      locations
    }
  });

const getResults = ({ state, dispatch }, eventId) => get({ state, dispatch }, '/Votes/result', { event_id: eventId }).then(extractData);

const searchLocation = ({ state, dispatch }, groupId, query, sessionToken) => get({ state, dispatch },
  '/Locations/search',
  { group_id: groupId, query_string: query, sessiontoken: sessionToken })
  .then(extractData);

const createLocationGoogle = ({ state, dispatch }, placeId, sessionToken) => post({ state, dispatch }, '/Locations/create_from_gmaps', { place_id: placeId, sessiontoken: sessionToken }).then(extractData);

const createLocationCustom = ({ state, dispatch }, groupId, name, address) => post({ state, dispatch }, '/Locations/create_custom', { group_id: groupId, name, address }).then(extractData);

const getLocationsInfo = ({ state, dispatch }, customIds, googleIds) => post({ state, dispatch },
  '/Locations/info',
  {
    custom_location_ids: customIds,
    google_maps_location_ids: googleIds
  })
  .then(extractData);

const rateLocation = ({ state, dispatch }, taste, price, amountOfFood, waitingTime, gmapsId, customId) => post({ state, dispatch },
  '/Locations/rate',
  {
    taste, price, amount_of_food: amountOfFood, waiting_time: waitingTime, google_maps_id: gmapsId, custom_location_id: customId
  }).then(extractData);

const addDebt = ({ state, dispatch }, groupId, eventId, fromId, toId, amount, description, imageId, debtType = 1) => post({ state, dispatch }, '/Debts/add',
  {
    group_id: groupId,
    event_id: eventId,
    from_id: fromId,
    to_id: toId,
    amount,
    description,
    image_debt_id: imageId,
    debt_type: debtType
  })
  .then(extractData);

const getPendingDebts = ({ state, dispatch }) => get({ state, dispatch }, '/Debts/pending').then((d) => d.data.pending_debts);

const rejectDebt = ({ state, dispatch }, debtId) => post({ state, dispatch }, '/Debts/reject', { debt_id: debtId });

const acceptDebt = ({ state, dispatch }, debtId) => post({ state, dispatch }, '/Debts/approve', { debt_id: debtId });

const getGroupDebts = ({ state, dispatch }, groupId, normalize = true) => get({ state, dispatch }, '/Debts/groupinfo', { id: groupId, normalize }).then(extractData);

const deleteImageDebt = ({ state, dispatch }, id) => _delete({ state, dispatch }, '/Images/delete_image_debt', { id });

const updateImageDebt = ({ state, dispatch }, debt) => patch({ state, dispatch }, '/Images/update_image_debt', debt).then(extractData);

const createImageDebt = ({ state, dispatch }, amount, description, imageId) => post({ state, dispatch },
  '/Images/create_image_debt', { amount, description, image_id: imageId });

const getEventDebts = ({ state, dispatch }, eventId) => get({ state, dispatch }, '/Events/image_debts', { event_id: eventId })
  .then(extractData)
  .then((debts) => debts.image_debts);

const testRequest = ({ state, dispatch }, code) => get({ state, dispatch }, '/Test', { code });

export {
  tryLoggingIn,
  getAPIToken, appendAPIToken, appendUserID,
  createGroup, getGroupInfo, deleteGroup, getGroups, leaveGroup, joinGroup,
  createEvent, getEventInfo, updateEvent, deleteEvent,
  searchUsers, getUsersInfo, updatePrefs,
  sendInvitation, getInvitations, rejectInvitation, acceptInvitation,
  uploadImage, getImagesInfo, deleteImage,
  getVote, getVoteTimes, getVoteLocations, castVote, getResults,
  searchLocation, createLocationGoogle, createLocationCustom, getLocationsInfo, rateLocation,
  addDebt, getPendingDebts, rejectDebt, acceptDebt, getGroupDebts,
  deleteImageDebt, updateImageDebt, createImageDebt, getEventDebts,
  testRequest
};
