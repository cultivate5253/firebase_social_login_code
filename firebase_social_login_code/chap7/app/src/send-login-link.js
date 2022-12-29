import {
  getAuth,
  fetchSignInMethodsForEmail,
  sendSignInLinkToEmail,
} from "firebase/auth";

const sendLoginLink = async (event) => {
  event.preventDefault();
  const emailForm = document.forms.recoveryEmailForm.elements.recoveryEmail;
  const email = emailForm.value;

  const actionCodeSettings = {
    url: `http://${location.host}/index.html`,
    handleCodeInApp: true,
  };

  const auth = getAuth();
  auth.languageCode = "ja";

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    //未登録の場合または仮登録の場合
    if (signInMethods.length === 0) {
      emailForm.value = "";
      alert(
        `${email}が登録済みである場合、ログインリンクが送られています。ご確認ください。`
      );
      return;
    }

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    emailForm.value = "";
    alert(
      `${email}が登録済みである場合、ログインリンクが送られています。ご確認ください。`
    );
    return;
  } catch (error) {
    alert(`${email}へのログインリンク送信に失敗しました。\n${error.message}`);
  }
};

export default sendLoginLink;
