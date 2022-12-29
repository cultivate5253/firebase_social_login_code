import { getAuth, getIdToken, signInWithEmailLink } from "firebase/auth";
import postIdToken from "./post-id-token";
import Cookies from "js-cookie";

const handleEmailSignIn = async () => {
  const auth = getAuth();
  const email = window.prompt("確認のためメールアドレスを入力してください。");

  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    const idToken = await getIdToken(result.user, true);

    // CookieからCSRF Tokenを取得する
    const csrfToken = Cookies.get("csrfToken");

    // backendにIT Tokenを送信
    await postIdToken(idToken, csrfToken);
  } catch (error) {
    alert(`ログインに失敗しました。\n${error.message}`);
  }
};
export default handleEmailSignIn;
