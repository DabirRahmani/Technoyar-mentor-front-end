import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const PostMessage = ({ responseCaller, receiver, message }) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      responseCaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .post(
          "/parent/postmessage/",
          { receiver: receiver, message: message },
          config
        )
        .then((e) => {
          if (e.status === 200) {
            responseCaller({ status: 200, response: e.data });
          }
        })
        .catch(() => responseCaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default PostMessage;
