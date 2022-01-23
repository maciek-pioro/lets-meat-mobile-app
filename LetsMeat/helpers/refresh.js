import {
  getGroupInfo, getGroupDebts
} from '../components/Requests';

// eslint-disable-next-line import/prefer-default-export
export const refreshGroup = (state, dispatch, id) => Promise.all(
  [getGroupInfo({ state, dispatch }, id || state.group.id),
    getGroupDebts({ state, dispatch }, id || state.group.id)]
).then(([groupInfo, debtInfo]) => {
  dispatch({ type: 'SET_GROUP', payload: { ...groupInfo, ...debtInfo } });
});
