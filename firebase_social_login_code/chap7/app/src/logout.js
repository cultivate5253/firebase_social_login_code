import loginStatusChangeEvent from "./event";

const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
  });

  if (!response.ok) {
    alert(`ログアウトでエラーが発生しました。\n${response.statusText}`);
  }
  document.dispatchEvent(loginStatusChangeEvent);
};
export default logout;
