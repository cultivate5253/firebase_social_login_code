import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
// 連携済みのすべてのプロバイダーIDプロパティの配列を返す
export const getLinkedProviderIds = (user) => {
  const linkedProviderIds = user.providerData
    .map((provider) => provider.providerId)
    .filter(
      (providerId) =>
        providerId === GoogleAuthProvider.PROVIDER_ID ||
        providerId === GithubAuthProvider.PROVIDER_ID
    );

  return linkedProviderIds;
};
