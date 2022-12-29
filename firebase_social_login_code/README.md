# パッケージのインストール
以下のディレクトリ配下で直接動作確認する場合は npm install でパッケージをインストールしてください。

- chap4
- chap5
- chap6
- chap7/app
- chap7/server

# chap2 配下での firebase init
chap2 配下で直接 firebase init を行った場合、 public 配下にファイルがあるため以下の質問がでます。両方 No で答えてください。
```
? File public/404.html already exists. Overwrite? No
i  Skipping write of public/404.html
? File public/index.html already exists. Overwrite? No
```

# firebase.json の上書き
chap4,chap5,chap6のディレクトリ配下で直接firebase initを行う場合はfirebase CLIの出力でfirebase.jsonが上書きされます。
パスをコントロールするために、以下をコピペしてください。
詳細は「4.4.1 画面」のリスト4.5を参照してください。

```
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/",
        "destination": "/mypage.html"
      }
    ]
  }
}
```

# firebase-config.js への初期設定値の記載
以下の firebase-config.js に初期設定を記載する必要があります。
「4.1.6 アプリ初期化設定ファイルの作成」を参照してください。
- chap4/src/js/firebase-config.js
- chap5/src/js/firebase-config.js
- chap6/src/js/firebase-config.js
- chap7/app/src/js/firebase-config.js

