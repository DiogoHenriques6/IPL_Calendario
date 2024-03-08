import { hasValidAuthToken, hasValidRefreshToken } from "./auth";

export async function requestInterceptor(config) {
  if (!hasValidAuthToken()) {
    if (hasValidRefreshToken()) {
      await refreshToken();
    }
  }
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

export const refreshToken = async () => {
  // const refreshToken = localStorage.getItem("refresh_token");
  // Retrieve new auth token :) axios.post...
};
