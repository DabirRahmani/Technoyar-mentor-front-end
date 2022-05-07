import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import { colors } from "../configs";
import ConvertNumberToTime from "./ConvertNumberToTime";
import MainTexts from "./MainTexts";

const MainTimePicker = ({ returnTimeSetter, defaultTime }) => {
  const [minute, setMinute] = useState(
    ConvertNumberToTime({ number: defaultTime }).toString().split(":")[1]
  );
  const [hour, setHour] = useState(
    ConvertNumberToTime({ number: defaultTime }).toString().split(":")[0]
  );

  useEffect(() => {
    var m = minute;
    var h = hour;
    if (minute.length === 1) m = "0" + m;
    if (minute.length === 0) m = "00";

    if (hour.length === 1) h = "0" + h;
    if (hour.length === 0) h = "00";

    returnTimeSetter(h + ":" + m + ":00");
  }, [minute, hour]);
  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextInput
        style={{
          borderColor: colors.titlePrimary,
          borderWidth: 1,
          fontSize: 32,
          fontWeight: "bold",
          color: colors.titlePrimary,
          paddingHorizontal: 4,
          width: 56,
          borderRadius: 8,
          backgroundColor: colors.background,
          textAlign: "center",
          textAlignVertical: "center",
        }}
        keyboardType="number-pad"
        value={hour}
        selectTextOnFocus
        onChangeText={(e) => {
          if (+e < 24 && e.length < 3) {
            if (e.length === 1) {
              if (!isNaN(+e)) {
                setHour(e);
              }
            }
            if (e.length === 2) {
              if (!isNaN(+e[1])) {
                setHour(e);
              }
            }
            if (e.length === 0) setHour("");
          }
        }}
      />
      <Text style={{ fontSize: 24, color: colors.titlePrimary }}> : </Text>
      <TextInput
        style={{
          borderColor: colors.titlePrimary,
          borderWidth: 1,
          fontSize: 32,
          fontWeight: "bold",
          color: colors.titlePrimary,
          textAlign: "center",
          textAlignVertical: "center",
          paddingHorizontal: 4,
          width: 56,
          borderRadius: 8,
          backgroundColor: colors.background,
        }}
        keyboardType="number-pad"
        selectTextOnFocus
        value={minute}
        onChangeText={(e) => {
          if (+e < 60 && e.length < 3) {
            if (e.length === 1) {
              if (!isNaN(+e)) {
                setMinute(e);
              }
            }
            if (e.length === 2) {
              if (!isNaN(+e[1])) {
                setMinute(e);
              }
            }
            if (e.length === 0) setMinute("");
          }
        }}
      />
    </View>
  );
};

export default MainTimePicker;
