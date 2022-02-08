function getWebAdminURL() {
  const WEB_ADMIN_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin.myarchery.id"
      : "https://staging-admin.myarchery.id";

  return WEB_ADMIN_URL;
}

// TODO:
// eslint-disable-next-line no-unused-vars
function getAppArcherURL() {}

export default { getWebAdminURL };