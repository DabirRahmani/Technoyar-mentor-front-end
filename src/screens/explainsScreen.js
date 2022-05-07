import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import GetExplainsRequest from "../backend/getExplains";
import PutSubmitExplain from "../backend/putSubmitExplain";
import MainBox from "../components/MainBox";
import { MeduimMainButton, SmallMainButton } from "../components/MainButtons";
import MainLoading from "../components/MainLoading";
import MainTexts from "../components/MainTexts";
import { colors } from "../configs";
import LoadingScreen from "./loadingScreen";
import MainScreen from "./mainScreen";

const ExplainsScreen = () => {
  const [explains, setExplains] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const [render, setRender] = useState(0);

  const nnavigator = useNavigation();

  console.log("rendered");

  useEffect(() => {
    setLoaded(false);
    GetExplainsRequest({
      datacaller: (data) => {
        if (data.err) {
          //error
        } else if (data === "error") {
          //error
        } else {
          var v = Object.values(data).sort((a, b) => {
            if (a.id > b.id) return -1;
          });
          setExplains(v);
          setLoaded(true);
        }
      },
    });
  }, [render]);

  if (loaded === false) {
    return <MainLoading />;
  } else
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
            <MainTexts.MainTitleTexts title="تایید توضیحات" />
          </View>
        </View>

        <ScrollView>
          {explains.map((e) => {
            return (
              <View key={e.id} style={{ marginTop: 16, marginHorizontal: 8 }}>
                <MainBox>
                  <View style={{ flexDirection: "row", marginBottom: 8 }}>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      {e.explanationViwed === false ? (
                        <SmallMainButton
                          title="تایید"
                          onPress={() => {
                            PutSubmitExplain({
                              datacaller: (data) => {
                                if (data.status === 200) {
                                  setRender(render + 1);
                                }
                              },
                              id: e.id,
                            });
                          }}
                        />
                      ) : (
                        <View style={{ alignItems: "center" }}>
                          <MainTexts.MainSecoonderyContextSubTexts title="تایید شده" />
                        </View>
                      )}
                    </View>

                    <View style={{ flex: 3, alignItems: "center" }}>
                      <MainTexts.MainContextSubTexts
                        title={
                          e.report.student.first_name +
                          " " +
                          e.report.student.last_name
                        }
                      />
                    </View>

                    <View
                      style={{
                        marginHorizontal: 8,
                        alignItems: "flex-end",
                      }}
                    >
                      <MainTexts.MainContextSubTexts
                        title={e.report.student.username}
                      />
                    </View>
                  </View>

                  <MainTexts.MainSecoonderyContextSubTexts
                    title={"توضیحات: " + e.additionalExplanation}
                  />
                </MainBox>
              </View>
            );
          })}
        </ScrollView>
      </MainScreen>
    );
};

export default ExplainsScreen;
