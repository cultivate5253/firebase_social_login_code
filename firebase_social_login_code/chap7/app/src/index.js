import { getAuth, isSignInWithEmailLink } from "firebase/auth";
import googleLogin from "./login";
import deleteAccount from "./delete-account";
import loginStatusChangeEvent from "./event";
import logout from "./logout";
import sendLoginLink from "./send-login-link";
import handleEmailSignIn from "./email-signin";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config";

initializeApp(firebaseConfig);

// Google ログインボタン
document.getElementById("googleLogin").addEventListener("click", googleLogin);

// ログアウトボタンの処理
document.getElementById("logout").addEventListener("click", logout);

//  退会ボタン
document
  .getElementById("deleteAccount")
  .addEventListener("click", deleteAccount);

//  ログインリンク送信ボタン
document
  .getElementById("recoveryEmailForm")
  .addEventListener("submit", sendLoginLink);

// ページを開いたときのログイン状態の確認
document.addEventListener("DOMContentLoaded", async () => {
  const auth = getAuth();
  // メールログインの処理
  if (isSignInWithEmailLink(auth, window.location.href)) {
    await handleEmailSignIn();
  }

  // ログイン状態にあわせた画面切り替え
  document.dispatchEvent(loginStatusChangeEvent);
});

// ログイン状態の変更に応じて表示を切り替える
document.addEventListener("loginStatusChange", async () => {
  try {
    const response = await fetch("/api/users/me", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("login error");
    }

    const responseJson = await response.json();
    // マイページの表示
    document.getElementById("name").textContent = responseJson.name;
    document.getElementById("currentEmail").textContent = responseJson.email;
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("myPage").style.display = "block";
  } catch (error) {
    // ログインページの表示
    document.getElementById("name").textContent = "";
    document.getElementById("currentEmail").textContent = "";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("myPage").style.display = "none";
  }
});
