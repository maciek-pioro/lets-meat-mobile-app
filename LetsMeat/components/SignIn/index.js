import React, { useContext, useState } from 'react';
import {
  GoogleSignin, GoogleSigninButton,
  statusCodes
} from '@react-native-community/google-signin';
import {
  StyleSheet, Text, View, ToastAndroid
} from 'react-native';
import { appendAPIToken, appendUserID } from '../Requests';
import { store } from '../Store';
import { BackgroundContainer } from '../Background';

function SignInScreen() {
  const { dispatch } = useContext(store);
  const [signingIn, setSigningIn] = useState(false);

  const setUser = (userInfo) => appendAPIToken(userInfo)
    .then(appendUserID)
    .then((user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });

  const signIn = async () => {
    setSigningIn(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show('Upgrade or install Play Services to sign in', ToastAndroid.SHORT);
      } else if (error.code !== statusCodes.IN_PROGRESS
        && error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastAndroid.show('An unexpected error occurred', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <BackgroundContainer>
      <View
        style={styles.container}
      >
        <Text style={styles.title}>Let&apos;s meat</Text>
        <GoogleSigninButton
          style={styles.button}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          disabled={signingIn}
        />
      </View>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    margin: 50,
    color: 'black',
    textShadowColor: 'white',
    textShadowRadius: 5
  },
  button: {
    width: 200,
    height: 50
  }
});

export default SignInScreen;
