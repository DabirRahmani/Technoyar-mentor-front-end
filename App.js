import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";

import { Image, View } from "react-native";
import LoginScreen from "./src/screens/loginScreen";
import { I18nManager } from "react-native";
import RefreshRequest from "./src/backend/auth/refresh";
import MainScreen from "./src/screens/mainScreen";
import HomeScreen from "./src/screens/homeScreen";
import EnterLoginScreen from "./src/screens/enterLoginScreen";
import { stackAnimation } from "./src/configs";
import EnterLogoutScreen from "./src/screens/enterLogoutScreen";
import MainLoading from "./src/components/MainLoading";
import LoadingScreen from "./src/screens/loadingScreen";
import ReportScreen from "./src/screens/reportScreen";
import PenaltyScreen from "./src/screens/penaltyScreen";
import ExamScreen from "./src/screens/examScreen";
import ExplainsScreen from "./src/screens/explainsScreen";

export default function App() {
  try {
    I18nManager.allowRTL(false);
  } catch (e) {}

  const sstack = createStackNavigator();

  return (
    <NavigationContainer theme={DarkTheme}>
      <sstack.Navigator
        initialRouteName={"loader"}
        screenOptions={{ headerMode: "none" }}
      >
        <sstack.Screen name="loader" component={LoadingScreen} />
        <sstack.Screen
          name="home"
          options={{
            detachPreviousScreen: true,
          }}
          component={HomeScreen}
        />
        <sstack.Screen name="login" component={LoginScreen} />
        <sstack.Screen
          name="enterlogin"
          options={{
            detachPreviousScreen: false,
          }}
          component={EnterLoginScreen}
        />
        <sstack.Screen
          name="enterlogout"
          options={{
            detachPreviousScreen: false,
          }}
          component={EnterLogoutScreen}
        />
        <sstack.Screen
          name="penalty"
          options={{
            detachPreviousScreen: false,
          }}
          component={PenaltyScreen}
        />

        <sstack.Screen
          name="exam"
          options={{
            detachPreviousScreen: false,
          }}
          component={ExamScreen}
        />

        <sstack.Screen
          name="explain"
          options={{
            detachPreviousScreen: false,
          }}
          component={ExplainsScreen}
        />
      </sstack.Navigator>
    </NavigationContainer>
  );
}
