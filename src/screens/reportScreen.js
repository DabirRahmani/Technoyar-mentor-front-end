import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import MainScreen from "./mainScreen";
import MainTexts from "./../components/MainTexts";
import { colors } from "../configs";
import MainBox from "../components/MainBox";
import { MeduimMainButton } from "../components/MainButtons";
import ConvertNumberToTime from "../components/ConvertNumberToTime";
import MainLoading from "../components/MainLoading";
import MainTimePicker from "../components/MainTimePicker";
import UpdateReportRequest from "../backend/updateReportRequet";
import MainSnack from "../components/MainSnack";
import MakeAdditionalExplains from "../backend/makeAddistionalExplans";

const ExpandableCard = ({ report, reload }) => {
  const {
    id,
    student,
    studyTime,
    timeUsedTotorials,
    sleepingTime,
    mostContinuesStudyTime,
    numberOfTests,
  } = report;
  const { first_name, last_name, username } = student;

  const [expanded, setExpanded] = useState(false);

  const [modalStatus, setModalStatus] = useState(false);

  const [modalType, setModalType] = useState(0);

  const [loading, setLoading] = useState(false);

  const [modalTitle, setModalTitle] = useState("");

  const [amount, setAmount] = useState(0);

  const [explains, setExplains] = useState("");

  const [snackStatus, setSnackStatus] = useState(false);

  const submitUpdate = () => {
    var vv = "";
    switch (modalType) {
      case 1:
        vv = "studyTime";
        break;
      case 2:
        vv = "mostContinuesStudyTime";
        break;
      case 3:
        vv = "sleepingTime";
        break;
      case 4:
        vv = "timeUsedTotorials";
        break;
      case 5:
        vv = "numberOfTests";
        break;
      case 6:
        vv = "additionalExplanation";
    }

    setLoading(true);

    if (vv === "additionalExplanation") {
      MakeAdditionalExplains({
        datacaller: (data) => {
          if (data.err) {
            //error
          } else if (data === "error") {
            setSnackStatus(true);
          } else {
            setAmount(0);
            setLoading(false);
            setExplains("");
            setModalType(0);
            setModalStatus(false);

            reload();
          }
        },
        id: id,
        additionalExplanation: explains,
      });
    } else {
      var v = {};

      v[vv] = amount + 0.01;

      setLoading(true);
      UpdateReportRequest({
        datacaller: (data) => {
          setLoading(false);
          if (data.err) {
            //error
          } else if (data === "error") {
            setSnackStatus(true);
          } else {
            report[vv] = amount;
            setAmount(0);
            setExplains("");
            setModalType(0);
            setModalStatus(false);

            reload();
          }
        },
        id: id,
        data: v,
      });
    }
  };

  const CreateModalContents = () => {
    if (loading) return <MainLoading />;

    return (
      <MainBox>
        <View style={{ flex: 1 }}>
          <View style={{ alignSelf: "center", marginTop: 16 }}>
            <MainTexts.MainTitleTexts title={modalTitle} />

            <View style={{ alignSelf: "center" }}>
              <MainTexts.MainSecoonderyContextSubTexts
                title={first_name + " " + last_name}
              />
            </View>
          </View>
          <MainSnack
            warning
            setter={setSnackStatus}
            status={snackStatus}
            title="خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید."
          />

          <View style={{ flex: 1 }}>{CreateModalContentsContents()}</View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, marginHorizontal: 16 }}>
              <MeduimMainButton onPress={submitUpdate} title="ثبت" />
            </View>

            <View style={{ flex: 1, marginHorizontal: 16 }}>
              <MeduimMainButton
                backgroundColor={colors.darkgrayiconsitems}
                title="لغو"
                onPress={() => {
                  setModalStatus(false);
                  setModalTitle(""), setModalType(0);
                }}
              />
            </View>
          </View>
        </View>
      </MainBox>
    );
  };

  const CreateModalContentsContents = () => {
    if (modalType === 6) {
      return (
        <View
          style={{
            flex: 1,
            marginTop: 8,
          }}
        >
          <TextInput
            value={explains}
            onChangeText={(t) => setExplains(t)}
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
            placeholder="توضیحات"
            placeholderTextColor={colors.darkgrayiconsitems}
            numberOfLines={3}
            multiline
            textAlign="right"
          />
        </View>
      );
    }
    if (modalType === 5)
      return (
        <View
          style={{
            alignSelf: "center",
            flex: 1,
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
              textAlign: "center",
              textAlignVertical: "center",
              paddingHorizontal: 4,
              width: 100,
              borderRadius: 8,
              backgroundColor: colors.background,
            }}
            keyboardType="number-pad"
            selectTextOnFocus
            value={amount + ""}
            onChangeText={(e) => {
              if (!isNaN(+e)) setAmount(+e);
            }}
          />
        </View>
      );
    else
      return (
        <MainTimePicker
          defaultTime={amount}
          returnTimeSetter={(time) => {
            setAmount(
              +(time + "").split(":")[0] +
                (+(time + "").split(":")[1] * 5) / 300
            );
          }}
        />
      );
  };

  const CreateEditModal = () => {
    return (
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
            {CreateModalContents()}
          </View>
        </View>
      </Modal>
    );
  };

  const CreateExpandForm = () => {
    if (expanded)
      return (
        <View style={{ marginVertical: 4, flexShrink: 0 }}>
          <View
            style={{
              marginVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <MeduimMainButton
                title="  تغییر  "
                onPress={() => {
                  setModalStatus(true);
                  setModalType(1);
                  setAmount(studyTime);
                  setModalTitle("تغییر مدت زمان مطالعه کلی");
                }}
              />
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MainTexts.MainContextSubTexts
                title={ConvertNumberToTime({ number: +studyTime })}
              />
            </View>

            <View style={{ flex: 2 }}>
              <MainTexts.MainContextSubTexts title="مطالعه کلی" />
            </View>
          </View>

          <View
            style={{
              marginVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <MeduimMainButton
                title="  تغییر  "
                onPress={() => {
                  setModalStatus(true);
                  setModalType(2);
                  setAmount(mostContinuesStudyTime);
                  setModalTitle("تغییر مدت زمان مطالعه پیوسته");
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MainTexts.MainContextSubTexts
                title={ConvertNumberToTime({ number: mostContinuesStudyTime })}
              />
            </View>

            <View style={{ flex: 2 }}>
              <MainTexts.MainContextSubTexts title="مطالعه پیوسته" />
            </View>
          </View>

          <View
            style={{
              marginVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <MeduimMainButton
                title="  تغییر  "
                onPress={() => {
                  setModalStatus(true);
                  setModalType(3);
                  setAmount(sleepingTime);
                  setModalTitle("تغییر مدت زمان استراحت");
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MainTexts.MainContextSubTexts
                title={ConvertNumberToTime({ number: sleepingTime })}
              />
            </View>

            <View style={{ flex: 2 }}>
              <MainTexts.MainContextSubTexts title="استراحت" />
            </View>
          </View>

          <View
            style={{
              marginVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <MeduimMainButton
                title="  تغییر  "
                onPress={() => {
                  setModalStatus(true);
                  setModalType(4);
                  setAmount(timeUsedTotorials);
                  setModalTitle("تغییر مدت زمان آموزش مجازی");
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MainTexts.MainContextSubTexts
                title={ConvertNumberToTime({ number: timeUsedTotorials })}
              />
            </View>

            <View style={{ flex: 2 }}>
              <MainTexts.MainContextSubTexts title="آموزش مجازی" />
            </View>
          </View>

          <View
            style={{
              marginVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <MeduimMainButton
                title="  تغییر  "
                onPress={() => {
                  setModalStatus(true);
                  setModalType(5);
                  setModalTitle("تغییر تعداد تست‌ها");
                  if (numberOfTests !== null) setAmount(numberOfTests + "");
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MainTexts.MainContextSubTexts
                title={numberOfTests ? numberOfTests : 0}
              />
            </View>

            <View style={{ flex: 2 }}>
              <MainTexts.MainContextSubTexts title="تست" />
            </View>
          </View>

          <View
            style={{
              marginVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <MeduimMainButton
                title="  افزودن  "
                onPress={() => {
                  setModalStatus(true);
                  setModalType(6);
                  setModalTitle("ساخت توضیحات ");
                  if (explains !== "") setExplains(explains);
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}></View>

            <View style={{ flex: 2 }}>
              <MainTexts.MainContextSubTexts title="افزودن توضیحات " />
            </View>
          </View>
        </View>
      );

    return <></>;
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <MainBox>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          <MaterialCommunityIcons
            name={expanded === true ? "chevron-up" : "chevron-down"}
            size={30}
            color={colors.titlePrimary}
          />

          <MainTexts.MainContextSubTexts title={first_name + " " + last_name} />

          <MainTexts.MainContextSubTexts title={username} />
        </TouchableOpacity>

        {CreateExpandForm()}
      </MainBox>

      {CreateEditModal()}
    </View>
  );
};

const ReportScreen = ({ reports, refreshreports }) => {
  const todayReports = reports.filter((f) => {
    if (f.enterTime !== undefined && f.enterTime !== null) return true;
    return false;
  });

  const [reload, setReload] = useState(0);

  const [refresh, setRefresh] = useState(false);

  return (
    <View style={{ marginHorizontal: 24, flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 8,
          flexDirection: "row",
        }}
      >
        <MainTexts.MainTitleTexts title="ثبت و تغییر گزارش روزانه" />
      </View>
      {todayReports.map((r) => (
        <ExpandableCard
          key={r.id}
          report={r}
          reload={() => setReload(reload + 1)}
        />
      ))}
      <View style={{ height: 85 }}></View>
    </View>
  );
};

export default ReportScreen;
