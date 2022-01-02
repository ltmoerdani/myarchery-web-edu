import queryString from "query-string";
import fetch from "./fetch";
import { store } from "../../store";

const objectToFormData = function (obj, form, namespace) {
  var fd = form || new FormData();
  var formKey;

  for (var property in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + "[" + property + "]";
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File)
      ) {
        objectToFormData(obj[property], fd, property);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
};

export default {
  get(endpoint, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }
    let config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
    };
    return fetch(`${endpoint}?${params}`, config);
  },

  post(endpoint, data = null, qs = null, requestWithJSON = false) {
    if (requestWithJSON) {
      return this.postFormJSON(endpoint, data, qs);
    }
    return this.postFormData(endpoint, data, qs);
  },

  postFormData(endpoint, data = null, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = objectToFormData(data);
    let config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
      body: formData,
    };
    return fetch(`${endpoint}?${params}`, config);
  },
  postFormJSON(endpoint, data = null, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    let config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
      body: JSON.stringify(data),
    };
    return fetch(`${endpoint}?${params}`, config);
  },

  put(endpoint, data = null, qs = null, requestWithJSON = false) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var payloadData = requestWithJSON ? JSON.stringify(data) : objectToFormData(data);
    const contentType = requestWithJSON ? { "Content-Type": "application/json" } : {};
    let config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
        ...contentType,
      },
      body: payloadData,
    };
    return fetch(`${endpoint}?${params}`, config);
  },

  delete(endpoint, data = null, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = objectToFormData(data);
    let config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
      body: formData,
    };
    return fetch(`${endpoint}?${params}`, config);
  },
};
