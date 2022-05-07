import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import MessageRequest from "../backend/messages";
import PostMessage from "../backend/putMessage";
import { MainIconButton } from "../components/MainButtons";
import MainTexts from "../components/MainTexts";
import { colors } from "../configs";
import MainScreen from "./mainScreen";
import SeenMessageRequest from "../backend/seenMessageRequest";

const MessageCard = ({ title, sender, id, time, seen }) => {
  const [copied, setCopied] = useState("");

  var flexdirection = "row";

  var color = colors.lightLayerBackGround;

  const TextCopied = () => {
    setCopied("پیام کپی شد");

    const copytimer = setInterval(() => {
      setCopied("");
      clearInterval(copytimer);
    }, 2000);
  };

  if (sender) {
    flexdirection = "row-reverse";
    color = colors.complementBoldThird;
  }

  const CreateSeen = () => {
    if (sender)
      return (
        <MaterialCommunityIcons
          name={seen ? "check-all" : "check"}
          size={18}
          color={colors.info}
        />
      );

    return <View></View>;
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: flexdirection,
      }}
    >
      <View
        style={{
          width: "70%",
          flexDirection: flexdirection,
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderRadius: 12,
            paddingVertical: 4,
            marginHorizontal: 16,
            marginTop: 8,
            paddingHorizontal: 8,
            backgroundColor: color,
          }}
        >
          <MainTexts.MainContextSubTexts
            isCopied={TextCopied}
            pressable
            title={title}
          />

          <View style={{ flexDirection: "row-reverse", marginTop: 4 }}>
            {CreateSeen()}
            <Text style={{ fontSize: 12, color: colors.info }}>
              {time.toString().split("T")[0].replace(/-/g, "/") +
                " " +
                time.toString().split("T")[1].substring(0, 5)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          <MainTexts.MainSecoonderyContextSubTexts title={copied} />
        </View>
      </View>
    </View>
  );
};

