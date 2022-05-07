import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";
import * as SecureStore from "expo-secure-store";

const SeenMessageRequest = ({ id }) => {
  SecureStore.getItemAsync("token").then((e) => {
    const config = {
      headers: { Authorization: `Bearer ${e}` },
    };

    MainAxios().put("/parent/seenmessages/", { message_id: id }, config);
  });
};

export default SeenMessageRequest;
