import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import AllPenaltyRequest from "../backend/allPenaltiesRequest";
import PutPenaltyPaidRequest from "../backend/putPenaltyPaid";
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

const HistoryItemCard = ({ p }) => {
  const [modalStatus, setModalStatus] = useState(false);

  const [loading, setLoading] = useState(false);

  const [snackStatus, setSnackStatus] = useState(false);

  const putPay = () => {
    setLoading(true);
    PutPenaltyPaidRequest({
      datacaller: (data) => {
        setLoading(false);

        if (data.err) {
        } else if (data === "error") {
          setSnackStatus(true);
        } else if (data.data.code !== 200) {
          setSnackStatus(true);
        } else {
          p.penaltyPayed = true;
          setModalStatus(false);
        }
      },
      penaltyid: p.id,
    });
  };

  const CreateModalContents = () => {
    if (loading) {
      <MainLoading />;
    }

    if (modalStatus)
      return (
        <MainBox>
          <View style={{ marginTop: 12 }}>
            <MainTexts.MainTitleTexts title="از ثبت پرداخت آیتم انتخاب شده اطمینان دارید؟" />
            <View style={{ padding: 4, paddingTop: 8 }}>
              <MainTexts.MainContextSubTexts
                title={
                  "پرداخت " +
                  p.penalty +
                  " تومان، توسط " +
                  p.report.student.first_name +
                  " " +
                  p.report.student.last_name +
                  " انجام شده است؟"
                }
              />
            </View>
            <View style={{ padding: 8 }}>
              <MainTexts.MainSecoonderyContextSubTexts
                title={"توضیحات آیتم: " + p.penaltyExplanation}
              />
            </View>

            <MainSnack
              warning
              status={snackStatus}
              setter={setSnackStatus}
              title="خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید."
            />
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <MeduimMainButton title="تایید" onPress={putPay} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <MeduimMainButton
                backgroundColor={colors.darkgrayiconsitems}
                title="لغو"
                onPress={() => {
                  setModalStatus(false);
                }}
              />
            </View>
          </View>
        </MainBox>
      );
  };

  const CreatePayButton = () => {
    if (p.penaltyPayed)
      return <MainTexts.MainSecoonderyContextSubTexts title="پرداخت شده" />;
    return (
      <SmallMainButton
        onPress={() => {
          setModalStatus(true);
        }}
        title=" ثبت پرداخت "
      />
    );
  };

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <MainBox>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <MainTexts.MainSecondTitleTexts title={p.penalty + " تومان"} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <MainTexts.MainContextSubTexts
              title={
                p.report.student.first_name + " " + p.report.student.last_name
              }
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
            alignItems: "flex-start",
          }}
        >
          {CreatePayButton()}
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <MainTexts.MainSecoonderyContextSubTexts
              title={"توضیحات: " + p.penaltyExplanation}
            />
          </View>
        </View>

        <View>
          <MainTexts.MainSecoonderyContextSubTexts
            title={"تاریخ: " + (p.report.day + "").replace(/-/g, "/")}
          />
        </View>

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
      </MainBox>
    </View>
  );
};

const ShowPenaltyHistoryScreen = ({ close }) => {
  const [loaded, setLoaded] = useState(false);

  const [penalties, setPenalties] = useState([]);

  useEffect(() => {
    AllPenaltyRequest({
      datacaller: (data) => {
        if (data.err) {
        } else if (data === "error") {
        } else {
          setPenalties(
            Object.values(data).sort((a, b) => {
              if (a.id > b.id) return -1;
              else return 1;
            })
          );
          setLoaded(true);
        }
      },
    });
  }, []);

  if (!loaded) return <MainLoading />;
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
            close();
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
          <MainTexts.MainTitleTexts title="مشاهده تاریخچه" />
        </View>
      </View>

      <ScrollView>
        {penalties.map((p) => (
          <HistoryItemCard key={p.id} p={p} />
        ))}
      </ScrollView>
    </MainScreen>
  );
};

export default ShowPenaltyHistoryScreen;
