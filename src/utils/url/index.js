function getWebAdminURL() {
  const WEB_ADMIN_URL = process.env.REACT_APP_WEB_ADMIN_URL || "https://staging-admin.myarchery.id";
  return WEB_ADMIN_URL;
}

function getAppArcherURL() {
  const WEB_ARCHER_URL = process.env.REACT_APP_ARCHER_URL || "https://staging.myarchery.id";
  return WEB_ARCHER_URL;
}

function openUrlOnNewTab(url) {
  return window.open(url, "_blank");
}

export default { getWebAdminURL, getAppArcherURL, openUrlOnNewTab };
