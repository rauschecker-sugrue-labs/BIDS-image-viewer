import axios from "axios";

const apiCall = (apiFunc) => {
  return apiFunc()
    .then((response) => response.data)
    .catch((error) => {
      console.error("API Error: ", error);
      throw error;
    });
};

export const getSubjectsSessions = () => {
  return apiCall(() => axios.get("/get-subjects-sessions"));
};

export const getFields = () => {
  return apiCall(() => axios.get("/get-fields"));
};

export const updateFields = (params) => {
  return apiCall(() => axios.post("/update-fields", params));
};

export const getPath = (params) => {
  return apiCall(() => axios.post("/get-image-path", params));
};
