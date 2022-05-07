import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import PostExamRequest from "../backend/postExamRequest";
import MainBox from "../components/MainBox";
import {
  LargeMainButton,
  MeduimMainButton,
  SmallMainButton,
} from "../components/MainButtons";
import MainLoading from "../components/MainLoading";
import MainSnack from "../components/MainSnack";
import MainTexts from "../components/MainTexts";
import { colors } from "../configs";
import MainScreen from "./mainScreen";
import ShowExamHistoryScreen from "./showExamHistoryScreen";

const ExamCard = ({ r, setSelectedReports, selectedReports, resaulted }) => {
  const [percent, setPercent] = useState("0");

  const [rank, setRank] = useState("0");

  useEffect(() => {
    var v = r.id;
    resaulted[v] = { rank: rank, percent: percent, report: v };
  });

  return (
    <View key={r.id} style={{ marginTop: 8 }}>
      <View
        style={{
          height: 1,
          backgroundColor: colors.darkgrayiconsitems,
          marginBottom: 8,
          opacity: 0.5,
        }}
      ></View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 50 }}>
          <SmallMainButton
            backgroundColor={colors.darkgrayiconsitems}
            title="حذف"
            onPress={() => {
              setSelectedReports(
                selectedReports.filter((s) => {
                  if (s === r.id) return false;
                  else return true;
                })
              );
            }}
          />
        </View>

        <TextInput
          value={rank}
          onChangeText={(t) => {
            if (!isNaN(+t)) {
              if (Number.isInteger(+t)) {
                if (!t.includes(".")) {
                  if (+t === 0) {
                    setRank("0");
                  } else if (t[0] === "0") {
                    setRank(t.substring(1));
                  } else setRank(t);
                }
              }
            }
          }}
          style={{
            borderColor: colors.titlePrimary,
            borderWidth: 1,
            borderRadius: 8,
            color: colors.titlePrimary,
            fontSize: 14,
            height: 24,
            backgroundColor: colors.background,
            paddingHorizontal: 8,
            width: 50,
            marginHorizontal: 8,
          }}
          defaultValue="0"
          numberOfLines={1}
          textAlign="right"
          selectTextOnFocus
          keyboardType="number-pad"
        />

        <TextInput
          value={percent}
          onChangeText={(t) => {
            if (!isNaN(+t)) {
              if (Number.isInteger(+t)) {
                if (!t.includes(".")) {
                  if (+t === 0) {
                    setPercent("0");
                  } else if (t[0] === "0") {
                    setPercent(t.substring(1));
                  } else setPercent(t);
                }
              }
            }
          }}
          style={{
            borderColor: colors.titlePrimary,
            borderWidth: 1,
            borderRadius: 8,
            color: colors.titlePrimary,
            fontSize: 14,
            height: 24,
            backgroundColor: colors.background,
            paddingHorizontal: 8,
            width: 50,
            marginHorizontal: 8,
          }}
          defaultValue="0"
          numberOfLines={1}
          textAlign="right"
          selectTextOnFocus
          keyboardType="number-pad"
        />

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <MainTexts.MainSecoonderyContextSubTexts
            title={r.student.first_name + " " + r.student.last_name}
          />
        </View>
      </View>
    </View>
  );
};

