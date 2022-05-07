import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const UpdateReportRequest = ({ datacaller, id, data }) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .put("/mentors/reportupdate/", { ...data, id: id }, config)
        .then((e) => {
          datacaller(e);
        })
        .catch((e) => datacaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default UpdateReportRequest;
