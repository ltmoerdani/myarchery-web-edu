function getWebAdminURL() {
  // TODO: kalau node environment di docker udah bener
  // const WEB_ADMIN_URL =
  //   process.env.NODE_ENV === "production"
  //     ? "https://admin.myarchery.id"
  //     : "https://staging-admin.myarchery.id";

  return "https://admin.myarchery.id";
}

// TODO:
// eslint-disable-next-line no-unused-vars
function getAppArcherURL() {}

function openUrlOnNewTab(url) {
  return window.open(url, "_blank");
}

export default { getWebAdminURL, openUrlOnNewTab };
