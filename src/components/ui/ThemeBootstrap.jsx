import { useEffect } from "react";
import { useSelector } from "react-redux";
import { api } from "../../services/api";
import { applyTheme } from "../../theme/theme";

export default function ThemeBootstrap() {
  const accessToken = useSelector((state) => state.auth?.accessToken);
  const authBootstrapped = useSelector((state) => state.auth?.bootstrapped);

  useEffect(() => {
    if (!authBootstrapped) return;

    const loadTheme = async () => {
      try {
        // If user is logged in, load from DB
        if (accessToken) {
          const res = await api.get("/api/settings");
          const theme = res.data?.settings?.appearance?.theme || "system";
          applyTheme(theme);
          return;
        }

        // If not logged in, still apply a safe default
        applyTheme("system");
      } catch (err) {
        console.error("Theme bootstrap failed:", err);
        applyTheme("system");
      }
    };

    loadTheme();
  }, [authBootstrapped, accessToken]);

  return null;
}