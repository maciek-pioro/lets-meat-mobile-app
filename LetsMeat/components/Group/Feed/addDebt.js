import React, { useContext, useState } from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  ActivityIndicator,
  Button, TextInput
} from 'react-native-paper';
import { MAX_DEBT_DESCRIPTION_LENGTH } from '../../../constants';
import { isAmountValid, parseAmount } from '../../../helpers/money';
import { BackgroundContainer } from '../../Background';
import { createImageDebt, updateImageDebt } from '../../Requests';
import { store } from '../../Store';

const AddDebt = ({ navigation, route }) => {
  const { state, dispatch } = useContext(store);
  const { imageId, debt } = route.params;

  const [amount, setAmount] = useState(debt ? `${debt.amount / 100}` : '');
  const [description, setDescription] = useState(debt ? `${debt.description}` : '');
  const [adding, setAdding] = useState(false);

  const valid = isAmountValid(amount) && description.length <= MAX_DEBT_DESCRIPTION_LENGTH;

  const reloadDebts = () => dispatch({ type: 'SET_EVENT', payload: { ...state.event, images: [...state.event.images] } });

  const pressAddDebt = () => {
    setAdding(true);
    if (debt) {
      updateImageDebt({ state, dispatch },
        { ...debt, amount: parseAmount(amount), description }).then(() => {
        reloadDebts();
        navigation.goBack();
      }).catch(() => setAdding(false));
    } else {
      createImageDebt({ state, dispatch }, parseAmount(amount), description, imageId).then(() => {
        reloadDebts();
        navigation.goBack();
      }).catch(() => setAdding(false));
    }
  };

  return (
    <BackgroundContainer backgroundVariant="money">
      <TextInput
        mode="outlined"
        label="Amount"
        style={styles.input}
        value={`${amount}`}
        onChangeText={setAmount}
        placeholder="10,25"
        keyboardType="numeric"
        error={amount && !isAmountValid(amount)}
      />
      <TextInput
        mode="outlined"
        label="Description"
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text.slice(0, MAX_DEBT_DESCRIPTION_LENGTH))}
        placeholder="Thank you for all the fish"
      />
      { adding ? <ActivityIndicator /> : (
        <Button
          mode="contained"
          style={styles.button}
          onPress={pressAddDebt}
          disabled={!valid}
        >
          Add Debt
        </Button>
      )}
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10
  },
  input: {
    margin: 10
  }
});

export default AddDebt;
