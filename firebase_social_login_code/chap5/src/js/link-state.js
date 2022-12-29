import {
  GoogleAuthProvider,
  GithubAuthProvider,
  linkWithPopup,
  unlink,
} from 'firebase/auth';

import { getLinkedProviderIds } from './provider-utils';

// ID プロバイダー連携ボタンの処理
const linkProvider = async (user, provider) => {
  try {
    await linkWithPopup(user, provider);
    window.location.reload();
  } catch (error) {
    alert(`連携に失敗しました。\n${error.message}`);
  }
};

// ID プロバイダー 連携解除ボタンの処理
const unlinkProvider = async (user, provider) => {
  try {
    await unlink(user, provider.providerId);
    alert('連携を解除しました');
    window.location.reload();
  } catch (error) {
    alert(`連携の解除に失敗しました\n${error.message}`);
  }
};

// ID プロバイダーのディスプレイネームを取得
const getProviderDisplayName = (user, providerId) => {
  return user.providerData.find((provider) => {
    return provider.providerId === providerId;
  }).displayName;
};

// 連携済み ID プロバイダーのユーザー情報のセット
const setLinkedProvider = (user, info) => {
  const providerId = info.provider.providerId;
  const providerDisplayName = getProviderDisplayName(user, providerId);
  info.linkState.textContent = '連携済み';
  info.displayName.textContent = providerDisplayName;
  info.button.textContent = '解除';

  info.button.addEventListener('click', () => {
    unlinkProvider(user, info.provider);
  });
};

// 未連携の ID プロバイダーの情報をセット
const setNotLinkedProvider = (user, info) => {
  info.linkState.textContent = '未連携';
  info.displayName.textContent = '-';
  info.button.textContent = '連携';

  info.button.addEventListener('click', () => {
    linkProvider(user, info.provider);
  });
};

// 連携済み、未連携の情報を表示する
const showLinkState = (user) => {
  const linkedProviderIds = getLinkedProviderIds(user);

  const linkInfo = [
    {
      provider: new GoogleAuthProvider(),
      linkState: document.getElementById('googleLinkState'),
      displayName: document.getElementById('googleDisplayName'),
      button: document.getElementById('googleLinkButton'),
    },
    {
      provider: new GithubAuthProvider(),
      linkState: document.getElementById('githubLinkState'),
      displayName: document.getElementById('githubDisplayName'),
      button: document.getElementById('githubLinkButton'),
    },
  ];

  linkInfo.forEach((info) => {
    if (!linkedProviderIds.includes(info.provider.providerId)) {
      setNotLinkedProvider(user, info);
      return;
    }

    setLinkedProvider(user, info);
  });

  // どちらか一方しか連携していない場合は解除ボタンを非表示にする
  if (
    linkedProviderIds.includes(GoogleAuthProvider.PROVIDER_ID) &&
    !linkedProviderIds.includes(GithubAuthProvider.PROVIDER_ID)
  ) {
    document.getElementById('googleLinkButton').style.display = 'none';
  } else if (
    !linkedProviderIds.includes(GoogleAuthProvider.PROVIDER_ID) &&
    linkedProviderIds.includes(GithubAuthProvider.PROVIDER_ID)
  ) {
    button: document.getElementById('githubLinkButton').style.display = 'none';
  }
};

export default showLinkState;
