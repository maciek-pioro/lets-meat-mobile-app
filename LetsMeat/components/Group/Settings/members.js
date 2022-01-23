import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button, Card
} from 'react-native-paper';
import { BackgroundContainer } from '../../Background';
import { DebtCard } from '../../Debts';
import { getUsersInfo } from '../../Requests';
import { store } from '../../Store';
import UserCard from '../../User';

const getDebtValue = (state, id) => {
  const myId = state.user.id;
  if (myId === id) return null;
  if (state.group.debts[id] && state.group.debts[id][myId]) {
    return state.group.debts[id][myId];
  }
  if (state.group.debts[myId] && state.group.debts[myId][id]) {
    return -state.group.debts[myId][id];
  }
  return 0;
};

export const GroupMembers = ({
  members,
  navigation,
  displayContainer = true,
  membersToDisplay = 3,
  showAll = false
}) => {
  const { state, dispatch } = useContext(store);
  const [membersInfo, setMembersInfo] = useState(members);

  useEffect(() => {
    getUsersInfo({ state, dispatch }, members.map((m) => m.id)).then(setMembersInfo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, state.user.id]);

  const membersSlice = showAll ? membersInfo : membersInfo.slice(0, membersToDisplay);

  const list = membersSlice.map((m) => {
    const debtValue = getDebtValue(state, m.id);
    return (
      <React.Fragment key={m.id}>
        <UserCard
          user={m}
          actions={m.id !== state.user.id ? (
            <Button onPress={
        () => navigation.navigate('SendTransfer', {
          user: m,
          amount: (debtValue < 0 ? -debtValue : undefined)
        })
      }
            >
              Send Transfer
            </Button>
          ) : undefined}
        />
        <DebtCard
          value={
          debtValue
        }
        />
      </React.Fragment>
    );
  });

  return (
    <>
      {
      displayContainer
        ? (
          <Card
            elevation={1}
            style={styles.emptyCard}
          >
            <Card.Title title="Members" />
            <Card.Content>
              {list}
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'space-evenly' }}>
              <Button onPress={() => navigation.navigate('Invite')}>
                <Icon name="plus" size={25} />
              </Button>
              {
            (membersInfo.length > membersToDisplay)
              ? (
                <Button onPress={() => navigation.navigate('Members')}>
                  <Icon name="dots-horizontal" size={25} />
                </Button>
              )
              : null
        }
            </Card.Actions>
          </Card>
        ) : list
  }
    </>
  );
};

export const MembersScreen = ({ navigation }) => {
  const { state } = useContext(store);

  return (
    <BackgroundContainer>
      <GroupMembers
        members={state.group.users}
        debts={state.group.debts}
        navigation={navigation}
        displayContainer={false}
        showAll
      />
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    margin: 10,
    backgroundColor: 'rgba(200, 200, 200, 0.9)'
  },
  user: {
    margin: 5
  },
});

export default GroupMembers;
