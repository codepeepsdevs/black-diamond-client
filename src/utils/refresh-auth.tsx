// import { client, setHeaderToken } from "./axios-utils";

// export const fetchNewToken = async () => {
//   const api = process.env.NEXT_PUBLIC_BACKEND_API;

//   try {
//     const token: string = await client
//       .get(`${api}/auth/refresh`)
//       .then((res) => res.data.token);
//     return token;
//   } catch (error) {
//     return null;
//   }
// };

// export const refreshAuth = async (failedRequest: any) => {
//   const newToken = await fetchNewToken();

//   if (newToken) {
//     failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
//     setHeaderToken(newToken);
//     // you can set your token in storage too
//     // setToken({ token: newToken });
//     return Promise.resolve(newToken);
//   } else {
//     localStorage.clear();
//     return Promise.reject();
//   }
// };
