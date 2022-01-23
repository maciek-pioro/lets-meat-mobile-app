import React, { useContext, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { refreshGroup } from '../../../helpers/refresh';
import { BackgroundContainer, ScrollPlaceholder } from '../../Background';
import { ModalButton } from '../../Buttons';
import {
  deleteGroup, leaveGroup
} from '../../Requests';
import { store } from '../../Store';
import { GroupMembers } from './members';

const DeleteGroup = ({ confirmAction }) => (
  <ModalButton
    style={styles.delete}
    modalText="Are you sure you want to delete the group?"
    icon="delete"
    buttonText="DELETE"
    confirmAction={confirmAction}
    confirmText="Delete"
  />
);

const LeaveGroup = ({ confirmAction }) => (
  <ModalButton
    modalText="Are you sure you want to leave the group?"
    icon="logout-variant"
    buttonText="LEAVE"
    confirmAction={confirmAction}
    confirmText="Leave"
  />
);

const computeCanILeave = (state) => {
  let myEdges = state.group.debts[state.user.id]
    ? Object.entries(state.group.debts[state.user.id])
      .reduce((prev, [, curr]) => prev + Math.abs(curr), 0) : 0;

  myEdges += Object.entries(state.group.debts)
    .map(([, userInfo]) => (userInfo[state.user.id] ? Math.abs(userInfo[state.user.id]) : 0))
    .reduce((prev, curr) => prev + Math.abs(curr), 0);

  return myEdges === 0;
};

const SettingsScroll = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [refreshing, setRefreshing] = useState(false);
  const [spinnerText, setSpinnerText] = useState('');
  const turnOffSpinner = () => setSpinnerText('');

  const onRefresh = () => {
    setRefreshing(true);
    refreshGroup(state, dispatch).finally(() => { setRefreshing(false); });
  };

  const canILeave = computeCanILeave(state);

  return (
    <BackgroundContainer>
      <Spinner visible={spinnerText !== ''} textContent={spinnerText} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <GroupMembers
          members={state.group.users}
          debts={state.group.debts}
          navigation={navigation}
        />
        {canILeave
          ? (
            <LeaveGroup confirmAction={() => {
              setSpinnerText('Leaving group');
              leaveGroup({ state, dispatch }, state.group.id)
                .then(() => dispatch({ type: 'REMOVE_GROUP', groupId: state.group.id }))
                .then(() => dispatch({ type: 'SET_GROUP', payload: {} }))
                .then(() => navigation.navigate('SelectGroup'))
                .finally(turnOffSpinner);
            }}
            />
          ) : null}
        <DeleteGroup confirmAction={() => {
          setSpinnerText('Deleting the group');
          deleteGroup({ state, dispatch }, state.group.id)
            .then(() => dispatch({ type: 'REMOVE_GROUP', groupId: state.group.id }))
            .then(() => dispatch({ type: 'SET_GROUP', payload: {} }))
            .then(() => navigation.navigate('SelectGroup'))
            .finally(turnOffSpinner);
        }}
        />
        <ScrollPlaceholder height={100} />
      </ScrollView>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  user: {
    margin: 5
  },
  delete: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)'
  },
  leave: {
    backgroundColor: '#fc3503'
  }
});

export default SettingsScroll;
