import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_SERVER_URL;
const gtpURL = import.meta.env.VITE_GPT_SERVER_URL;

const axiosServerInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const axiosServerInstanceWithoutCredentials = axios.create({
  baseURL,
});

const axiosGptInstance = axios.create({
  baseURL: gtpURL,
  withCredentials: true,
});

export { axiosServerInstance, axiosGptInstance, axiosServerInstanceWithoutCredentials };
