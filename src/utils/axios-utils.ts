import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import Cookies from "js-cookie";
// import { fetchNewToken, refreshAuth } from "./refresh-auth";

const api = process.env.NEXT_PUBLIC_BACKEND_API as string;

export const client = axios.create({
  baseURL: api,
});

export const setHeaderToken = (token: string): void => {
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeHeaderToken = (): void => {
  delete client.defaults.headers.common["Authorization"];
};

// Function to refresh the token
// const refreshToken = async (failedRequest: any): Promise<void> => {
//   try {
//     const newToken = await fetchNewToken(); // Call your refresh token API

//     // Store the new token
//     if (newToken) {
//       setHeaderToken(newToken);
//     }

//     // Retry the failed request with the new token
//     failedRequest.response.config.headers[
//       "Authorization"
//     ] = `Bearer ${newToken}`;

//     return Promise.resolve();
//   } catch (error) {
//     removeHeaderToken();
//     // Handle token refresh failure (e.g., logout or redirect)
//     // Example: router.push('/login');
//     return Promise.reject(error);
//   }
// };

// Attach the interceptor
// createAuthRefreshInterceptor(client, refreshToken, {
//   statusCodes: [401],
//   pauseInstanceWhileRefreshing: true,
// });

export const request = <T = any>(
  options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  client.defaults.withCredentials = true;
  const token = Cookies.get("accessToken");
  if (token) {
    setHeaderToken(token);
  }
  return client(options);
};
