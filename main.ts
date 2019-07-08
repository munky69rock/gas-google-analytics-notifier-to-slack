const scriptProperty = PropertiesService.getScriptProperties();

const GA_PROFILE_ID = scriptProperty.getProperty("GA_PROFILE_ID");
const GA_METRIC = "ga:sessions,ga:users,ga:pageviews";
const GA_OPTIONS = {
  dimensions: "ga:channelGrouping"
};

declare class Analytics {
  static Data: any;
  static Management: any;
}

const SLACK_URL = scriptProperty.getProperty("SLACK_URL");
const SLACK_CHANNEL = scriptProperty.getProperty("SLACK_CHANNEL");

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

function sendAnalyticsData(startDate: string, endDate: string) {
  Logger.log(startDate, endDate);

  const channelReports = Analytics.Data.Ga.get(
    `ga:${GA_PROFILE_ID}`,
    startDate,
    endDate,
    GA_METRIC,
    GA_OPTIONS
  );
  const attachments: IAttachment[] = [];
  if (!channelReports.rows) {
    Logger.log("Oops, no access data yesterday... 😱");
    return;
  }
  channelReports.rows.forEach(report => {
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
  );
  reports.rows.forEach(report => {
    attachments.push({
      title: "Total",
      text: `セッション: ${report[0]}, UU: ${report[1]}, PV: ${report[2]}`
    });
  });
  const profile = Analytics.Management.Webproperties.get(
    reports.profileInfo.accountId,
    reports.profileInfo.webPropertyId
  );
  const payload: ISlackMessage = {
    channel: SLACK_CHANNEL,
    username: profile.name,
    icon_emoji: ":chart_with_upwards_trend:"
  };
  payload.text =
    startDate === endDate
      ? `${startDate} アクセスレポート`
      : `${startDate}~${endDate} アクセスレポート`;
  payload.attachments = attachments;
  UrlFetchApp.fetch(SLACK_URL, {
    method: "post",
    payload: JSON.stringify(payload)
  });
}

function sendDailyAnalyticsData() {
  const today = new Date();
  const timezone = Session.getScriptTimeZone();
  const startDate = Utilities.formatDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    timezone,
    "yyyy-MM-dd"
  );
  sendAnalyticsData(startDate, startDate);
}

function sendMonthlyAnalyticsData() {
  const today = new Date();
  const timezone = Session.getScriptTimeZone();
  const startDate = Utilities.formatDate(
    new Date(today.getFullYear(), today.getMonth() - 1, 1),
    timezone,
    "yyyy-MM-dd"
  );
  const endDate = Utilities.formatDate(
    new Date(today.getFullYear(), today.getMonth(), 0),
    timezone,
    "yyyy-MM-dd"
  );
  sendAnalyticsData(startDate, endDate);
}
