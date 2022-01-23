import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image, StyleSheet, View, ToastAndroid
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  ActivityIndicator, Button, Card, Paragraph
} from 'react-native-paper';
import { formatAmount } from '../../../helpers/money';
import {
  addDebt, deleteImage, deleteImageDebt, getEventDebts, getImagesInfo,
  getUsersInfo, uploadImage
} from '../../Requests';
import { store } from '../../Store';
import { UserPicker } from '../../User';

const reloadDebts = (state, dispatch) => { dispatch({ type: 'SET_EVENT', payload: { ...state.event, images: [...state.event.images] } }); };

const Debt = ({
  image, debt, users, navigation
}) => {
  const { state, dispatch } = useContext(store);
  const [visible, setVisible] = useState(true);
  const [userPickerOpen, setUserPickerOpen] = useState(false);
  let assignedUser;
  if (debt.pending_debt) {
    assignedUser = users.find((u) => u.id === debt.pending_debt.from_id);
  }

  const owner = image.uploaded_by === state.user.id;

  return (
    visible ? (
      <>
        <Card style={styles.debt}>
          <Card.Title
            title={formatAmount(debt.amount)}
            subtitle={
            debt.satisfied
              ? (
                assignedUser ? `This debt has been accepted by ${assignedUser.name}`
                  : 'Someone agreed to pay for this'
              )
              : (assignedUser
                ? (assignedUser && `This debt is assigned to ${assignedUser.name}`)
                : 'No one has claimed this debt yet')
          }
          />
          <Card.Content>
            <Paragraph>
              {debt.description}
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            {owner ? (
              <>
                <Button
                  onPress={() => setUserPickerOpen(true)}
                >
                  Assign
                </Button>
                <Button
                  onPress={() => {
                    navigation.navigate('AddDebt', { imageId: image.image_id, debt });
                  }}
                >
                  Edit
                </Button>
                <Button
                  color="red"
                  onPress={() => {
                    deleteImageDebt({ state, dispatch }, debt.id)
                      .then(() => { setVisible(false); });
                  }}
                >
                  Delete
                </Button>
              </>
            ) : (
              !debt.satisfied
              && (!debt.pending_debt || debt.pending_debt.from_id) !== state.user.id
              && (
              <Button
                onPress={() => {
                  addDebt({ state, dispatch },
                    state.group.id, state.event.id,
                    state.user.id, image.uploaded_by,
                    null, null, debt.id, 0).then(
                    () => reloadDebts(state, dispatch)
                  );
                }}
              >
                Claim
              </Button>
              )
            )}
          </Card.Actions>
        </Card>
        <UserPicker
          userIds={state.group.users.map((u) => u.id).filter((id) => id !== state.user.id)}
          dialogVisible={userPickerOpen}
          onDismiss={() => setUserPickerOpen(false)}
          setUser={(newUser) => {
            addDebt({ state, dispatch },
              state.group.id, state.event.id, newUser.id, state.user.id, null, null, debt.id, 0)
              .then(() => reloadDebts(state, dispatch));
          }}
        />
      </>
    ) : null);
};

const DebtImage = ({
  image, users, debts, navigation, setDebts, setImages, containerStyle
}) => {
  const { state, dispatch } = useContext(store);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      Image.getSize(image.image_url, (width, height) => {
        setImageSize({ width, height });
      });
    } catch (error) {
      setImageSize({ width: 0, height: 0 });
    }
  }, [image.image_url]);

  return (
    <Card style={containerStyle}>
      <Card.Content>
        {visible
          ? (
            <>
              <Image
                style={{
                  width: '100%',
                  height: undefined,
                  aspectRatio: imageSize.width / imageSize.height || 0
                }}
                source={{ uri: image.image_url }}
              />
              <Button onPress={() => setVisible(false)}>Hide Image</Button>
            </>
          ) : <Button onPress={() => setVisible(true)}>Show Image</Button>}
      </Card.Content>
      <Card.Content>
        {(debts.filter((d) => d.image_id === image.image_id))
          .map((d) => (
            <Debt
              key={d.id}
              debt={d}
              image={image}
              setImages={setImages}
              users={users}
              navigation={navigation}
              setDebts={setDebts}
            />
          ))}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button onPress={
                () => {
                  navigation.navigate('AddDebt', { eventId: state.event.id, imageId: image.image_id });
                }
              }
        >
          <Icon name="plus" size={25} />
        </Button>
        {
          image.uploaded_by === state.user.id
          && (
          <Button
            onPress={
                  () => {
                    deleteImage({ state, dispatch }, image.image_id).then(() => {
                      dispatch({ type: 'REMOVE_IMAGE', imageId: image.image_id });
                    });
                  }
          }
          >
            <Icon name="delete" size={25} />
          </Button>
          )
        }
      </Card.Actions>
    </Card>
  );
};

const Debts = ({ navigation, containerStyle, debtStyle }) => {
  const { state, dispatch } = useContext(store);
  const [users, setUsers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const [imagesInfo, debtsInfo] = await Promise.all([
        getImagesInfo({ state, dispatch }, state.event.images),
        getEventDebts({ state, dispatch }, state.event.id)]);
      setImages(imagesInfo);
      setDebts(debtsInfo);
      const usersInfo = await getUsersInfo({ state, dispatch }, [
        ...imagesInfo.map((info) => info.uploaded_by),
        ...debtsInfo.filter((debt) => debt.pending_debt).map((debt) => debt.pending_debt.from_id),
        ...debtsInfo.filter((debt) => debt.pending_debt).map((debt) => debt.pending_debt.to_id),
      ]);
      setUsers(usersInfo);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.event.images, state.user.tokenId]);

  return (
    <Card style={containerStyle} elevation={0}>
      <Card.Title title="Debts" />
      { loading ? <ActivityIndicator style={styles.addingLoader} /> : (
        <>
          {images.map((i) => (
            <DebtImage
              key={i.image_id}
              image={i}
              setImages={setImages}
              users={users}
              debts={debts}
              setDebts={setDebts}
              navigation={navigation}
              containerStyle={debtStyle}
            />
          ))}
          <View style={styles.addImage}>
            {adding ? <ActivityIndicator style={styles.addButton} /> : (
              <Button
                style={styles.addButton}
                onPress={
                  () => {
                    launchImageLibrary({
                      title: 'Select a Receipt',

                    }, (response) => {
                      if (response.didCancel) {
                        return;
                      } if (response.error) {
                        ToastAndroid.show('Something went wrong when selecting picture', ToastAndroid.SHORT);
                        return;
                      }
                      setAdding(true);
                      uploadImage({ state, dispatch }, state.event.id, response)
                        .then((r) => dispatch({ type: 'ADD_IMAGE_TO_EVENT', imageId: r.image_id }))
                        .finally(() => setAdding(false));
                    });
                  }
                }
              >
                <Icon name="image-plus" size={25} />
              </Button>
            )}
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginBottom: 10
  },
  debt: {
    margin: 5
  },
  actions: {
    justifyContent: 'space-evenly'
  },
  addingLoader: {
    margin: 30
  },
  addImage: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});

export default Debts;
