import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
} from 'firebase/auth';

import showLinkState from './link-state';
import handleEmailSignIn from './email-signin';
import updateEmail from './update-email';
import deleteUser from './delete-user';
import logout from './logout';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config';

initializeApp(firebaseConfig);

// ログアウトボタン
document.getElementById('logout').addEventListener('click', logout);

// メール更新ボタン
document.getElementById('emailForm').addEventListener('submit', updateEmail);

// 退会ボタン
document.getElementById('deleteUser').addEventListener('click', deleteUser);

// ページ読み込み時
document.addEventListener('DOMContentLoaded', async () => {
  const auth = getAuth();
  if (isSignInWithEmailLink(auth, window.location.href)) {
    await handleEmailSignIn();
  }

  // ログイン状態が変化したときの処理
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    if (!user.emailVerified) {
      window.location.href = 'register-email.html';
      return;
    }

    const { email, displayName } = user;

    // トップメッセージの表示
    document.getElementById(
      'top-message'
    ).textContent = `${displayName}さんでログイン中です`;

    // メールアドレスの表示
    document.getElementById('currentEmail').textContent = email;

    // ID プロバイダー連携状態の表示
    showLinkState(user);
  });
});
