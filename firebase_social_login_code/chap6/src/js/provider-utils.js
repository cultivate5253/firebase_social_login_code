import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
// 連携済みのすべてのプロバイダーIDプロパティの配列を返す
export const getLinkedProviderIds = (user) => {
  const linkedProviderIds = user.providerData
    .map((provider) => provider.providerId)
    .filter(
      // メールリンクは除く
      (providerId) =>
        providerId === GoogleAuthProvider.PROVIDER_ID ||
        providerId === GithubAuthProvider.PROVIDER_ID
    );

  return linkedProviderIds;
};

// 連携済みのプロバイダーインスタンスを一つだけ返す
export const getProvider = () => {
  const auth = getAuth();
  const providerIds = getLinkedProviderIds(auth.currentUser);

  let provider;
  // このサンプルアプリではGoogleを優先する
  if (providerIds.includes(GoogleAuthProvider.PROVIDER_ID)) {
    provider = new GoogleAuthProvider();
  } else if (providerIds.includes(GithubAuthProvider.PROVIDER_ID)) {
    provider = new GithubAuthProvider();
  }

  return provider;
};
