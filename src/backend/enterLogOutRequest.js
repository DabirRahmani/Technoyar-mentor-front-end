import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const EnterLogOutRequest = ({ datacaller, time, id }) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .put("/mentors/reportupdate/", { exitTime: time, id: id }, config)
        .then((e) => {
          datacaller(e);
        })
        .catch((e) => datacaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default EnterLogOutRequest;
