import axios from "axios";

const API_URL = "http:// 192.168.1.2:5000";

export const downloadVideo = async (
  url: string,
  formatId: string
) => {
  const response = await axios.post(
    `${API_URL}/download`,
    {
      url,
      formatId,
    }
  );

  return response.data;
};