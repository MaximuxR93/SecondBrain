import axios from "axios";

const API_URL = "http://192.168.1.2:5000";

export const analyzeVideo = async (url: string) => {
  const response = await axios.post(
    `${API_URL}/analyze`,
    { url }
  );

  return response.data;
};