import {
  getAuth,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config';

initializeApp(firebaseConfig);

const sendLoginLink = async (event) => {
  event.preventDefault();
  const emailForm = document.forms.emailForm.elements.email;
  const email = emailForm.value;

  const actionCodeSettings = {
    url: `https://${location.host}`,
    handleCodeInApp: true, // ログインURL 送信の場合はtrue
  };

  const auth = getAuth();
  auth.languageCode = 'ja';

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    //未登録の場合
    if (signInMethods.length === 0) {
      emailForm.value = '';
      alert(
        `${email}が登録済みである場合、\nログイン用のURLが送られています。`
      );
      return;
    }

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    emailForm.value = '';
    alert(`${email}が登録済みである場合、\nログイン用のURLが送られています。`);
    return;
  } catch (error) {
    alert(`${email}へのログイン用URLの送信に失敗しました。\n${error.message}`);
  }
};

// ログインリンクメールの送信ボタン
document.getElementById('emailForm').addEventListener('submit', sendLoginLink);

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth();
  // ログイン状態が変化したときの処理
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return;
    }
    window.location.href = '/';
  });
});
