import {
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";
import loginStatusChangeEvent from "./event";

const deleteAccount = async () => {
  const auth = getAuth();
  try {
    const provider = new GoogleAuthProvider();
    const user = auth.currentUser;
    await reauthenticateWithPopup(user, provider);
    const response = await fetch("/api/users/me", {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`退会に失敗しました。\n${response.statusText}`);
    }
    document.dispatchEvent(loginStatusChangeEvent);
  } catch (error) {
    alert(`退会に失敗しました。\n${error.message}`);

    // Firebase Auth でユーザーが無効化されている可能性があるためその場合はログイン画面に戻す
    if (error.code === "auth/user-disabled") {
      document.dispatchEvent(loginStatusChangeEvent);
    }
  }
};

export default deleteAccount;
