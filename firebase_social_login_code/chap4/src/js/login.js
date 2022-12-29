import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config';

initializeApp(firebaseConfig);

const redirectToMyPageWhenLoginSuccess = async (provider) => {
  try {
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    // メールが確認されていない場合はメール登録画面に遷移する
    if (!result.user.emailVerified) {
      window.location.href = 'register-email.html';
      return;
    }
    window.location.href = '/';
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      alert(
        `${error.customData.email}は他の SNS と連携した既存ユーザーが登録済みです。既存ユーザーでログイン後、こちらの SNS との連携が可能です。`
      );
      return;
    }
    alert(`ログイン/新規登録に失敗しました。\n${error.message}`);
  }
};

// Google ログインボタン
const googleLogin = () => {
  redirectToMyPageWhenLoginSuccess(new GoogleAuthProvider());
};
document.getElementById('googleLogin').addEventListener('click', googleLogin);

// GitHub ログインボタン
const githubLogin = () => {
  redirectToMyPageWhenLoginSuccess(new GithubAuthProvider());
};
document.getElementById('githubLogin').addEventListener('click', githubLogin);
