import React from "react";
import { View } from "react-native";
import { colors } from "../configs";
import { MainIconButton } from "./MainButtons";
import MainTexts from "./MainTexts";

const MainSnack = ({
  danger,
  info,
  success,
  warning,
  title,
  status,
  setter,
}) => {
  if (!status) {
    return <View style={{ flex: 0 }}></View>;
  }

  var backgroundColor = colors.info;

  if (danger) {
    backgroundColor = colors.danger;
  } else if (success) {
    backgroundColor = colors.succuss;
  } else if (warning) {
    backgroundColor = colors.warning;
  }

  return (
    <View
      style={{
        borderRadius: 8,
        backgroundColor: backgroundColor,
        padding: 8,
        alignItems: "center",
        position: "absolute",
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "space-between",
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainTexts.MainContextSubTexts title={title} />
        </View>
        <View
          style={{
            width: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainIconButton
            onPress={() => setter(false)}
            name="close"
            iconSize={24}
            size={32}
            transParent
          />
        </View>
      </View>
    </View>
  );
};

export default MainSnack;
