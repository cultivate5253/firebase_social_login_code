import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config';
import logout from './logout';

initializeApp(firebaseConfig);

const registerEmail = async (event) => {
  event.preventDefault();
  const emailForm = document.forms.emailForm.elements.email;
  const emailToBeRegistered = emailForm.value;

  const auth = getAuth();
  const user = auth.currentUser;
  auth.languageCode = 'ja';

  const actionCodeSettings = {
    url: `https://${location.host}/login.html`,
  };

  // プロバイダから取得したメールアドレスとは別のものを登録する場合
  if (user.email !== emailToBeRegistered) {
    try {
      await user.verifyBeforeUpdateEmail(
        emailToBeRegistered,
        actionCodeSettings
      );
      alert(`${emailToBeRegistered}に確認メールを送りました`);
      emailForm.value = '';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        const result = confirm(
          `${emailToBeRegistered}は他の SNS と連携した既存ユーザーで登録済みです。マイページにてこちらの SNS との連携が可能です。既存のユーザーでログインしなおしますか？`
        );
        // 既存ユーザーでログインし直す場合
        if (result) {
          // SNS の認証に成功している時点でユーザーが作られており、このままでは既存ユーザーに連携できなくなるので、ここで削除
          await user.delete();
          window.location.href = 'login.html';
          return;
        }
        // Noの場合、フォームを初期化して終了
        emailForm.value = '';
        return;
      }
      alert(`メールの送信に失敗しました。\n${error.message}`);
    }
    return;
  }
  // プロバイダーから取得したメールアドレスを登録する場合
  try {
    await sendEmailVerification(user);
    alert(`${emailToBeRegistered}に確認メールを送りました`);
    emailForm.value = '';
  } catch (error) {
    alert(`メールの送信に失敗しました。\n${error.message}`);
  }
};

// メール送信ボタン
document.getElementById('emailForm').addEventListener('submit', registerEmail);

// ログアウトボタン
document.getElementById('logout').addEventListener('click', logout);

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth();
  // ログイン状態が変化したときの処理
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    // プロバイダから取得したメールアドレスをフォームの初期値として設定
    const { email } = user;
    const emailForm = document.forms.emailForm.elements.email;
    emailForm.value = email;
  });
});
