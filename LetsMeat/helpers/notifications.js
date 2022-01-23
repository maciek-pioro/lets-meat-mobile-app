import { getInvitations, getPendingDebts } from '../components/Requests';

export const getNotificationTimestamp = (notification) => (notification.kind === 'invitation'
  ? new Date(notification.sent).getTime()
  : new Date(notification.timestamp).getTime());

export const refreshNotifications = ({ state, dispatch }) => {
  const APIactions = [
    getInvitations({ state, dispatch }).then((invitations) => {
      dispatch({ type: 'SET_INVITATIONS', payload: invitations.map((i) => ({ ...i, kind: 'invitation' })) });
    }),
    getPendingDebts({ state, dispatch }).then((debts) => {
      dispatch({ type: 'SET_DEBTS', payload: debts.map((i) => ({ ...i, kind: 'debt' })) });
    })];
  return Promise.all(APIactions);
};
