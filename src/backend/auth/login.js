import MainAxios from "../MainAxios";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";

const LoginRequest = ({ username, password, setter, loginBtnStatus }) => {
  MainAxios()
    .post("account/login/", {
      username: username,
      password: password,
    })
    .then((e) => {
      if (e.status === 200) {
        SecureStore.setItemAsync("token", e.data.access).then(() => {
          SecureStore.setItemAsync("refresh", e.data.refresh).then(
            () => {
              setter("1");
            } // loged in seccessfuly
          );
        });
      } else {
        setter("2");
        loginBtnStatus(false);
      } // sth went wrong
    })
    .catch((e) => {
      if (e.response !== undefined) {
        setter("3"); //wrong inputs
        loginBtnStatus(false);
      } else {
        setter("4"); // unable to connect to server
        loginBtnStatus(false);
      }
    });
};

export default LoginRequest;
