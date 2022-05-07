import React from "react";
import { View, StyleSheet } from "react-native";
import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const CreateُStudentAndParentRequest = ({
  datacaller,
  password,
  studentfirstname,
  studentlastname,
  parentlastname,
  parentfirstname,
  parentphonenumber,
  studentphonenumber,
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
            role: 2,
            first_name: parentfirstname,
            last_name: parentlastname,
            phoneNumber: parentphonenumber,
          },
          config
        )
        .then((e) => {
          if (e.status === 200) {
            MainAxios()
              .post(
                "/account/users/",
                {
                  password: password,
                  password_confirmation: password,
                  role: 1,
                  first_name: studentfirstname,
                  last_name: studentlastname,
                  phoneNumber: studentphonenumber,
                  parent: e.data.username,
                },
                config
              )
              .then((t) => {
                if (t.status === 200) {
                  datacaller({ student: t.data, parent: e.data });
                } else datacaller("error");
              })
              .catch(() => datacaller("error"));
          } else datacaller("error");
        })
        .catch((e) => datacaller("error"));
      //درخواست چک کردن اینترنت
    }
  };
  RefreshRequest({ calllerFunction: tokenGenerator });
};

export default CreateُStudentAndParentRequest;