const ExamScreen = () => {
  const [historyModalStatus, setHistoryModalStatus] = useState(false);

  const [examTitle, setExamTitle] = useState("");

  const [selectedReports, setSelectedReports] = useState([]);

  const [loading, setLoading] = useState(false);

  const [snackStatus, setSnackStatus] = useState(false);

  const [snackType, setSnackType] = useState("warning");

  const nnavigator = useNavigation();

  const todayReports = useRoute().params.todayreports;

  const [resaulted, setResaulted] = useState({});

  const SubmitExam = () => {
    if (/\S/.test(examTitle)) {
      var data = {};
      setLoading(true);

      selectedReports.forEach((e) => {
        data[e] = { ...resaulted[e], name: examTitle };
      });

      var v = { list: Object.values(data) };

      PostExamRequest({ data: v, datacaller: ExamResponse });
    }
  };

  const ExamResponse = (data) => {
    setLoading(false);

    if (data.err) {
      //error
      setSnackType("warning");
      setSnackStatus(true);
    } else if (data === "error") {
      //error
      setSnackType("warning");
      setSnackStatus(true);
    } else {
      setExamTitle("");
      setSelectedReports([]);
      setResaulted({});

      setSnackStatus(true);
      setSnackType("success");
    }
  };

  const CreateExamForm = () => {
    if (loading) return <MainLoading />;

    return (
      <MainBox>
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 8 }}>
            <MainTexts.MainSecondTitleTexts title="ساخت آزمون جدید" />
            <MainTexts.MainSecoonderyContextSubTexts title="عنوان را وارد کنید و دانش آموزان را از لیست زیرانتخاب کنید" />
          </View>

          <View style={{ flexDirection: "row-reverse" }}>
            <TextInput
              value={examTitle}
              onChangeText={(t) => {
                setExamTitle(t);
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
                marginBottom: 8,
                maxHeight: 84,
                marginTop: 8,
                flex: 1,
              }}
              placeholder="عنوان آزمون"
              placeholderTextColor={colors.darkgrayiconsitems}
              numberOfLines={1}
              textAlign="right"
              selectTextOnFocus
            />

            {selectedReports.length > 0 ? (
              <View style={{ justifyContent: "center", marginRight: 8 }}>
                <LargeMainButton onPress={SubmitExam} title="  ثبت آزمون  " />
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </View>

        {selectedReports.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              marginLeft: 58,
              marginBottom: -8,
            }}
          >
            <View style={{ width: 50, alignItems: "center" }}>
              <MainTexts.MainSecoonderyContextSubTexts title="رتبه" />
            </View>
            <View style={{ width: 50, marginLeft: 8 }}>
              <MainTexts.MainSecoonderyContextSubTexts title="درصد" />
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MainTexts.MainSecoonderyContextSubTexts title="نام دانش‌آموز" />
            </View>
          </View>
        ) : (
          <View></View>
        )}

        {todayReports
          .filter((f) => {
            if (selectedReports.find((i) => f.id === i) !== undefined)
              return true;
            else return false;
          })
          .map((r) => (
            <ExamCard
              setSelectedReports={setSelectedReports}
              selectedReports={selectedReports}
              r={r}
              key={r.id}
              resaulted={resaulted}
            />
          ))}
      </MainBox>
    );
  };

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
          <ShowExamHistoryScreen close={() => setHistoryModalStatus(false)} />
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
          <MainTexts.MainTitleTexts title="مدیریت آزمون‌ها" />
        </View>
      </View>

      <ScrollView style={{ marginHorizontal: 8, marginTop: 8 }}>
        {CreateExamForm()}

        {snackType === "success" ? (
          <MainSnack
            status={snackStatus}
            setter={setSnackStatus}
            success
            title="آزمون ثبت شد"
          />
        ) : (
          <MainSnack
            status={snackStatus}
            setter={setSnackStatus}
            warning
            title="خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید."
          />
        )}

        {todayReports
          .filter((f) => {
            if (selectedReports.find((i) => f.id === i) === undefined)
              return true;
            else return false;
          })
          .map((r) => {
            return (
              <View key={r.id} style={{ marginTop: 16 }}>
                <MainBox>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                      <SmallMainButton
                        title="انتخاب"
                        onPress={() => {
                          setSelectedReports([...selectedReports, r.id]);
                        }}
                      />
                    </View>

                    <View style={{ flex: 3, alignItems: "center" }}>
                      <MainTexts.MainContextSubTexts
                        title={r.student.first_name + " " + r.student.last_name}
                      />
                    </View>

                    <View
                      style={{
                        marginHorizontal: 8,
                        alignItems: "flex-end",
                      }}
                    >
                      <MainTexts.MainContextSubTexts
                        title={r.student.username}
                      />
                    </View>
                  </View>
                </MainBox>
              </View>
            );
          })}
      </ScrollView>

      {CreateHistory()}
    </MainScreen>
  );
};

export default ExamScreen;
