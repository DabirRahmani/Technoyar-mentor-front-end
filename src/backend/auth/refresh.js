import React from "react";
import MainAxios from "../MainAxios";
import * as SecureStore from "expo-secure-store";
import { View, StyleSheet } from "react-native";

const RefreshRequest = ({ calllerFunction }) => {
  SecureStore.getItemAsync("refresh").then((refresh) => {
    MainAxios()
      .post("account/login/refresh/", { refresh: refresh })
      .then((e) => {
        SecureStore.setItemAsync("token", e.data.access).then(() => {
          calllerFunction({ token: e.data.access });
        });
      })
      .catch(() => calllerFunction({ err: true }));
  });
};

export default RefreshRequest;
