import { instance, instanceFile } from "@/api/instance";
import { AxiosRequestConfig } from "axios";
type Auth = {
  username: string;
  password: string;
};
function useCallApi() {
  const UseGet = <T>({
    url = "",
    params = {},
    requiredToken = false,
    headers = {} as Record<string, string>,
  }) => {
    let fullHeader = { ...headers };
    // If required TOKEN -> Get Access Token from Cookies
    // console.log("requiredToken:", requiredToken);

    requiredToken &&
      (fullHeader["Authorization"] = `Bearer ${localStorage.getItem(
        "tokenMeta"
      )}`);
    return new Promise<T>((resolve, reject) => {
      instance
        .get(url, {
          params,
          ...instance.defaults.headers,
          headers: { ...fullHeader },
        })
        .then((response) => {
          resolve(response as T);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const UsePostFile = <T>({
    url = "",
    data = {},
    params = {},
    requiredToken = false,
    basicAuth = false,
    auth = {} as Auth,
  }) => {
    let credentials = btoa(`${auth.username}:${auth.password}`);
    // If required TOKEN -> Get Access Token from LocalStorage
    requiredToken &&
      (instanceFile.defaults.headers[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("tokenMeta")}`);
    basicAuth &&
      (instanceFile.defaults.headers["Authorization"] = `Basic ${credentials}`);

    return new Promise((resolve, reject) => {
      instanceFile
        .post(url, data, {
          params,
          ...instanceFile.defaults.headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const UsePost = <T>({
    url = "",
    data = {},
    params = {},
    requiredToken = false,
    basicAuth = false,
    uploadFile = false,
    auth = {} as Auth,
  }) => {
    let credentials = btoa(`${auth.username}:${auth.password}`);
    // If required TOKEN -> Get Access Token from LocalStorage
    requiredToken &&
      (instance.defaults.headers[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("tokenMeta")}`);
    uploadFile &&
      (instance.defaults.headers["Content-Type"] = "multipart/form-data");
    basicAuth &&
      (instance.defaults.headers["Authorization"] = `Basic ${credentials}`);

    return new Promise((resolve, reject) => {
      instance
        .post(url, data, {
          params,
          ...instance.defaults.headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const UseEdit = <T>({
    url = "",
    data = {},

    params = {},
    requiredToken = false,
  }) => {
    // If required TOKEN -> Get Access Token from LocalStorage
    requiredToken &&
      (instance.defaults.headers[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("tokenMeta")}`);
    return new Promise((resolve, reject) => {
      instance
        .put(url, data, {
          params,
          ...instance.defaults.headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const UseDelete = <T>({
    url = "",
    data = {},

    params = {},
    requiredToken = false,
  }) => {
    // If required TOKEN -> Get Access Token from LocalStorage
    requiredToken &&
      (instance.defaults.headers[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("tokenMeta")}`);
    return new Promise((resolve, reject) => {
      instance
        .delete(url, {
          params,
          ...instance.defaults.headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return {
    UseGet,
    UsePost,
    UseEdit,
    UseDelete,
    UsePostFile,
  };
}
export default useCallApi;
