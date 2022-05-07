import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const AllPenaltyRequest = ({ datacaller }) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .get("/mentors/get_all_penalty", config)
        .then((e) => {
          datacaller(e.data);
        })
        .catch(() => datacaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default AllPenaltyRequest;
