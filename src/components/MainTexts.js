import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../configs";

const MainTitleTexts = ({ title }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const MainSecondTitleTexts = ({ title }) => {
  return <Text style={styles.sectitle}>{title}</Text>;
};

const MainContextSubTexts = ({ title }) => {
  return <Text style={styles.sub}>{title}</Text>;
};

const MainSecoonderyContextSubTexts = ({ title }) => {
  return <Text style={styles.secsub}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: colors.titlePrimary,
    fontWeight: "bold",
  },
  sectitle: {
    fontSize: 16,
    color: colors.titlePrimary,
    fontWeight: "bold",
  },
  sub: {
    fontSize: 16,
    color: colors.contextSecondery,
  },
  secsub: {
    fontSize: 14,
    color: colors.contextSecondery,
  },
});

export default {
  MainTitleTexts,
  MainContextSubTexts,
  MainSecondTitleTexts,
  MainSecoonderyContextSubTexts,
};
