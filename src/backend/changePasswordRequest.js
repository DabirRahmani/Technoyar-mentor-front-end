import RefreshRequest from "./auth/refresh";
import MainAxios from "./MainAxios";

const ChangePasswordRequest = ({ datacaller, oldpass, newpass }) => {
  const TokenGenerator = ({ token, err }) => {
    if (err) {
      datacaller({ err: true });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      MainAxios()
        .put(
          "/student/student-change-password",
          { old_password: oldpass, new_password: newpass },
          config
        )
        .then((e) => {
          datacaller(e.data);
        })
        .catch((e) => {
          datacaller("error");
        });
      //درخواست چک کردن اینترنت
    }
  };

  RefreshRequest({ calllerFunction: TokenGenerator });
};

export default ChangePasswordRequest;
