# Google Analytics Notifier

Google Apps Scriptで前日のGoogle Analyticsの数値をSlackに通知する

## Usage

1. プロジェクトのセットアップ
    ```sh
    $ git clone https://github.com/munky69rock/gas-google-analytics-notifier-to-slack
    $ npm i @google/clasp -g
    $ npm install
    ```
2. https://script.google.com/ にアクセスし、新規スクリプトを作成
3. 「ファイル > プロジェクトのプロパティ」からスクリプトIDをコピー
4.  `clasp clone` を実行する
    ```
    $ clasp clone "1m2K...." # 先ほどコピーしたスクリプトIDを指定
    $ git checkout appsscript.json
    $ rm コード.js
    ```
5. Slackに通知したいGoogle Analyticsの「管理 > ビューの設定」からビューIDをコピー
6. スクリプト編集画面の「ファイル > プロジェクトのプロパティ > スクリプトのプロパティ」に `GA_PROFILE_ID` (先程コピーしたビューIDを指定)、`SLACK_URL`(Webhook URL)、`SLACK_CHANNEL`(通知したいチャンネル名、おそらくDeprecated?)を設定
7. `clasp push`を実行
    ```sh
    $ clasp push
    ```
8. スクリプト編集画面の「編集 > 現在のプロジェクトのトリガー」をクリック、新しいトリガーを作成する
9. 実行する関数に `sendDailyAnalyticsData` or `sendMonthlyAnalyticsData`、イベントのソースなどはお好みで設定する
10. 権限の許可を行う
11. スクリプト編集画面に戻り、「実行 > 関数を実行 > `sendDailyAnalyticsData`」
12. 権限の許可を行う

[clasp](https://github.com/google/clasp)
