import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "../services/api";
import { setCredentials, clearAuth, setBootstrapped } from "../store/authSlice";

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await api.post("/auth/refresh");
        if (!alive) return;
        dispatch(setCredentials({ accessToken: res.data.accessToken, user: res.data.user || null }));
      } catch (e) {
        if (!alive) return;
        dispatch(clearAuth());
      } finally {
        if (alive) dispatch(setBootstrapped(true));
      }
    })();

    return () => {
      alive = false;
    };
  }, [dispatch]);

  return children;
}