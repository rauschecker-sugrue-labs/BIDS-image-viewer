import axios from "axios";
import { API_URL } from "./apiConfig";
axios.defaults.baseURL = API_URL;

const apiCall = (apiFunc) => {
  return apiFunc()
    .then((response) => response.data)
    .catch((error) => {
      console.error("API Error: ", error);
      throw error;
    });
};

export const getSubjectsSessions = () => {
  return apiCall(() => axios.get("/api/get-subjects-sessions"));
};

export const getFields = () => {
  return apiCall(() => axios.get("/api/get-fields"));
};

export const updateFields = (params) => {
  return apiCall(() => axios.post("/api/update-fields", params));
};

export const getPath = (params) => {
  return apiCall(() => axios.post("/api/get-image-path", params));
};
