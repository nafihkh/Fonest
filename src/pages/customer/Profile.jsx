import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import ProfileMobileView from "../../components/customer/Mobile/ProfilePage";
import ProfileDesktopView from "../../components/customer/Desktop/ProfilePage";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchMyProfile,
  fetchMySettings,
  fetchMyAddresses,
  selectProfile,
  selectProfileSettings,
  selectProfileAddresses,
  selectProfileLoading,
  selectSettingsLoading,
  selectAddressesLoading,
  selectProfileError,
  selectSettingsError,
  selectAddressesError,
} from "../../store/slices/profileSlice";

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.remove("dark");
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function ProfilePageContainer() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);
  const [search, setSearch] = useState("");

  const profile = useSelector(selectProfile);
  const settings = useSelector(selectProfileSettings);
  const addresses = useSelector(selectProfileAddresses);

  const loadingProfile = useSelector(selectProfileLoading);
  const loadingSettings = useSelector(selectSettingsLoading);
  const loadingAddresses = useSelector(selectAddressesLoading);

  const errorProfile = useSelector(selectProfileError);
  const errorSettings = useSelector(selectSettingsError);
  const errorAddresses = useSelector(selectAddressesError);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchMySettings());
    dispatch(fetchMyAddresses());
  }, [dispatch]);

  useEffect(() => {
    const theme = settings?.appearance?.theme || "system";
    applyTheme(theme);
  }, [settings?.appearance?.theme]);

  const loading = useMemo(
    () => loadingProfile || loadingSettings || loadingAddresses,
    [loadingProfile, loadingSettings, loadingAddresses]
  );

  const error = errorProfile || errorSettings || errorAddresses;

  const sharedProps = {
    profile,
    settings,
    addresses,
    loading,
    error,
    search,
    setSearch,
  };

  if (isMobile) {
    return (
      <MobileLayout
        showHeader={false}
        headerProps={{
          searchValue: search,
          onSearchChange: setSearch,
          showDelivery: false,
        }}
      >
        <ProfileMobileView {...sharedProps} />
      </MobileLayout>
    );
  }

  return <ProfileDesktopView {...sharedProps} />;
}