const MessageScreen = ({
  visibalityStatus,
  changeStatus,
  user,
  admin,
  messagess,
  setMessagess,
}) => {
  const [height, setHeight] = useState(42);
  const [message, setMessage] = useState("");

  const [loaded, setloaded] = useState(true);

  const [contentHeight, setContentHeight] = useState(0);

  const [errorMessage, settErrorMessage] = useState(false);

  const [reloadEnabled, setReloadEnabled] = useState(true);

  const [interVal, setinterval] = useState();

  const [sendPending, setSendPending] = useState(false);

  const receiver = user.parent.username;

  const sender = admin.username;

  const nnavigator = useNavigation();

  const scrollViewRef = useRef();

  useEffect(() => {
    const realodTimer = setInterval(() => {
      setReloadEnabled(true);
    }, 10000);

    setinterval(realodTimer);

    var vvv = messagess.filter((m) => m.sender.username === receiver);

    if (vvv.length > 0) {
      var lastmessage = vvv[vvv.length - 1];

      if (lastmessage.is_read === false) {
        SeenMessageRequest({ id: lastmessage.id });
      }
    }
  }, []);

  useEffect(() => {
    if (contentHeight > 300) ScrollToLastMessage();
  }, [messagess.length, contentHeight]);

  const SendMessage = () => {
    var v = message.trim();
    var vv = v.toString().replace(/‌/g, "");

    if (!/\S/.test(v)) {
    } else if (!/\S/.test(vv.trim())) {
    } else {
      setSendPending(true);

      PostMessage({ responseCaller: SendMessageResponse, receiver, message });
    }
  };

  const CreateSendButton = () => {
    if (sendPending)
      return (
        <Image
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
          source={require("./../assets/loading2.gif")}
        ></Image>
      );

    return (
      <View style={{ width: 48, height: 48 }}>
        <MainIconButton
          onPress={SendMessage}
          name="send"
          size={48}
          iconSize={32}
          transParent={true}
        />
      </View>
    );
  };

  const SendMessageResponse = (data) => {
    setSendPending(false);
    if (data === "error") {
      settErrorMessage(true);
      setloaded(true);
    } else {
      const { status, err, response } = data;

      settErrorMessage(false);
      setloaded(true);

      if (err === true) nnavigator.replace("login", { err: "refreshError" });
      else if (status === 200) {
        setMessagess([...messagess, response]);
        setMessage("");
        setHeight(42);
      }
    }
  };

  const RefreshMessages = () => {
    setReloadEnabled(false);
    setloaded(false);
    setSendPending(false);
    MessageRequest({ datacaller: GetMessage });
  };

  const GetMessage = (data) => {
    if (!data.err) {
      if (data !== "error") {
        var v = Object.values(data);

        var vv = v.sort((a, b) => a.id > b.id);

        setMessagess(vv);

        setloaded(true);

        var vvv = vv.filter((m) => m.sender.username === receiver);

        if (vvv.length > 0) {
          var lastmessage = vvv[vvv.length - 1];

          if (lastmessage.is_read === false) {
            SeenMessageRequest({ id: lastmessage.id });
          }
        }
      } else if (data === "error") {
        settErrorMessage(true);
      }
    } else {
      nnavigator.replace("login", { err: "refreshError" });
    }
  };

  const ScrollToLastMessage = () => {
    if (scrollViewRef.current !== undefined && scrollViewRef.current !== null)
      if (
        scrollViewRef.current.scrollTo !== undefined &&
        scrollViewRef.current.scrollTo !== null
      )
        scrollViewRef.current.scrollTo({
          x: 0,
          y: contentHeight,
        });
  };

  const CreateErrorMessage = () => {
    if (errorMessage === true) {
      return (
        <View style={{ width: "100%" }}>
          <View
            style={{
              borderRadius: 8,
              paddingVertical: 4,
              marginHorizontal: 16,
              marginTop: 8,
              paddingHorizontal: 8,
              backgroundColor: colors.warning,
            }}
          >
            <MainTexts.MainTitleTexts title="خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید." />
          </View>
        </View>
      );
    } else return <View></View>;
  };

  const CreateMesseges = () => {
    if (!loaded) {
      return (
        <MainScreen>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={require("./../assets/smallloading.gif")} />
          </View>
        </MainScreen>
      );
    } else
      return (
        <View style={{ flex: 1 }}>
          {messagess.map((m) => (
            <MessageCard
              key={m.id}
              id={m.id}
              title={m.message}
              time={m.timestamp}
              sender={m.sender.username == sender ? true : false}
              seen={m.sender.username == sender ? m.is_read : false}
            />
          ))}
        </View>
      );
  };

  return (
    <Modal
      statusBarTranslucent={true}
      visible={visibalityStatus}
      animationType="slide"
      onRequestClose={() => {
        changeStatus(false);
        clearInterval(interVal);
      }}
    >
      <MainScreen>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: colors.darkgrayiconsitems,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                changeStatus(false);
                clearInterval(interVal);
              }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color={colors.titlePrimary}
              />
              <MainTexts.MainTitleTexts title="بازگشت" />
            </TouchableOpacity>

            <MainTexts.MainTitleTexts
              title={user.parent.first_name + " " + user.parent.last_name}
            />
          </View>

          <ScrollView
            style={{
              flex: 1,
            }}
            ref={scrollViewRef}
          >
            <View
              onLayout={(event) => {
                var { height, y } = event.nativeEvent.layout;
                setContentHeight(height + y);
              }}
              style={{
                flexDirection: "column-reverse",
                flex: 1,
              }}
            >
              {CreateErrorMessage()}
              {CreateMesseges()}
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              alignContent: "center",
              marginVertical: 8,
              marginHorizontal: 8,
            }}
          >
            <MainIconButton
              onPress={RefreshMessages}
              name="refresh"
              size={48}
              iconSize={32}
              transParent={true}
              disable={!reloadEnabled}
            />

            <TextInput
              style={{
                backgroundColor: colors.lightLayerBackGround,
                color: colors.contextSecondery,
                paddingHorizontal: 8,
                borderRadius: 8,
                paddingVertical: 4,
                fontSize: 16,
                borderWidth: 1,
                borderColor: colors.contextSecondery,
                direction: "rtl",
                flex: 1,
                marginHorizontal: 8,
                height: height,
                maxHeight: 86,
                minHeight: 36,
              }}
              placeholder="پیام خود را بنویسید"
              placeholderTextColor={colors.contextSecondery}
              textAlign="right"
              onChangeText={(text) => {
                setMessage(text);
              }}
              value={message}
              keyboardType="default"
              multiline
              onContentSizeChange={(e) =>
                setHeight(e.nativeEvent.contentSize.height)
              }
            />

            {CreateSendButton()}
          </View>
        </KeyboardAvoidingView>
      </MainScreen>
    </Modal>
  );
};

export default MessageScreen;
