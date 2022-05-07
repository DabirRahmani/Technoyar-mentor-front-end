import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import RefreshRequest from "../backend/auth/refresh";
import MainScreen from "../screens/mainScreen";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/core";

const LoadingScreen = (props) => {
  const nnavigator = useNavigation();

  const tokenGenerator = ({ err }) => {
    if (err) {
      nnavigator.replace("login");
    } else {
      nnavigator.replace("home");
    }
  };

  useEffect(() => {
    SecureStore.getItemAsync("token").then((e) => {
      if (e !== undefined && e !== null) {
        SecureStore.getItemAsync("refresh").then((e) => {
          if (e !== undefined && e !== null) {
            RefreshRequest({ calllerFunction: tokenGenerator });
          } else {
            nnavigator.replace("login");
          }
        });
      } else {
        nnavigator.replace("login");
      }
    });
  }, []);

  return (
    <MainScreen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("./../assets/smallloading.gif")} />
      </View>
    </MainScreen>
  );
};

export default LoadingScreen;
