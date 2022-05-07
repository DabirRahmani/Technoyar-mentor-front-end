import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import PostPenalyRequest from "../backend/postPenaltyRequest";
import MainBox from "../components/MainBox";
import { LargeMainButton, MeduimMainButton } from "../components/MainButtons";
import MainTexts from "../components/MainTexts";
import MainTimePicker from "../components/MainTimePicker";
import { colors } from "../configs";
import MainScreen from "./mainScreen";
import MainLoading from "./../components/MainLoading";
import MainSnack from "../components/MainSnack";
import ShowPenaltyHistoryScreen from "./showPenaltyHistoryScreen";

const EnterPenaltyCard = ({ id, username, fname, lname, submitlogin }) => {
  const [modalStatus, setModalStatus] = useState(false);

  const [comment, setComment] = useState("");

  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackStatus, setSnackStatus] = useState("none");

  const SubmitPenalty = () => {
    if (comment !== "" && amount !== "") {
      setLoading(true); //باید فالس بشه بعدش
      //اینجا پست بشه به بک
      // بعد پست شدن لودینگ تموم بشه
      //اپدیت اسکرین اصلی انجام بشه

      PostPenalyRequest({
        datacaller: PostPenaltyCallback,
        reportid: id,
        comment: comment,
        amount: amount,
      });
    }
  };

  const PostPenaltyCallback = (data) => {
    if (data.err) {
      //refresh err
    } else {
      if (data === "error") {
        setSnackStatus("error");
      } else {
        if (data.status === 200) {
          setLoading(false);
          setComment("");
          setAmount("");
          setSnackStatus("success");
        }
      }
    }
  };

  const CreateSubmitButton = () => {
    return (
      <MeduimMainButton title="افزودن" onPress={() => setModalStatus(true)} />
    );
  };

  const CloseSnack = (r) => {
    if (!r) {
      setSnackStatus("none");
    }
  };

  const CreateInputs = () => {
    if (snackStatus === "error") {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <MainSnack
            warning
            status
            setter={CloseSnack}
            title="خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید."
          />
        </View>
      );
    }
    if (snackStatus === "success") {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <MainSnack
            setter={CloseSnack}
            status
            success
            title="آیتم پرداختی با موفقیت افزوده شد."
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <TextInput
          value={comment}
          onChangeText={(t) => setComment(t)}
          style={{
            borderColor: colors.titlePrimary,
            borderWidth: 1,
            borderRadius: 8,
            color: colors.titlePrimary,
            fontSize: 16,
            paddingHorizontal: 8,
            paddingVertical: 4,
            maxHeight: 84,
            backgroundColor: colors.background,
          }}
          placeholder="توضیحات مربوط به آیتم پرداختی"
          placeholderTextColor={colors.darkgrayiconsitems}
          numberOfLines={4}
          multiline
          textAlign="right"
        />

        <TextInput
          value={amount}
          onChangeText={(t) => {
            if (!isNaN(+t))
              if (+t > 0) setAmount((+t).toString());
              else setAmount("");
          }}
          style={{
            borderColor: colors.titlePrimary,
            borderWidth: 1,
            borderRadius: 8,
            color: colors.titlePrimary,
            fontSize: 16,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: colors.background,

            maxHeight: 84,
            marginTop: 16,
          }}
          placeholder="مبلغ آیتم"
          placeholderTextColor={colors.darkgrayiconsitems}
          numberOfLines={1}
          textAlign="right"
          keyboardType="number-pad"
          selectTextOnFocus
        />
      </View>
    );
  };

  const CreateTimePicker = () => {
    if (loading) return <MainLoading />;

    return (
      <MainBox>
        {CreateInputs()}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <MeduimMainButton onPress={() => SubmitPenalty()} title="تایید" />
          </View>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <MeduimMainButton
              backgroundColor={colors.darkgrayiconsitems}
              title="لغو"
              onPress={() => {
                setSnackStatus("none");
                setModalStatus(false);
              }}
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
          <View style={{ width: "80%", height: 200 }}>
            {CreateTimePicker()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PenaltyScreen = (props) => {
  const [historyModalStatus, setHistoryModalStatus] = useState(false);
  const nnavigator = useNavigation();

  const todayReports = useRoute().params.todayreports;

  const CreateHistory = () => {
    if (historyModalStatus)
      return (
        <Modal
          visible
          animationType="slide"
          onRequestClose={() => {
            setHistoryModalStatus(false);
          }}
          statusBarTranslucent
        >
          <ShowPenaltyHistoryScreen
            close={() => setHistoryModalStatus(false)}
          />
        </Modal>
      );
  };

  return (
    <MainScreen>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
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

        <View
          style={{
            marginRight: 32,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ marginHorizontal: 8 }}>
            <MeduimMainButton
              onPress={() => {
                setHistoryModalStatus(true);
              }}
              title="  مشاهده تاریخچه  "
            />
          </View>
          <MainTexts.MainTitleTexts title="مدیریت پرداخت‌ها" />
        </View>
      </View>

      <ScrollView>
        {todayReports.map((r) => (
          <EnterPenaltyCard
            id={r.id}
            key={r.id}
            lname={r.student.last_name}
            fname={r.student.first_name}
            username={r.student.username}
          />
        ))}
        <View
          style={{
            height: 24,
          }}
        ></View>
      </ScrollView>

      {CreateHistory()}
    </MainScreen>
  );
};

export default PenaltyScreen;
