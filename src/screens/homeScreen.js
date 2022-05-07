import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import TodayReportsRequest from "../backend/todayReportsRequest";
import UserDetailsRequest from "../backend/useDetailsRequest";
import {
  MainIconButton,
  MainMenuButton,
  MeduimMainButton,
} from "../components/MainButtons";
import MainLoading from "../components/MainLoading";
import MainTexts from "../components/MainTexts";
import MainScreen from "./../screens/mainScreen";
import MessageMenuScreen from "./messageMenuScreen";
import ReportScreen from "./reportScreen";
import SettingScreen from "./settingScreen";
import * as SecureStore from "expo-secure-store";

const HomeScreen = (props) => {
  const [todayReports, setTodayReports] = useState([]);

  const [userDetails, setUserDetails] = useState({});

  const [messageModalStatus, setMessageModalStatus] = useState(false);

  const [settingModalStatus, setSettingModalStatus] = useState(false);

  const [loading, setLoading] = useState(true);

  const [reload, setReload] = useState(0);

  const nnavigator = useNavigation();

  useEffect(() => {
    setLoading(true);
    TodayReportsRequest({
      datacaller: (e) => {
        if (e.err) {
          //refresh err
        } else {
          if (e === "error") {
            //sth went wrong
          } else {
            var v = Object.values(e);
            setTodayReports(v);
            setLoading(false);
          }
        }
      },
    });

    UserDetailsRequest({
      datacaller: (data) => {
        if (data.err) {
          nnavigator.replace("login", { err: "refreshError" });
        } else {
          setUserDetails(data);
        }
      },
    });
  }, [reload]);

  useEffect(() => {
    if (userDetails.role !== undefined && userDetails.role !== "")
      if (userDetails.role !== 3 && userDetails.role !== 4) {
        SecureStore.deleteItemAsync("refresh").then(() => {
          SecureStore.deleteItemAsync("token").then(() => {
            nnavigator.replace("login", { err: "refreshError" });
          });
        });
      }
  }, [userDetails]);

  const Reload = () => {
    setReload(+reload + 1);
  };

  const CreateSettingModal = () => {
    if (settingModalStatus)
      return (
        <SettingScreen
          changeStatus={setSettingModalStatus}
          visibalityStatus={settingModalStatus}
          user={userDetails}
        />
      );
  };

  const CreateMessageModal = () => {
    if (messageModalStatus)
      return (
        <MessageMenuScreen
          changeStatus={setMessageModalStatus}
          visibalityStatus={messageModalStatus}
          user={userDetails}
        />
      );
  };

  const CreatePaymentManagerButton = () => {
    if (userDetails.role === 4)
      return (
        <View style={{ marginTop: 16 }}>
          <MainMenuButton
            title="مدیریت پرداخت‌ها"
            iconname="credit-card-plus-outline"
            onPress={() => {
              nnavigator.navigate("penalty", {
                todayreports: todayReports,
              });
            }}
          />
        </View>
      );

    return <View></View>;
  };

  const CreateSubmitExplainsButton = () => {
    if (userDetails.role === 4)
      return (
        <View style={{ marginTop: 16 }}>
          <MainMenuButton
            title="تایید توضیحات"
            iconname="playlist-edit"
            onPress={() => {
              nnavigator.navigate("explain", {
                todayreports: todayReports,
              });
            }}
          />
        </View>
      );

    return <View></View>;
  };

  const CreateBottomIconButtons = () => {
    return (
      <>
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
          }}
        >
          <MainIconButton
            onPress={() => {
              setSettingModalStatus(true);
            }}
            name="cog-outline"
          />
        </View>

        {userDetails.role === 4 ? (
          <View
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
            }}
          >
            <MainIconButton
              onPress={() => {
                setMessageModalStatus(true);
              }}
              iconSize={40}
              name="message-text"
            />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  if (loading === true) return <MainLoading />;
  return (
    <MainScreen>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={Reload} />
        }
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 16,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              height: 30,
              marginBottom: 8,
            }}
            source={require("./../assets/bannertp.png")}
          />
        </View>

        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <View style={{ flex: 1, marginRight: 4 }}>
              <MainMenuButton
                square
                title="ثبت خروج"
                iconname="logout"
                onPress={() => {
                  nnavigator.navigate("enterlogout", {
                    todayreports: todayReports,
                  });
                }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <MainMenuButton
                square
                title="ثبت ورود"
                iconname="login"
                onPress={() => {
                  nnavigator.navigate("enterlogin", {
                    todayreports: todayReports,
                  });
                }}
              />
            </View>
          </View>

          {CreatePaymentManagerButton()}

          <View style={{ marginTop: 16 }}>
            <MainMenuButton
              title="مدیریت آزمون‌ها"
              iconname="checkbox-marked-outline"
              onPress={() => {
                nnavigator.navigate("exam", {
                  todayreports: todayReports,
                });
              }}
            />
          </View>

          {CreateSubmitExplainsButton()}
        </View>

        <ReportScreen reports={todayReports} />
      </ScrollView>

      {CreateBottomIconButtons()}

      {CreateSettingModal()}
      {CreateMessageModal()}
    </MainScreen>
  );
};

export default HomeScreen;
