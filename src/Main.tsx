import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/Auth";
import { RootNavigator } from "./RootNavigator";
import { LoginScreen } from "./screens/LoginScreen";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
  Theme
} from "react-native-paper";
import firebase from "firebase";
import { PreferencesContext } from "./context/Preferences";

export const Main = () => {
  const { setFirebaseUser, algoliaUser } = useContext(AuthContext);
  const { isDark } = useContext(PreferencesContext);
  const [paperProviderTheme, setPaperProviderTheme] = useState<Theme>(DefaultTheme);

  useEffect(() => {
    if (isDark) {
      setPaperProviderTheme({
        ...DarkTheme,
        colors: { ...DarkTheme.colors, primary: "#1ba1f2", accent: '#ffc107' }
      })
    } else {
      setPaperProviderTheme({
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, primary: "#1ba1f2", accent: '#ffc107' } 
      })
    }
  }, [isDark])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (firebaseUser?: firebase.User) => {
      if (firebaseUser) {
        // Helpful for debugging API calls
        const token = await firebase.auth().currentUser.getIdToken();
        console.log(token);

        setFirebaseUser(firebaseUser);
      } else {
        setFirebaseUser(undefined);
      }
    });
  }, []);

  const isLoggedIn = !!algoliaUser;

  return (
    <PaperProvider theme={paperProviderTheme}>
      {isLoggedIn ? <RootNavigator /> : <LoginScreen />}
    </PaperProvider>
  )
};
