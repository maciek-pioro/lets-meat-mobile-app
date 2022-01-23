import React, {
  useContext,
  useEffect, useState
} from 'react';
import {
  ActivityIndicator,
  Card
} from 'react-native-paper';
import { getUsersInfo } from '../../Requests';
import { store } from '../../Store';
import UserCard from '../../User';

const Creator = ({ userId, containerStyle }) => {
  const { state, dispatch } = useContext(store);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getUsersInfo({ state, dispatch }, userId).then((users) => {
      setUserInfo(users[0]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id, userId]);

  return (
    <Card elevation={0} style={containerStyle}>
      <Card.Title title="Creator" />
      {userInfo
        ? <UserCard user={userInfo} />
        : <ActivityIndicator />}
    </Card>
  );
};

export default Creator;
