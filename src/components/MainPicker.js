import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Modal, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../configs";
import MainScreen from "../screens/mainScreen";
import MainTexts from "./MainTexts";

const MainPicker = ({ visibalityStatus, changeStatus, dataView }) => {
  return (
    <Modal
      statusBarTranslucent={true}
      visible={visibalityStatus}
      animationType="slide"
      onRequestClose={() => {
        changeStatus(false);
      }}
    >
      <MainScreen>
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
          <View
            style={{
              marginBottom: 8,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                changeStatus(false);
              }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color={colors.titlePrimary}
              />
              <MainTexts.MainTitleTexts title="بازگشت" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ marginTop: 8, paddingHorizontal: 32 }}>
            {dataView()}
          </ScrollView>
        </View>
      </MainScreen>
    </Modal>
  );
};

export default MainPicker;
