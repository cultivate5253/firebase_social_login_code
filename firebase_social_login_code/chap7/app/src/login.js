import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getIdToken,
} from "firebase/auth";
import loginStatusChangeEvent from "./event";
import postIdToken from "./post-id-token";
import Cookies from "js-cookie";

// Googleログインボタンの処理
const googleLogin = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    // popupで認証画面を出す
    const result = await signInWithPopup(auth, provider);

    // ID Tokenを取得する
    const idToken = await getIdToken(result.user, true);

    // CookieからCSRF Tokenを取得する
    const csrfToken = Cookies.get("csrfToken");

    // ID Tokenをバックエンドに送信
    await postIdToken(idToken, csrfToken);
    document.dispatchEvent(loginStatusChangeEvent);
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      alert(`${error.email}は他のSNSアカウントによるログインで登録済みです。`);
      return;
    }
    alert(`ログイン/新規登録に失敗しました。\n${error.message}`);
  }
};

export default googleLogin;
