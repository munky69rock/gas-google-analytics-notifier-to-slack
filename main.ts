const scriptProperty = PropertiesService.getScriptProperties();

const GA_PROFILE_ID = scriptProperty.getProperty("GA_PROFILE_ID");
const GA_METRIC = "ga:sessions,ga:users,ga:pageviews";
const GA_OPTIONS = {
  dimensions: "ga:channelGrouping"
};

declare class Analytics {
  static Data: any;
}

const SLACK_URL = scriptProperty.getProperty("SLACK_URL");
const SLACK_CHANNEL = scriptProperty.getProperty("SLACK_CHANNEL");
const slackMessage: ISlackMessage = {
  channel: SLACK_CHANNEL,
  username: "google-analytics",
  icon_emoji: ":chart_with_upwards_trend:"
};

interface ISlackMessage {
  text?: string;
  attachments?: IAttachment[];
  channel?: string;
  username?: string;
  icon_emoji?: string;
}

interface IAttachment {
  title?: string;
  pretext?: string;
  text: string;
}

function sendAnalyticsData() {
  const today = new Date();
  const timezone = Session.getScriptTimeZone();
  const startDate = Utilities.formatDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    timezone,
    "yyyy-MM-dd"
  );
  const endDate = Utilities.formatDate(today, timezone, "yyyy-MM-dd");

  Logger.log(startDate, endDate);

  const channelReports = Analytics.Data.Ga.get(
    `ga:${GA_PROFILE_ID}`,
    startDate,
    endDate,
    GA_METRIC,
    GA_OPTIONS
  ).rows;
  const attachments: IAttachment[] = [];
  channelReports.forEach(report => {
    attachments.push({
      title: report[0],
      text: `セッション: ${report[1]}, UU: ${report[2]}, PV: ${report[3]}`
    });
  });
  const reports = Analytics.Data.Ga.get(
    `ga:${GA_PROFILE_ID}`,
    startDate,
    endDate,
    GA_METRIC
  ).rows;
  reports.forEach(report => {
    attachments.push({
      title: "Total",
      text: `セッション: ${report[0]}, UU: ${report[1]}, PV: ${report[2]}`
    });
  });
  const payload = slackMessage;
  payload.text = `${startDate} アクセスレポート`;
  payload.attachments = attachments;
  UrlFetchApp.fetch(SLACK_URL, {
    method: "post",
    payload: JSON.stringify(payload)
  });
}
