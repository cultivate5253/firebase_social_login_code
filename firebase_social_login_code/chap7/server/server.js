const express = require("express");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

initializeApp();

const app = express();
app.use(cookieParser());
app.use(express.json());
const port = 4000;

app.get("/index.html", async (request, response) => {
  try {
    const options = {
      httpOnly: false, // フロントエンドでよみとるために false にする
      secure: false, // http://localhostのため falseにする
    };

    //ランダム文字列でcsrfToken生成
    const csrfToken = crypto.randomBytes(30).toString("base64url");
    response.cookie("csrfToken", csrfToken, options);
    response.sendFile(__dirname + "/public/index.html");
  } catch {
    response.status(500).json({ error: "unexpected_error" });
  }
});

app.get("/style.css", async (request, response) => {
  try {
    response.sendFile(__dirname + "/public/style.css");
  } catch {
    response.status(500).json({ error: "unexpected_error" });
  }
});

app.get("/index.js", async (request, response) => {
  try {
    response.sendFile(__dirname + "/public/index.bundle.js");
  } catch {
    response.status(500).json({ error: "unexpected_error" });
  }
});

app.post("/api/login", async (request, response) => {
  const { idToken, csrfToken } = request.body;

  if (csrfToken !== request.cookies?.csrfToken) {
    response.status(401).json({ error: "invalid_csrf_token" });
    return;
  }
  const expiresIn = 5 * 60 * 1000;
  try {
    const sessionToken = await getAuth().createSessionCookie(idToken, {
      expiresIn,
    });
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: false, // http://localhostのため falseにする
    };
    response.cookie("session", sessionToken, options);
    response.status(201).json({});
  } catch (error) {
    // getAuth().createSessionCookie のエラーレスポンスが400以外でハンドリング可能なものがあるかもしれないが、一旦は invalid_id_token に丸める。
    response.status(400).json({ error: "invalid_id_token" });
  }
});

app.post("/api/logout", async (request, response) => {
  const sessionCookie = request.cookies?.session || "";

  try {
    const decodedClaims = await getAuth().verifySessionCookie(
      sessionCookie,
      true
    );

    await getAuth().revokeRefreshTokens(decodedClaims.uid);
  } catch (error) {
    response.clearCookie("session");
    response.status(401).json({ error: "invalid_session" });
    return;
  }
  response.clearCookie("session");
  response.status(201).json({});
});

app.get("/api/users/me", async (request, response) => {
  const sessionCookie = request.cookies?.session;

  // ログインしていない状態でのアクセス
  if (!sessionCookie) {
    response.status(401).json({ error: "invalid_session" });
    return;
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(
      sessionCookie,
      true
    );

    response.status(200).json({
      name: decodedClaims.name,
      email: decodedClaims.email,
    });
  } catch (error) {
    response.clearCookie("session");
    response.status(401).json({ error: "invalid_session" });
  }
});

app.delete("/api/users/me", async (request, response) => {
  const sessionCookie = request.cookies?.session || "";

  if (!sessionCookie) {
    response.status(401).json({ error: "invalid_session" });
    return;
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(
      sessionCookie,
      true
    );
    await getAuth().deleteUser(decodedClaims.uid);
  } catch (error) {
    response.clearCookie("session");
    response.status(401).json({ error: "invalid_session" });
    return;
  }
  response.clearCookie("session");
  response.status(204).json({});
});

app.listen(port, () => {
  console.log(`Start server port:${port}`);
});
