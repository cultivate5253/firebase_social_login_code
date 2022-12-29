// IDトークンをバックエンドに送信
const postIdToken = async (idToken, csrfToken) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, csrfToken }),
  });

  if (!response.ok) {
    throw new Error(`login error\n${response.statusText}`);
  }
  return;
};

export default postIdToken;
