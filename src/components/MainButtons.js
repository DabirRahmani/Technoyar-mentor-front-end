import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { colors } from "../configs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MainButton = ({
  onPress,
  title,
  size,
  disable,
  backgroundColor = colors.complementBoldThird,
}) => {
  var op = 1;
  if (disable === true) {
    op = 0.5;
  }

  var underlayColor = colors.complementBoldThirdOnPressEffect;

  if (backgroundColor === colors.danger) {
    underlayColor = "#fa5757";
  }
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        borderRadius: size,
        overflow: "hidden",
        opacity: op,
      }}
    >
      <TouchableHighlight
        underlayColor={underlayColor}
        activeOpacity={1}
        disabled={disable}
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.titlePrimary,
              fontSize: size * 2,
              textTransform: "uppercase",
              textAlign: "center",
              fontWeight: "900",
              opacity: op,
              padding: 2,
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const SmallMainButton = ({ title, onPress, disable, backgroundColor }) => (
  <MainButton
    title={title}
    backgroundColor={backgroundColor}
    onPress={onPress}
    disable={disable}
    size={6}
  />
);

const MeduimMainButton = ({ title, onPress, disable, backgroundColor }) => {
  return (
    <MainButton
      title={title}
      onPress={onPress}
      disable={disable}
      size={8}
      backgroundColor={backgroundColor}
    />
  );
};

const LargeMainButton = ({ title, onPress, disable, backgroundColor }) => (
  <MainButton
    backgroundColor={backgroundColor}
    title={title}
    onPress={onPress}
    disable={disable}
    size={10}
  />
);

const MainIconButton = ({
  onPress,
  disable,
  name,
  size = 70,
  iconSize = 50,
  transParent,
}) => {
  var op = 1;
  if (disable === true) {
    op = 0.5;
  }

  var backgroundColor = "";
  if (transParent !== true) {
    backgroundColor = colors.complementBoldThird;
  }
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        borderRadius: size / 2,
        overflow: "hidden",
        width: size,
        height: size,
        opacity: op,
      }}
    >
      <TouchableHighlight
        underlayColor={colors.complementBoldThirdOnPressEffect}
        activeOpacity={1}
        disabled={disable}
        onPress={onPress}
        style={{
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name={name}
          size={iconSize}
          color={colors.titlePrimary}
        />
      </TouchableHighlight>
    </View>
  );
};

const MainMenuButton = ({
  onPress,
  title,
  disable,
  iconname,
  complement,
  square,
}) => {
  var op = 1;
  if (disable === true) {
    op = 0.5;
  }

  var underlayColor = colors.complementBoldThirdOnPressEffect;

  var backgroundColor = colors.complementBoldThird;

  var size = 12;

  var flexdir = "row";

  var height = size * 4;

  if (square === true) {
    flexdir = "column";
    height = size * 8;
  }

  return (
    <TouchableHighlight
      underlayColor={underlayColor}
      activeOpacity={1}
      disabled={disable}
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        borderRadius: size,
        overflow: "hidden",
        opacity: op,
        flexDirection: "row",
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: flexdir,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.titlePrimary,
            fontSize: size * 2,
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: "900",
            opacity: op,
          }}
        >
          {title}
        </Text>

        {square === true ? <View style={{ padding: 4 }}></View> : <View></View>}

        <MaterialCommunityIcons
          name={iconname}
          size={size * 2}
          color={colors.titlePrimary}
          style={{ marginHorizontal: 4 }}
        />
      </View>
    </TouchableHighlight>
  );
};

export {
  SmallMainButton,
  MeduimMainButton,
  LargeMainButton,
  MainIconButton,
  MainMenuButton,
};
