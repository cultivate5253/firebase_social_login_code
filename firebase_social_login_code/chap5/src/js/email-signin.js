import { getAuth, signInWithEmailLink } from 'firebase/auth';
import { getLinkedProviderIds } from './provider-utils';

const handleEmailSignIn = async () => {
  const auth = getAuth();
  const email = window.prompt('確認のためメールアドレスを入力してください。');

  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    const linkedProviderIds = getLinkedProviderIds(result.user);

    // 仮登録中のメールアドレスでメールリンクログインをするとFirebse Authの仕様で ID プロバイダーの連携が解除される
    if (linkedProviderIds.length === 0) {
      alert('メールが使えない場合に備えて、\nID連携を行ってください。');
    }
  } catch (error) {
    alert(`ログインに失敗しました:${error.message}`);
  }
};
export default handleEmailSignIn;
