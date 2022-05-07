import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import GetAllUsersRequest from "../backend/getAllUsers";
import MessageRequest from "../backend/messages";
import { MeduimMainButton } from "../components/MainButtons";
import MainLoading from "../components/MainLoading";
import MainTexts from "../components/MainTexts";
import { colors } from "../configs";
import MainScreen from "./mainScreen";
import MessageScreen from "./messageScreen";

const MessageMenuScreen = ({ user, visibalityStatus, changeStatus }) => {
  const [messages, setMessages] = useState([]);

  const [parents, setParents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [messageScreenStatus, setMessageScreenStatus] = useState(false);

  const [selectedParent, setSelectedParent] = useState({});

  const [unReads, setUnReads] = useState([]);

  useEffect(() => {
    setLoading(true);

    MessageRequest({
      datacaller: (data) => {
        if (data.err) {
        } else if (data === "error") {
        } else {
          var v = Object.values(data);
          setMessages(v);

          var unreads = v
            .filter((f) => {
              if (f.is_read === true) return false;
              else return true;
            })
            .filter((f) => {
              if (f.receiver.username === user.username) return true;
              return false;
            });

          var unreadusernames = unreads.map((m) => m.sender.username);

          unreadusernames = [...new Set(unreadusernames)];

          setUnReads(unreadusernames);

          GetAllUsersRequest({
            datacaller: (data) => {
              setLoading(false);
              if (data.err) {
                //error
              } else if (data === "error") {
                //error
              } else {
                var v = Object.values(
                  data.filter((d) => {
                    if (d.role === 1) return true;
                    else return false;
                  })
                );

                var unreadedparents = v.filter((f) => {
                  if (unreadusernames.includes(f.parent.username)) return true;
                  return false;
                });

                var readedparents = v.filter((f) => {
                  if (unreadusernames.includes(f.parent.username)) return false;
                  return true;
                });

                setParents([...unreadedparents, ...readedparents]);
              }
            },
          });
        }
      },
    });
  }, []);

  const CreateMessageScreenModal = () => {
    if (messageScreenStatus)
      if (selectedParent.parent.username !== undefined) {
        return (
          <MessageScreen
            admin={user}
            user={selectedParent}
            changeStatus={setMessageScreenStatus}
            visibalityStatus={messageScreenStatus}
            setMessagess={setMessages}
            messagess={messages.filter((f) => {
              if (f.receiver.username === selectedParent.parent.username)
                return true;
              if (f.sender.username === selectedParent.parent.username)
                return true;

              return false;
            })}
          />
        );
      } else return <View></View>;
  };

  const CreateContent = () => {
    if (loading) return <MainLoading />;

    return (
      <View>
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

          <View
            style={{
              marginRight: 32,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <MainTexts.MainTitleTexts title="مدیریت پیام‌ها" />
          </View>
        </View>

        <ScrollView style={{ marginBottom: 40 }}>
          {parents.map((p) => (
            <View key={p.username}>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.darkgrayiconsitems,
                  opacity: 0.5,
                }}
              ></View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedParent(p);
                  setMessageScreenStatus(true);
                  setUnReads(
                    unReads.filter((u) => {
                      if (u === p.parent.username) return false;
                      return true;
                    })
                  );
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  width: "100%",
                  backgroundColor: colors.lightLayerBackGround,
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ alignItems: "flex-end" }}>
                  <MainTexts.MainTitleTexts
                    title={p.parent.first_name + " " + p.parent.last_name}
                  />
                  <MainTexts.MainSecoonderyContextSubTexts
                    title={"دانش‌آموز: " + p.first_name + " " + p.last_name}
                  />
                </View>
                <View>
                  {unReads.includes(p.parent.username) === true ? (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: colors.danger,
                      }}
                    ></View>
                  ) : (
                    <View></View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
      }}
    >
      <MainScreen>
        {CreateContent()}

        {CreateMessageScreenModal()}
      </MainScreen>
    </Modal>
  );
};

export default MessageMenuScreen;
