import { api } from "./api";
import { setCredentials } from "../store/authSlice";

export async function refreshAccessToken(dispatch) {
  const res = await api.post("/auth/refresh"); // cookie sent automatically
  dispatch(
    setCredentials({
      accessToken: res.data.accessToken,
      user: res.data.user || null,
    })
  );
  return res.data.accessToken;
}