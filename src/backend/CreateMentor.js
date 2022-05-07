import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const CreateMentorRequest = ({
  datacaller,
  password,
  mentorfirstname,
  mentorlastname,
  mentorphonenumber,
}) => {
  const tokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .post(
          "/account/users/",
          {
            password: password,
            password_confirmation: password,
            role: 3,
            first_name: mentorfirstname,
            last_name: mentorlastname,
            phoneNumber: mentorphonenumber,
          },
          config
        )
        .then((e) => {
          if (e.status === 200) {
            datacaller(e.data);
          } else datacaller("error");
        })
        .catch((e) => datacaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default CreateMentorRequest;
