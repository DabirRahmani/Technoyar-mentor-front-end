import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const MakeAdditionalExplains = ({ datacaller, id, additionalExplanation }) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .post(
          "/mentors/make_additional_explanation/",
          { report: id, additionalExplanation: additionalExplanation },
          config
        )
        .then((e) => {
          datacaller(e);
        })
        .catch((e) => datacaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default MakeAdditionalExplains;
