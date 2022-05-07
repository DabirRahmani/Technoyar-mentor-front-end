import React from "react";
import { View, StyleSheet, Image } from "react-native";
import MainScreen from "../screens/mainScreen";

const MainLoading = (props) => {
  return (
    <MainScreen>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={require("./../assets/smallloading.gif")} />
      </View>
    </MainScreen>
  );
};

export default MainLoading;
