import { store } from "../../store";
import * as AuthenticationStore from "store/slice/authentication";

const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "https://api-staging.myarchery.id";

export default function resource(endpoint, config) {
  return fetch(API_URL + endpoint, config)
    .then(async (response) => {
      const responseObject = await response.json();
      responseObject.success = response.ok;
      if (response.status === 401) {
        store.dispatch(AuthenticationStore.logout());
      }
      if (response.status === 503) {
        if (window.location.pathname !== "/working/maintenance") {
          window.location = "/working/maintenance";
          return;
        }
      }
      return responseObject;
    })
    .catch((error) => {
      return { message: JSON.stringify(error) };
    });
}
