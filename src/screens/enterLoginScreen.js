import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Modal } from "react-native";
import MainScreen from "./mainScreen";
import MainTexts from "../components/MainTexts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../configs";
import { useNavigation, useRoute } from "@react-navigation/core";
import MainLoading from "../components/MainLoading";
import TodayReportsRequest from "../backend/todayReportsRequest";
import MainBox from "../components/MainBox";
import { MeduimMainButton } from "../components/MainButtons";
import MainTimePicker from "../components/MainTimePicker";
import EnterLoginRequest from "../backend/enterLoginRequest";

const EnterLoginCard = ({ id, username, fname, lname, report }) => {
  const [modalStatus, setModalStatus] = useState(false);

  const [logintime, setLoginTime] = useState("00:00:00");

  const [loading, setLoading] = useState(false);

  const SubmitLoginTime = () => {
    setLoading(true);
    //اپدیت اسکرین اصلی انجام بشه

    EnterLoginRequest({
      datacaller: (data) => {
        setLoading(false);
        if (data.err) {
        } else if (data === "error") {
        } else if (data.data.code === 200) {
          report.enterTime = logintime;
          setModalStatus(false);
        }
      },
      time: logintime,
      id: id,
    });
  };

  const CreateSubmitButton = () => {
    if (
      report.enterTime !== "" &&
      report.enterTime !== undefined &&
      report.enterTime !== null
    )
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <MainTexts.MainContextSubTexts title={report.enterTime} />
        </View>
      );

    return (
      <MeduimMainButton title="ثبت ورود" onPress={() => setModalStatus(true)} />
    );
  };

  const CreateTimePicker = () => {
    if (loading) return <MainLoading />;

    return (
      <MainBox>
        <View style={{ flex: 1 }}>
          <MainTimePicker defaultTime={0} returnTimeSetter={setLoginTime} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <MeduimMainButton onPress={() => SubmitLoginTime()} title="تایید" />
          </View>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <MeduimMainButton
              backgroundColor={colors.darkgrayiconsitems}
              title="لغو"
              onPress={() => setModalStatus(false)}
            />
          </View>
        </View>
      </MainBox>
    );
  };

  return (
    <View style={{ marginHorizontal: 24, marginVertical: 8 }}>
      <MainBox>
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 4,
          }}
        >
          <View>
            <MainTexts.MainContextSubTexts title={username} />
          </View>
          <View
            style={{
              flex: 2,
              alignItems: "center",
              paddingHorizontal: 8,
              justifyContent: "center",
            }}
          >
            <MainTexts.MainContextSubTexts
              title={fname + lname !== "" ? fname + " " + lname : ""}
            />
          </View>
          <View style={{ flex: 1 }}>{CreateSubmitButton()}</View>
        </View>
      </MainBox>

      <Modal
        transparent={true}
        visible={modalStatus}
        animationType="fade"
        onRequestClose={() => {
          setModalStatus(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%", height: 150 }}>
            {CreateTimePicker()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const EnterLoginScreen = (props) => {
  const [render, setrender] = useState(0);
  const reRender = () => setrender(render + +1);

  const nnavigator = useNavigation();

  const todayReports = useRoute().params.todayreports;

  return (
    <MainScreen>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            nnavigator.pop();
          }}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color={colors.titlePrimary}
          />
          <MainTexts.MainTitleTexts title="بازگشت" />
        </TouchableOpacity>

        <View style={{ marginRight: 32 }}>
          <MainTexts.MainTitleTexts title="ثبت ورود کاربران" />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView>
          {todayReports.map((r) => (
            <EnterLoginCard
              key={r.id}
              id={r.id}
              username={r.student.username}
              fname={r.student.first_name}
              lname={r.student.last_name}
              logedintime={r.enterTime}
              report={r}
            />
          ))}
        </ScrollView>
      </View>
    </MainScreen>
  );
};

export default EnterLoginScreen;
