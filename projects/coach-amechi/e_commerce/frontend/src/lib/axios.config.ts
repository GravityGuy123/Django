import axios from "axios";

export const baseUrl: string =
  process.env.NEXT_PUPLIC_API_URL || "http://127.0.0.1:8000";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleApiError = (error: unknown, message: string) => {
  let errorMessage;

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data.details || message;
  }
  return errorMessage;
};
