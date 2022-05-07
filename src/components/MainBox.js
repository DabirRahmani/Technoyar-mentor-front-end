import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../configs";

const MainBox = (probs) => {
  return <View style={styles.container}>{probs.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: colors.lightLayerBackGround,
    padding: 8,
    flex: 1,
  },
});

export default MainBox;
