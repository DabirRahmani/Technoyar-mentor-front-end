import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import AllExamsRequest from "../backend/allExamsRequest";
import MainBox from "../components/MainBox";

import MainLoading from "../components/MainLoading";
import MainTexts from "../components/MainTexts";
import { colors } from "../configs";
import MainScreen from "./mainScreen";

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const ShowExamHistoryScreen = ({ close }) => {
  const [loaded, setLoaded] = useState(false);

  const [exams, setExams] = useState([]);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    AllExamsRequest({
      datacaller: (data) => {
        if (data.err) {
        } else if (data === "error") {
        } else {
          setExams(
            Object.values(data).sort((a, b) => {
              if (a.id > b.id) return -1;
            })
          );
          setLoaded(true);

          var st_username = [
            ...new Set(
              Object.values(data).map((d) => (d = d.report.student.username))
            ),
          ];

          var exms = Object.values(data).sort((a, b) => {
            if (a.id > b.id) return -1;
          });

          setStudents(
            st_username.map(
              (s) =>
                (s = {
                  username: s,
                  studentname:
                    exms.filter((f) => {
                      if (+f.report.student.username === +s) return true;
                    })[0].report.student.first_name +
                    " " +
                    exms.filter((f) => {
                      if (+f.report.student.username === +s) return true;
                    })[0].report.student.last_name,
                })
            )
          );
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
          <MainTexts.MainTitleTexts title="تاریخچه آزمون‌ها" />
        </View>
      </View>

      <ScrollView>
        {students.map((s) => (
          <View
            key={s.username}
            style={{ marginBottom: 16, marginHorizontal: 16 }}
          >
            <MainBox>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <MainTexts.MainSecoonderyContextSubTexts title="رتبه" />
                </View>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <MainTexts.MainSecoonderyContextSubTexts title="درصد" />
                </View>

                <View style={{ marginHorizontal: 28, alignItems: "center" }}>
                  <MainTexts.MainSecoonderyContextSubTexts title="تاریخ" />
                </View>

                <View style={{ flex: 5, alignItems: "flex-end" }}>
                  <MainTexts.MainSecondTitleTexts title={s.studentname} />
                </View>
              </View>

              {exams
                .filter((f) => {
                  if (f.report.student.username === s.username) return true;
                })
                .map((e) => (
                  <View
                    key={e.id}
                    style={{
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: colors.darkgrayiconsitems,
                      marginTop: 4,
                      paddingTop: 4,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <MainTexts.MainSecondTitleTexts title={e.rank} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <MainTexts.MainSecondTitleTexts title={e.percent} />
                    </View>
                    <View style={{}}>
                      <MainTexts.MainSecoonderyContextSubTexts
                        title={(e.report.day + "").replace(/-/g, "/")}
                      />
                    </View>
                    <View style={{ flex: 5, alignItems: "flex-end" }}>
                      <MainTexts.MainContextSubTexts title={e.name} />
                    </View>
                  </View>
                ))}
            </MainBox>
          </View>
        ))}
      </ScrollView>
    </MainScreen>
  );
};

export default ShowExamHistoryScreen;
