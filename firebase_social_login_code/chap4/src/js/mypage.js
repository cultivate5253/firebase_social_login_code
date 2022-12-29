import { getAuth, onAuthStateChanged } from 'firebase/auth';

import logout from './logout';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase-config';

initializeApp(firebaseConfig);

// ログアウトボタン
document.getElementById('logout').addEventListener('click', logout);

// ページ読み込み時
document.addEventListener('DOMContentLoaded', async () => {
  const auth = getAuth();

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
  });
});
