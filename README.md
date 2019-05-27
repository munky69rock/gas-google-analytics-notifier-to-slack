# Google Analytics Notifier

Google Apps Scriptで前日のGoogle Analyticsの数値をSlackに通知する

## Usage

1. https://script.google.com/ にアクセスし、新規スクリプトを作成
2. 「ファイル > プロジェクトのプロパティ」からスクリプトIDをコピー
3.  `clasp clone` を実行する
    ```
    $ clasp clone "1m2K...." # 先ほどコピーしたスクリプトIDを指定
    $ git checkout appsscript.json
    $ rm コード.js
    ```
4. Slackに通知したいGoogle Analyticsの「管理 > ビューの設定」からビューIDをコピー
5. スクリプト編集画面の「ファイル > プロジェクトのプロパティ > スクリプトのプロパティ」に `GA_PROFILE_ID` (先程コピーしたビューIDを指定)、`SLACK_URL`(Webhook URL)、`SLACK_CHANNEL`(通知したいチャンネル名、おそらくDeprecated?)を設定
6. `clasp push`を実行
    ```sh
    $ clasp push
    ```
7. スクリプト編集画面の「編集 > 現在のプロジェクトのトリガー」をクリック、新しいトリガーを作成する
8. 実行する関数に `sendDailyAnalyticsData` or `sendMonthlyAnalyticsData`、イベントのソースなどはお好みで設定する
9. 権限の許可を行う
10. スクリプト編集画面に戻り、「実行 > 関数を実行 > `sendDailyAnalyticsData`」
11. 権限の許可を行う

```sh
$ npm i @google/clasp -g
$ npm install
$ clasp push
```

[clasp](https://github.com/google/clasp)
