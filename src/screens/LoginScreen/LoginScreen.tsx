import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import * as Facebook from "expo-facebook";
import firebase from "firebase";
import Constants from "expo-constants";
import { AuthContext } from "../../context/Auth";

export const LoginScreen = () => {
  const { appId, appName } = Constants.manifest.extra.facebook;
  const [error, setError] = useState<string>("");
  const { setFirebaseUser } = useContext(AuthContext);

  Facebook.initializeAsync(appId, appName);

  const signInWithFacebook = async () => {
    try {
      await signInWithOAuthCredential(await getFirebaseOAuthCredential());
    } catch (e) {
      setError(e.message);
    }
  };

  const signInWithOAuthCredential = async (
    credential: firebase.auth.OAuthCredential
  ) => {
    const {
      user,
    } = await firebase.auth().signInWithCredential(credential);

    setFirebaseUser(user);
  };

  const getFirebaseOAuthCredential = async (): Promise<firebase.auth.OAuthCredential> => {
    const options = {
      permissions: ["public_profile", "email", "user_friends"]
    };
    // @ts-ignore
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      options
    );

    if (type === "success") {
      return firebase.auth.FacebookAuthProvider.credential(token);
    } else {
      throw new Error("Failed");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button icon="facebook" mode="contained" onPress={signInWithFacebook}>
        Sign In With Facebook
      </Button>

      <Snackbar visible={!!error.length} onDismiss={() => setError("")}>
        {error}
      </Snackbar>
    </View>
  );
};