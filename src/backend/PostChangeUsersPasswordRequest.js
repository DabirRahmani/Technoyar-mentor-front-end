import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const PostChangeUsersPasswordRequest = ({ datacaller, username, password }) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .put(
          "/m_admin/admin-change-password/",
          { username: username, new_password: password },
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

export default PostChangeUsersPasswordRequest;
