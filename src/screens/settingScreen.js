import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import MainBox from "../components/MainBox";
import {
  LargeMainButton,
  MainMenuButton,
  MeduimMainButton,
} from "../components/MainButtons";
import MainTexts from "../components/MainTexts";
import { colors } from "../configs";
import MainScreen from "./mainScreen";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainSnack from "../components/MainSnack";
import ChangePasswordRequest from "../backend/changePasswordRequest";
import CreateُStudentAndParentRequest from "../backend/CreateStudentAndParent";
import CreateMentorRequest from "../backend/CreateMentor";
import MainPicker from "../components/MainPicker";
import GetAllUsersRequest from "../backend/getAllUsers";
import PostChangeUsersPasswordRequest from "../backend/PostChangeUsersPasswordRequest";

const SettingScreen = ({ visibalityStatus, changeStatus, user }) => {
  const [changePassStatus, setChangePassStatus] = useState(false);

  const [pass, setpass] = useState("");
  const [confirmpass, setconfrimpass] = useState("");
  const [oldpass, setoldpass] = useState("");

  const [passErr, setPassErr] = useState("");

  const [passSnackStatus, setPassSnackStatus] = useState(false);

  const [passchanged, setPassChanged] = useState(false);

  const [newStudentStatus, setNewStudentStatus] = useState(false);

  const [studentFirstName, setStudentFirstName] = useState("");

  const [studentLastName, setStudentLastName] = useState("");

  const [studentPhoneNumber, setStudentPhoneNumber] = useState("");

  const [parentFirstName, setParentFirstName] = useState("");

  const [parentLastName, setParentLastName] = useState("");

  const [parentPhoneNumber, setParentPhoneNumber] = useState("");

  const [studentAndParentPass, setStudentAndParentPass] = useState("");

  const [newMentorStatus, setNewMentorStatus] = useState(false);

  const [mentorFirstName, setMentorFirstName] = useState("");

  const [mentorLastName, setMentorLastName] = useState("");

  const [mentorPass, setMentorPass] = useState("");

  const [createdStrudent, setCreatedStudent] = useState({});

  const [studentCreatedModalStatus, setStudentCreatedModalStatus] =
    useState(false);

  const [newStudentSnackStatus, setNewStudentSnackStatus] = useState(false);

  const [newStudentErr, setNewStudentErr] = useState("");

  const [newMentorSnackStatus, setNewMentorSnackStatus] = useState(false);

  const [newMentortErr, setNewMentorErr] = useState("");

  const [mentorPhoneNumber, setMentorPhoneNumber] = useState("");

  const [mentorCreatedModalStatus, setMentorCreatedModalStatus] =
    useState(false);

  const [createdMentor, setCreatedMentor] = useState({});

  const [changeUsersPassStatus, setChangeUsersPassStatus] = useState(false);

  const [changeUsersPassword, setChangeUsersPassword] = useState("");

  const [userPickerStatus, setUserPickerStatus] = useState("");

  const [users, setUsers] = useState([]);

  const [changeUsers, setchangeUsers] = useState("");

  const [selectedUser, setSelectedUser] = useState({});

  const [changeUsersPassSnackStatus, setChangeUsersPassSnackStatus] =
    useState(false);

  const [changeUsersPassErr, setChangeUsersPassErr] = useState("");

  const [loading, setLoading] = useState(false);

  const nnavigator = useNavigation();

  useEffect(() => {
    GetAllUsersRequest({
      datacaller: (data) => {
        if (data.err) {
          //error
        } else if (data === "error") {
          //error
        } else {
          var v = Object.values(data).sort((a, b) => {
            if (a.id > b.id) return false;
            else return true;
          });

          var vv = v
            .filter((f) => {
              if (f.role === 1) return true;
              return false;
            })
            .map((m) => m.parent);

          v = [...v, ...vv];

          setUsers(v);
        }
      },
    });
  }, [changeUsers]);

  const ChangePassWord = () => {
    if (pass !== confirmpass) {
      setPassErr("رمزهای عبور مطابقت ندارند");
      setPassSnackStatus(true);
    } else {
      if (!StrongPassword(pass)) {
        setPassErr(
          "رمز عبور باید حداقل دارای 8 کاراکتر باشد و حداقل دارای یک حرف و یک رقم باشد"
        );
        setPassSnackStatus(true);
      } else {
        setLoading(true);
        ChangePasswordRequest({
          datacaller: ChangePassWordCaller,
          oldpass: oldpass,
          newpass: pass,
        });
      }
    }
  };

  function StrongPassword(p = "") {
    if (p.length < 8) return false;

    var v = /[a-z]/;

    var vv = /[A-Z]/;

    var vvv = /[0-9]/;

    if (!(v.test(p) || vv.test(p))) return false;

    if (!vvv.test(p)) return false;

    return true;
  }

  const ChangePassWordCaller = (data) => {
    setLoading(false);
    if (data !== "error") {
      if (!data.err) {
        // data.code = 200
        if (data.code === 200) {
          setpass("");
          setoldpass("");
          setconfrimpass("");
          setChangePassStatus(false);
          setPassErr("رمز عبور با موفقیت تغییر کرد");
          setPassChanged(true);
          setPassSnackStatus(true);
        }
      }
    } else {
      setPassErr("رمز وارد شده اشتباه است");
      setPassSnackStatus(true);
    }
  };

  const CreatePasswordSnack = () => {
    if (passSnackStatus === false) {
      return <View></View>;
    }
    if (passchanged)
      return (
        <View style={{ width: "100%", height: 50, marginTop: 8 }}>
          <MainSnack
            status={passSnackStatus}
            success
            setter={setPassSnackStatus}
            title={passErr}
          />
        </View>
      );

    return (
      <View style={{ width: "100%", height: 50, marginTop: 8 }}>
        <MainSnack
          status={passSnackStatus}
          danger
          setter={setPassSnackStatus}
          title={passErr}
        />
      </View>
    );
  };

  const CreateNewStudentSnack = () => {
    if (newStudentSnackStatus === false) {
      return <View></View>;
    }

    return (
      <View style={{ width: "100%", height: 50, marginTop: 8 }}>
        <MainSnack
          status={newStudentSnackStatus}
          danger
          setter={setNewStudentSnackStatus}
          title={newStudentErr}
        />
      </View>
    );
  };

  const CreateNewMentorSnack = () => {
    if (newMentorSnackStatus === false) {
      return <View></View>;
    }

    return (
      <View style={{ width: "100%", height: 50, marginTop: 8 }}>
        <MainSnack
          status={newMentorSnackStatus}
          danger
          setter={setNewMentorSnackStatus}
          title={newMentortErr}
        />
      </View>
    );
  };

  const CreateChangePassForm = () => {
    if (!changePassStatus) return <View></View>;

    return (
      <MainBox>
        {CreatePasswordSnack()}
        <TextInput
          style={{
            backgroundColor: colors.lightLayerBackGround,
            flex: 1,
            color: colors.contextSecondery,
            paddingHorizontal: 8,
            borderRadius: 8,
            fontSize: 14,
            borderWidth: 1,
            borderColor: colors.contextSecondery,
            marginTop: 16,
            direction: "ltr",
          }}
          placeholder="رمز عبور قدیمی"
          placeholderTextColor={colors.contextSecondery}
          secureTextEntry
          textAlign="left"
          onChangeText={(text) => {
            setoldpass(text);
          }}
          value={oldpass}
        />

        <TextInput
          style={{
            backgroundColor: colors.lightLayerBackGround,
            flex: 1,
            color: colors.contextSecondery,
            paddingHorizontal: 8,
            borderRadius: 8,
            fontSize: 14,
            borderWidth: 1,
            borderColor: colors.contextSecondery,
            marginTop: 16,
            direction: "ltr",
          }}
          placeholder="رمز عبور جدید"
          placeholderTextColor={colors.contextSecondery}
          secureTextEntry
          textAlign="left"
          onChangeText={(text) => {
            setpass(text);
          }}
          value={pass}
        />

        <TextInput
          style={{
            backgroundColor: colors.lightLayerBackGround,
            flex: 1,
            color: colors.contextSecondery,
            paddingHorizontal: 8,
            borderRadius: 8,
            fontSize: 14,
            borderWidth: 1,
            borderColor: colors.contextSecondery,
            marginTop: 16,
            direction: "ltr",
          }}
          placeholder="تکرار رمز عبور جدید"
          placeholderTextColor={colors.contextSecondery}
          secureTextEntry
          textAlign="left"
          onChangeText={(text) => {
            setconfrimpass(text);
          }}
          value={confirmpass}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          <MeduimMainButton
            disable={loading}
            title="  تغییر رمز عبور  "
            onPress={() => {
              ChangePassWord();
              //setPassSnackStatus(false);
            }}
          />
          <MeduimMainButton
            backgroundColor={colors.darkgrayiconsitems}
            title="  لغو تغییر  "
            onPress={() => {
              setChangePassStatus(false);
              setPassSnackStatus(false);
            }}
          />
        </View>
      </MainBox>
    );
  };

  const CreateStudentCreatedModal = () => {
    if (studentCreatedModalStatus) {
      if (createdStrudent.student !== undefined)
        return (
          <Modal
            statusBarTranslucent={true}
            visible={studentCreatedModalStatus}
            animationType="fade"
            onRequestClose={() => {
              setStudentCreatedModalStatus(false);
            }}
            transparent
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.lightLayerBackGround,
                  height: 250,
                  width: "90%",
                  borderRadius: 16,
                  alignItems: "center",
                  paddingTop: 8,
                  paddingBottom: 16,
                  paddingHorizontal: 4,
                }}
              >
                <MaterialCommunityIcons
                  name="account-multiple-check-outline"
                  size={64}
                  color={colors.succuss}
                />
                <MainTexts.MainTitleTexts title="دانش‌آموز با موفقیت ثبت نام شد" />

                <View style={{ flex: 1, maxWidth: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{}}>
                      <MainTexts.MainContextSubTexts
                        title={createdStrudent.student.username}
                      />
                    </View>
                    <MainTexts.MainContextSubTexts title="کد کاربری دانش‌آموز " />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <MainTexts.MainContextSubTexts
                      title={
                        createdStrudent.student.first_name +
                        " " +
                        createdStrudent.student.last_name
                      }
                    />
                    <MainTexts.MainContextSubTexts title="نام و نام خانوادگی دانش‌آموز:   " />
                  </View>

                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <MainTexts.MainContextSubTexts
                      title={createdStrudent.student.parent.username}
                    />
                    <MainTexts.MainContextSubTexts title="کد کاربری والدین" />
                  </View>

                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <MainTexts.MainContextSubTexts
                      title={
                        createdStrudent.student.parent.first_name +
                        " " +
                        createdStrudent.student.parent.last_name
                      }
                    />
                    <MainTexts.MainContextSubTexts title="نام و نام خانوادگی والدین:" />
                  </View>

                  <View style={{ flex: 1 }}></View>
                  <MeduimMainButton
                    title="  بازگشت  "
                    onPress={() => {
                      setStudentCreatedModalStatus(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        );
    } else return <></>;
  };

  const CreateMentorCreatedModal = () => {
    if (mentorCreatedModalStatus) {
      if (createdMentor !== undefined && createdMentor !== null)
        return (
          <Modal
            statusBarTranslucent={true}
            visible={mentorCreatedModalStatus}
            animationType="fade"
            onRequestClose={() => {
              setMentorCreatedModalStatus(false);
            }}
            transparent
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.lightLayerBackGround,
                  height: 200,
                  width: "90%",
                  borderRadius: 16,
                  alignItems: "center",
                  paddingTop: 8,
                  paddingBottom: 16,
                  paddingHorizontal: 4,
                }}
              >
                <MaterialCommunityIcons
                  name="account-multiple-check-outline"
                  size={64}
                  color={colors.succuss}
                />
                <MainTexts.MainTitleTexts title="ناظر با موفقیت ثبت نام شد" />

                <View style={{ flex: 1, maxWidth: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{}}>
                      <MainTexts.MainContextSubTexts
                        title={createdMentor.username}
                      />
                    </View>
                    <MainTexts.MainContextSubTexts title="کد کاربری ناظر " />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <MainTexts.MainContextSubTexts
                      title={
                        createdMentor.first_name + " " + createdMentor.last_name
                      }
                    />
                    <MainTexts.MainContextSubTexts title="نام و نام خانوادگی ناظر:   " />
                  </View>

                  <View style={{ flex: 1 }}></View>
                  <MeduimMainButton
                    title="  بازگشت  "
                    onPress={() => {
                      setMentorCreatedModalStatus(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        );
    } else return <></>;
  };

  const CreateUserAndParent = () => {
    if (!StrongPassword(studentAndParentPass)) {
      setNewStudentErr(
        "رمز عبور باید حداقل دارای 8 حرف باشد، حداقل یک حرف و یک رقم داشته باشد"
      );
      setNewStudentSnackStatus(true);
    } else if (
      /\S/.test(studentLastName) &&
      /\S/.test(studentFirstName) &&
      /\S/.test(parentFirstName) &&
      /\S/.test(parentLastName) &&
      /\S/.test(parentPhoneNumber) &&
      /\S/.test(studentPhoneNumber) &&
      /\S/.test(studentAndParentPass)
    ) {
      setLoading(true);
      CreateُStudentAndParentRequest({
        datacaller: (data) => {
          setLoading(false);
          if (!data.err) {
            if (data === "error") {
              setNewStudentErr(
                "خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید"
              );
              setNewStudentSnackStatus(true);
            } else {
              setStudentCreatedModalStatus(true);
              setCreatedStudent(data);
              setNewStudentSnackStatus(false);
              setStudentFirstName("");
              setStudentLastName("");
              setStudentPhoneNumber("");
              setStudentAndParentPass("");
              setParentFirstName("");
              setParentLastName("");
              setParentPhoneNumber("");
            }
          } else {
            setNewStudentErr(
              "خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید"
            );
            setNewStudentSnackStatus(true);
          }
        },
        password: studentAndParentPass,
        studentfirstname: studentFirstName,
        studentlastname: studentLastName,
        parentlastname: parentLastName,
        parentfirstname: parentFirstName,
        parentphonenumber: parentPhoneNumber,
        studentphonenumber: studentPhoneNumber,
      });
    }
  };

  const CreateMentor = () => {
    if (!StrongPassword(mentorPass)) {
      setNewMentorErr(
        "رمز عبور باید حداقل دارای 8 حرف باشد، حداقل یک حرف و یک رقم داشته باشد"
      );
      setNewMentorSnackStatus(true);
    } else if (
      /\S/.test(mentorFirstName) &&
      /\S/.test(mentorLastName) &&
      /\S/.test(mentorPhoneNumber) &&
      /\S/.test(mentorPass)
    ) {
      setLoading(true);
      CreateMentorRequest({
        datacaller: (data) => {
          setLoading(false);
          if (data.err) {
            setNewMentorErr(
              "خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید"
            );
            setNewMentorSnackStatus(true);
          } else {
            if (data === "error") {
              setNewMentorErr(
                "خطا در ارتباط با سرور، اتصال به اینترنت را بررسی کنید"
              );
              setNewMentorSnackStatus(true);
            } else {
              setNewMentorSnackStatus(false);
              setCreatedMentor(data);
              setMentorCreatedModalStatus(true);
              setMentorFirstName("");
              setMentorLastName("");
              setMentorPass("");
              setMentorPhoneNumber("");
            }
          }
        },
        password: mentorPass,
        mentorfirstname: mentorFirstName,
        mentorlastname: mentorLastName,
        mentorphonenumber: mentorPhoneNumber,
      });
    }
  };

  const CreateNewStudent = () => {
    if (!newStudentStatus) return <View></View>;
    else {
      return (
        <MainBox>
          <View style={{ alignItems: "center" }}>
            <MainTexts.MainTitleTexts title=" فرم ثبت نام دانش‌آموز" />
          </View>
          {CreateNewStudentSnack()}
          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="نام دانش آموز"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setStudentFirstName(text);
            }}
            value={studentFirstName}
          />

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="نام خانوادگی دانش آموز"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setStudentLastName(text);
            }}
            value={studentLastName}
          />
          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="شماره همراه دانش آموز"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setStudentPhoneNumber(text);
            }}
            value={studentPhoneNumber}
          />

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="نام والدین"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setParentFirstName(text);
            }}
            value={parentFirstName}
          />

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="نام خانوادگی والدین"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setParentLastName(text);
            }}
            value={parentLastName}
          />

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="شماره همراه والدین"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setParentPhoneNumber(text);
            }}
            value={parentPhoneNumber}
          />

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="رمز عبور موقت دانش‌آموز و والدین"
            placeholderTextColor={colors.contextSecondery}
            secureTextEntry
            textAlign="right"
            onChangeText={(text) => {
              setStudentAndParentPass(text);
            }}
            value={studentAndParentPass}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            <MeduimMainButton
              disable={loading}
              title="  ثبت نام دانش‌آموز  "
              onPress={() => {
                CreateUserAndParent();
              }}
            />
            <MeduimMainButton
              backgroundColor={colors.darkgrayiconsitems}
              title="  لـــغــو  "
              onPress={() => {
                setNewStudentStatus(false);
              }}
            />
          </View>
        </MainBox>
      );
    }
  };

  const CreateChangeUsersPasswordSnack = () => {
    if (changeUsersPassSnackStatus === false) {
      return <View></View>;
    } else if (changeUsersPassErr === "رمز عبور با موفقیت تغییر کرد") {
      return (
        <View style={{ width: "100%", height: 50, marginTop: 8 }}>
          <MainSnack
            status={changeUsersPassSnackStatus}
            success
            setter={setChangeUsersPassSnackStatus}
            title={changeUsersPassErr}
          />
        </View>
      );
    } else
      return (
        <View style={{ width: "100%", height: 50, marginTop: 8 }}>
          <MainSnack
            status={changeUsersPassSnackStatus}
            danger
            setter={setChangeUsersPassSnackStatus}
            title={changeUsersPassErr}
          />
        </View>
      );
  };

  const ChangeUserPassForm = () => {
    if (!changeUsersPassStatus) return <View></View>;
    else {
      return (
        <MainBox>
          <View style={{ alignItems: "center", flex: 1 }}>
            <MainTexts.MainTitleTexts title=" فرم تغییر رمز عبور" />
          </View>

          {CreateChangeUsersPasswordSnack()}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <View>
              <MeduimMainButton
                onPress={() => {
                  setUserPickerStatus(true);
                  setchangeUsers(changeUsers + ".");
                }}
                title="  انتخاب کاربر  "
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {selectedUser.username === undefined ? (
                <MainTexts.MainContextSubTexts title="با استفاده از دکمه روبرو، کاربر را انتخاب کنید" />
              ) : (
                <MainTexts.MainContextSubTexts
                  title={
                    "کاربر انتخاب شده: " +
                    selectedUser.first_name +
                    " " +
                    selectedUser.last_name
                  }
                />
              )}
            </View>
          </View>

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="رمز عبور جدید"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            secureTextEntry
            onChangeText={(text) => {
              setChangeUsersPassword(text);
            }}
            value={changeUsersPassword}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            <MeduimMainButton
              disable={loading}
              title="  تغییر رمز  "
              onPress={() => {
                ChangeUsersPasswordRequest();
              }}
            />
            <MeduimMainButton
              backgroundColor={colors.darkgrayiconsitems}
              title="  لـــغــو  "
              onPress={() => {
                setChangeUsersPassStatus(false);
              }}
            />
          </View>
        </MainBox>
      );
    }
  };

  const ChangeUsersPasswordRequest = () => {
    if (selectedUser.username === undefined) {
      setChangeUsersPassErr("لطفا یک کاربر را انتخاب کنید");
      setChangeUsersPassSnackStatus(true);
    } else if (!StrongPassword(changeUsersPassword)) {
      setChangeUsersPassErr(
        "رمز عبور باید حداقل دارای 8 کاراکتر باشد و حداقل دارای یک حرف و یک رقم باشد"
      );
      setChangeUsersPassSnackStatus(true);
    } else {
      setLoading(true);
      PostChangeUsersPasswordRequest({
        datacaller: (data) => {
          setLoading(false);
          if (data.err) {
            //error
          } else {
            if (data === "error") {
              //error
            } else {
              setChangeUsersPassErr("رمز عبور با موفقیت تغییر کرد");
              setChangeUsersPassSnackStatus(true);
              setChangeUsersPassword("");
            }
          }
        },
        password: changeUsersPassword,
        username: selectedUser.username,
      });
    }
  };

  const CreateUserPickerModal = () => {
    if (userPickerStatus) {
      return (
        <MainPicker
          dataView={() => {
            return users.map((m) => (
              <View
                style={{ alignItems: "stretch", padding: 8 }}
                key={m.username}
              >
                <LargeMainButton
                  onPress={() => {
                    setSelectedUser(m);
                    setUserPickerStatus(false);
                  }}
                  title={m.username + "    " + m.first_name + " " + m.last_name}
                />
              </View>
            ));
          }}
          changeStatus={setUserPickerStatus}
          visibalityStatus={userPickerStatus}
        />
      );
    } else return <View></View>;
  };

  const CreateNewMentor = () => {
    if (!newMentorStatus) return <View></View>;
    else {
      return (
        <MainBox>
          <View style={{ alignItems: "center" }}>
            <MainTexts.MainTitleTexts title=" فرم ثبت نام ناظر" />
          </View>

          {CreateNewMentorSnack()}

          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="نام ناظر"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setMentorFirstName(text);
            }}
            value={mentorFirstName}
          />
          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="نام خانوادگی ناظر"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setMentorLastName(text);
            }}
            value={mentorLastName}
          />
          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="شماره همراه ناظر"
            placeholderTextColor={colors.contextSecondery}
            textAlign="right"
            onChangeText={(text) => {
              setMentorPhoneNumber(text);
            }}
            value={mentorPhoneNumber}
          />
          <TextInput
            style={{
              backgroundColor: colors.lightLayerBackGround,
              flex: 1,
              color: colors.contextSecondery,
              paddingHorizontal: 8,
              borderRadius: 8,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.contextSecondery,
              marginTop: 16,
              direction: "rtl",
            }}
            placeholder="رمز عبور موقت ناظر"
            placeholderTextColor={colors.contextSecondery}
            secureTextEntry
            textAlign="right"
            onChangeText={(text) => {
              setMentorPass(text);
            }}
            value={mentorPass}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            <MeduimMainButton
              disable={loading}
              title="  ثبت نام ناظر  "
              onPress={() => {
                CreateMentor();
              }}
            />
            <MeduimMainButton
              backgroundColor={colors.darkgrayiconsitems}
              title="  لـــغــو  "
              onPress={() => {
                setNewMentorStatus(false);
              }}
            />
          </View>
        </MainBox>
      );
    }
  };

  const LogOut = () => {
    SecureStore.deleteItemAsync("refresh").then(() => {
      SecureStore.deleteItemAsync("token").then(() => {
        nnavigator.replace("login", { logout: true });
      });
    });
  };

  const CreateManageUsersBox = () => {
    if (user.role !== 4) return <View></View>;

    return (
      <MainBox>
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <MainTexts.MainTitleTexts title="مدیریت کاربران" />
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <LargeMainButton
            disable={newStudentStatus}
            onPress={() => {
              setNewStudentStatus(true);
              setNewMentorStatus(false);
              setChangeUsersPassStatus(false);
            }}
            title="ثبت نام دانش آموز جدید"
          />
          <View style={{ height: 16 }}></View>
          <LargeMainButton
            disable={newMentorStatus}
            onPress={() => {
              setNewStudentStatus(false);
              setNewMentorStatus(true);
              setChangeUsersPassStatus(false);
            }}
            title="ثبت نام ناظر جدید"
          />
          <View style={{ height: 16 }}></View>

          <LargeMainButton
            onPress={() => {
              setNewStudentStatus(false);
              setNewMentorStatus(false);
              setChangeUsersPassStatus(true);
            }}
            title="تغییر رمز کاربران"
            disable={changeUsersPassStatus}
          />
        </View>
      </MainBox>
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
        <View
          style={{
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
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
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <MainBox>
              <View style={{ alignItems: "center" }}>
                <MainTexts.MainTitleTexts title="پروفایل" />
              </View>
              <View style={{ marginHorizontal: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <MainTexts.MainContextSubTexts title={user.username} />
                  <MainTexts.MainContextSubTexts title="کد کاربری:" />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <MainTexts.MainContextSubTexts
                    title={
                      user.first_name !== "" || user.last_name !== ""
                        ? user.first_name + user.last_name
                        : "ثبت نشده"
                    }
                  />
                  <MainTexts.MainContextSubTexts title="نام:" />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 4,
                  }}
                >
                  <MainTexts.MainContextSubTexts
                    title={
                      user.phoneNumber !== "" && user.phoneNumber !== null
                        ? user.phoneNumber
                        : "ثبت نشده"
                    }
                  />
                  <MainTexts.MainContextSubTexts title="شماره تماس:" />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 4,
                  }}
                >
                  <MainTexts.MainContextSubTexts
                    title={
                      user.lastDiactivated !== null &&
                      +user.lastDiactivated > 15
                        ? "غیر فعال"
                        : "فعال"
                    }
                  />
                  <MainTexts.MainContextSubTexts title="وضعیت:" />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 4,
                  }}
                >
                  <MeduimMainButton
                    onPress={() => {
                      setChangePassStatus(true);
                    }}
                    disable={changePassStatus}
                    title="  تغییر رمز  "
                  />
                  <MainTexts.MainContextSubTexts title="رمز عبور:" />
                </View>
              </View>
            </MainBox>

            <View style={{ height: 16 }}></View>

            {CreateChangePassForm()}

            <View style={{ height: 16 }}></View>

            {CreateManageUsersBox()}

            <View style={{ height: 16 }}></View>

            {CreateNewStudent()}

            {CreateNewMentor()}

            {ChangeUserPassForm()}
          </ScrollView>
        </KeyboardAvoidingView>

        <View
          style={{
            alignContent: "center",
            alignItems: "flex-start",
            marginBottom: 16,
            marginHorizontal: 16,
          }}
        >
          <LargeMainButton
            title="  خروج از حساب کاربری  "
            backgroundColor={colors.danger}
            onPress={() => {
              LogOut();
            }}
          />
        </View>
      </MainScreen>
      {CreateStudentCreatedModal()}

      {CreateMentorCreatedModal()}

      {CreateUserPickerModal()}
    </Modal>
  );
};

export default SettingScreen;
