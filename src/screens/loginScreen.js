import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LargeMainButton } from "../components/MainButtons";
import { colors } from "../configs";
import MainScreen from "../screens/mainScreen";
import MainBox from "../components/MainBox";
import MainTexts from "../components/MainTexts";
import strings from "../strings";
import { useNavigation, useRoute } from "@react-navigation/native";
import LoginRequest from "../backend/auth/login";
import MainSnack from "../components/MainSnack";
import Constants from "expo-constants";

export default LoginScreen = () => {
  const nnavigator = useNavigation();

  const response = useRoute().params;

  const [password, setPasswrod] = useState("");
  const [username, SetUsername] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [btnStatus, setBtnStatus] = useState(false);
  const [loginSnackStatus, setLoginSnackStatus] = useState(false);
  const [localerr, setLocalerr] = useState("");

  /*
تغییر صفحه از لاگین به هوم
*/
  useEffect(() => {
    if (loginStatus !== "") setLoginSnackStatus(true);

    if (loginStatus === "1") nnavigator.replace("home");
  }, [loginStatus, btnStatus, localerr]);

  /*
هر ارور خارجی که باعث بشه اپ از حالت لاگین شده خارج شود
اینجا بررسی خواهد شد
logout, tokenerror, refresherror, ...
تا با اسنک پیام نشان داده شود
*/
  useEffect(() => {
    if (response !== undefined)
      if (response.err === "refreshError") {
        setLoginStatus("6");
      } else if (response.logout === true) {
        setLoginStatus("7");
      }
  }, [response]);

  /*
اسنک با توجه به وضعیت
loginstatus
تعریف خواهد شد
بعد از درخواست برای ورود
*/
  const CreateSnack = () => {
    switch (loginStatus) {
      case "4":
        return (
          <MainSnack
            title="خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید."
            status={loginSnackStatus}
            warning
            setter={setLoginSnackStatus}
          />
        );
      case "1":
        return (
          <MainSnack
            title="وارد شدید، در حال انتقال به پنل کاربری"
            success
            status={loginSnackStatus}
            setter={setLoginSnackStatus}
          />
        );
      case "2":
        return (
          <MainSnack
            title="err1001"
            danger
            setter={setLoginSnackStatus}
            status={loginSnackStatus}
          />
        );
      case "3":
        return (
          <MainSnack
            title="کد کاربری یا رمز عبور اشتباه است"
            warning
            status={loginSnackStatus}
            setter={setLoginSnackStatus}
          />
        );
      case "5":
        return (
          <MainSnack
            title="کد کاربری و رمز عبور را وارد کنید!"
            warning
            status={loginSnackStatus}
            setter={setLoginSnackStatus}
          />
        );
      case "6":
        return (
          <MainSnack
            title="خطا در توکن دریافتی، لطفا مجددا وارد شوید."
            danger
            status={loginSnackStatus}
            setter={setLoginSnackStatus}
          />
        );

      case "7":
        return (
          <MainSnack
            title="با موفقیت از حساب کاربری خارج شدید"
            info
            status={loginSnackStatus}
            setter={setLoginSnackStatus}
          />
        );
      default:
        return <View></View>;
    }
  };

  const CreateLogo = () => (
    <View
      style={{
        width: "80%",
        height: 150,
        marginTop: 50,
        marginBottom: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 75,
      }}
    >
      <Image
        source={require("../assets/bannertp.png")}
        resizeMode="contain"
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );

  const CreateLoginForm = () => (
    <View style={{ flex: 1, padding: 8 }}>
      <TextInput
        style={{
          backgroundColor: colors.lightLayerBackGround,
          flex: 1,
          marginRight: 8,
          color: colors.contextSecondery,
          padding: 8,
          borderRadius: 8,
          fontSize: 16,
          borderWidth: 1,
          borderColor: colors.contextSecondery,
          direction: "ltr",
        }}
        placeholder={strings.username}
        placeholderTextColor={colors.contextSecondery}
        keyboardType="numeric"
        textAlign="left"
        value={username}
        onChangeText={(text) => {
          SetUsername(text);
        }}
      />

      <TextInput
        style={{
          backgroundColor: colors.lightLayerBackGround,
          flex: 1,
          marginRight: 8,
          color: colors.contextSecondery,
          padding: 8,
          borderRadius: 8,
          fontSize: 16,
          borderWidth: 1,
          borderColor: colors.contextSecondery,
          marginTop: 16,
          direction: "ltr",
        }}
        placeholder={strings.password}
        placeholderTextColor={colors.contextSecondery}
        secureTextEntry
        textAlign="left"
        value={password}
        onChangeText={(text) => {
          setPasswrod(text);
        }}
      />

      <View style={{ marginTop: 24 }}>
        <LargeMainButton
          title={strings.login}
          onPress={() => {
            Login();
          }}
          disable={btnStatus}
        />
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          Alert.alert(
            null,
            strings.forgotpasswordalert,
            [{ text: strings.back }],
            {
              cancelable: false,
            }
          );
        }}
      >
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <MainTexts.MainSecondTitleTexts title={strings.forgotpassword} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  const CreateOther = () => (
    <View
      style={{
        marginTop: 150,
        width: "80%",
        marginBottom: 32,
      }}
    >
      <View style={{ position: "absolute", top: -100, width: "100%" }}>
        {CreateSnack()}
      </View>

      <MainBox>{CreateLoginForm()}</MainBox>
    </View>
  );

  const Login = () => {
    if (!/\S/.test(password) || !/\S/.test(username)) {
      setLoginStatus("5");
      setLocalerr(localerr + ".");
    } else if (
      username.length < 4 ||
      password.length < 4 ||
      username.includes("‌") ||
      password.includes("‌") //نیم فاصله
    ) {
      setLoginStatus("3");
      setLocalerr(localerr + ".");
    } else {
      setBtnStatus(true);
      LoginRequest({
        username: username,
        password: password,
        setter: setLoginStatus,
        loginBtnStatus: setBtnStatus,
      });
    }
  };

  return (
    <MainScreen>
      <ImageBackground
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        blurRadius={1}
        source={require("../assets/loginback.jpg")}
        resizeMode="cover"
      >
        <ScrollView>
          <View style={{ alignItems: "center", flex: 1 }}>
            {CreateLogo()}

            {CreateOther()}

            <MainTexts.MainSecoonderyContextSubTexts
              title={"V " + Constants.manifest.version}
            />
            <MainTexts.MainSecoonderyContextSubTexts title={"Admin App"} />
          </View>
        </ScrollView>
      </ImageBackground>
    </MainScreen>
  );
};
