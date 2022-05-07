import { Easing } from "react-native";

const colors = {
  background: "#0e1621",
  lightLayerBackGround: "#182533",
  titlePrimary: "#f5f5f5",
  contextSecondery: "#e9e8e3",

  complementBoldThird: "#276899",
  complementBoldThirdOnPressEffect: "#497799",

  darkgrayiconsitems: "#6b7781",

  danger: "#ff4040",
  info: "#62b1f6",
  succuss: "#22bb33",
  warning: "#ff972f",
};

const stackAnimation = {
  animation: "timing",
  config: {
    duration: 100,
    easing: Easing.sin,
  },
};

export { colors, stackAnimation };
