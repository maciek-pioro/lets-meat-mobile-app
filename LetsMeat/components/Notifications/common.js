import React, {
  useContext, useEffect, useRef, useState
} from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Button, Caption, Card,
  Paragraph, Subheading
} from 'react-native-paper';
import { formatAmount } from '../../helpers/money';
import {
  acceptDebt,
  acceptInvitation,
  getGroupInfo,
  getImagesInfo,
  getUsersInfo,
  rejectDebt,
  rejectInvitation
} from '../Requests';
import { store } from '../Store';

const NotificationAction = ({ acceptAction, rejectAction, full }) => {
  const mounted = useRef(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  });

  const finishAction = () => {
    if (!mounted.current) return;
    setActive(false);
  };

  return (
    <Card.Actions style={{ justifyContent: full ? 'space-around' : undefined }}>
      <Button
        disabled={active}
        color="red"
        onPress={() => {
          setActive(true);
          rejectAction().finally(finishAction);
        }}
      >
        Reject
      </Button>
      <Button
        disabled={active}
        onPress={() => {
          setActive(true);
          acceptAction().finally(finishAction);
        }}
      >
        Accept
      </Button>
    </Card.Actions>
  );
};

const NotificationContent = ({ content, loading }) => (
  <Card.Content>
    { loading
      ? <ActivityIndicator />
      : content }
  </Card.Content>
);

export const Invitation = ({ invitation, full = false }) => {
  const mounted = useRef(false);
  const { state, dispatch } = useContext(store);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    mounted.current = true;
    getUsersInfo({ state, dispatch }, invitation.from_id).then((users) => {
      if (!mounted.current) return;
      setUser(users[0]);
    });
    getGroupInfo({ state, dispatch }, invitation.group_id).then((groupInfo) => {
      if (!mounted.current) return;
      setGroup(groupInfo);
    });
    return () => { mounted.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitation.from_id, invitation.group_id]);

  return (
    <Card style={full ? styles.full : styles.small}>
      {(full && user && group) ? <Card.Title title={`${user.name} invites you to join ${group.name}`} />
        : (
          <NotificationContent
            loading={!user || !group}
            content={(user && group) ? (
              <Paragraph>
                <Subheading>{user.name}</Subheading>
                {'\t'}
                <Caption>invites you to join</Caption>
                {'\n'}
                <Subheading>{group.name}</Subheading>
              </Paragraph>
            ) : null}
          />
        )}
      <NotificationAction
        full={full}
        rejectAction={() => rejectInvitation({ state, dispatch }, group.id)
          .then(() => dispatch({ type: 'REMOVE_INVITATION', groupId: group.id }))}
        acceptAction={() => acceptInvitation({ state, dispatch }, group.id)
          .then(() => dispatch({ type: 'REMOVE_INVITATION', groupId: group.id }))}
      />
    </Card>
  );
};

export const Debt = ({ debt, full = false }) => {
  const mounted = useRef(false);
  const { state, dispatch } = useContext(store);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [image, setImage] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    mounted.current = true;
    getUsersInfo({ state, dispatch }, debt.to_id).then((users) => {
      if (!mounted.current) return;
      setUser(users[0]);
    });
    getGroupInfo({ state, dispatch }, debt.group_id).then((groupInfo) => {
      if (!mounted.current) return;
      setGroup(groupInfo);
    });
    if (full && debt.image_id) {
      getImagesInfo({ state, dispatch }, debt.image_id).then(([response]) => {
        if (!mounted.current) return;
        Image.getSize(response.image_url, (width, height) => {
          setImageSize({ width, height });
          setImage(response);
        });
      });
    }
    return () => { mounted.current = false; };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [debt.to_id, state, full, debt.image_id, debt.group_id]);

  const request = (debt.debt_type === 0) ? 'wants you to pay' : 'wants you to confirm they transferred';

  return (
    <Card style={full ? styles.full : styles.small}>
      <Caption style={styles.groupName}>{group && group.name}</Caption>
      {full && user && <Card.Title multiline titleNumberOfLines={3} title={`${user.name} ${request} ${formatAmount(debt.amount)}`} />}
      <NotificationContent
        loading={!user || !group}
        content={(user && group) ? (
          <>
            {full ? (
              <>
                <Paragraph margin={5}>
                  {debt.description}
                </Paragraph>
                {image
                && !imageVisible
                && <Button onPress={() => setImageVisible(true)}>Show image</Button>}
                {image && imageVisible && (
                <>
                  <Image
                    style={{ width: '100%', height: undefined, aspectRatio: imageSize.width / imageSize.height || 0 }}
                    source={{ uri: image.image_url }}
                  />
                  <Button onPress={() => setImageVisible(false)}>Hide image</Button>
                </>
                )}
              </>
            )
              : (
                <Paragraph>
                  <Subheading>{user.name}</Subheading>
                  {'\t'}
                  <Caption>{request}</Caption>
                  {'\n'}
                  <Subheading>{formatAmount(debt.amount)}</Subheading>
                </Paragraph>
              )}
          </>
        ) : null}
      />
      <NotificationAction
        full={full}
        rejectAction={() => rejectDebt({ state, dispatch }, debt.id)
          .then(() => dispatch({ type: 'REMOVE_DEBT', debtId: debt.id }))}
        acceptAction={() => acceptDebt({ state, dispatch }, debt.id)
          .then(() => dispatch({ type: 'REMOVE_DEBT', debtId: debt.id }))}
      />
    </Card>
  );
};

export const Notification = (
  {
    item,
    full = false
  }
) => (item.kind === 'invitation'
  ? <Invitation invitation={item} full={full} />
  : <Debt debt={item} full={full} />);

const styles = StyleSheet.create({
  full: {
    margin: 10,
    backgroundColor: 'rgba(230, 230, 230, 0.9)'
  },
  small: {
    margin: 5
  },
  groupName: {
    margin: 10,
    fontStyle: 'italic'
  }
});

export default Notification;
