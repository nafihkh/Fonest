import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { showToast } from "../../store/slices/toastSlice";
import { applyTheme } from "../../theme/theme";
import {
  User as UserIcon,
  Shield,
  Bell,
  Palette,
  Upload,
  Save,
  Loader2,
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
} from "lucide-react";

function Card({ title, subtitle, icon: Icon, children, right }) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {Icon ? (
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center">
                <Icon size={18} className="text-indigo-600 dark:text-indigo-300" />
              </span>
            ) : null}

            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              {subtitle ? (
                <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          {right}
        </div>
      </div>

      <div className="px-6 pb-6 pt-5">{children}</div>
    </section>
  );
}

function Label({ children }) {
  return (
    <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={[
        "w-full h-11 rounded-2xl px-4 text-[14px]",
        "bg-white dark:bg-slate-900",
        "border border-slate-200/70 dark:border-slate-700",
        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
        className,
      ].join(" ")}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={[
          "w-full h-11 rounded-2xl px-4 pr-10 text-[14px]",
          "appearance-none",
          "bg-white dark:bg-slate-900",
          "border border-slate-200/70 dark:border-slate-700",
          "text-slate-900 dark:text-slate-100",
          "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
          className,
        ].join(" ")}
      >
        {children}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function OutlineBtn({ label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                 border border-slate-200/70 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-700 dark:text-slate-200
                 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                 disabled:opacity-60"
    >
      {label}
    </button>
  );
}

function PrimaryBtn({ label, onClick, disabled = false, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 px-5 rounded-2xl text-[13px] font-semibold
                 bg-indigo-600 text-white hover:bg-indigo-700 transition
                 shadow-sm inline-flex items-center gap-2
                 disabled:opacity-60"
    >
      {Icon ? <Icon size={16} /> : null}
      {label}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "relative w-12 h-7 rounded-full transition",
        checked
          ? "bg-indigo-600"
          : "bg-slate-200 dark:bg-slate-700",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function TabBtn({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition",
        active
          ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      <Icon size={18} />
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}

function SettingRow({ title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0 border-slate-200/70 dark:border-slate-700">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </div>
        {description ? (
          <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
            {description}
          </div>
        ) : null}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function SkeletonLine({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`} />
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Card title="Loading settings..." subtitle="Please wait">
        <div className="space-y-4">
          <SkeletonLine className="h-11 w-full" />
          <SkeletonLine className="h-11 w-full" />
          <SkeletonLine className="h-11 w-full" />
          <SkeletonLine className="h-24 w-full" />
        </div>
      </Card>
    </div>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const tabs = useMemo(
    () => [
      { key: "profile", label: "Profile", icon: UserIcon },
      { key: "appearance", label: "Appearance", icon: Palette },
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "security", label: "Security & Privacy", icon: Shield },
    ],
    []
  );
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: { url: "", publicId: "" },
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [appearance, setAppearance] = useState({
    theme: "system",
  });

  const [notifications, setNotifications] = useState({
    stockAlerts: true,
    outOfStockAlerts: true,
    returnRequests: true,
    dailySalesSummary: true,
    systemUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeoutMinutes: 30,
    profileVisibility: "private",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/settings");

      const loadedProfile = res.data.profile || {
        name: "",
        email: "",
        phone: "",
        avatar: { url: "", publicId: "" },
      };

      const loadedAppearance = res.data.settings?.appearance || {
        theme: "system",
      };

      const loadedNotifications = res.data.settings?.notifications || {
        stockAlerts: true,
        outOfStockAlerts: true,
        returnRequests: true,
        dailySalesSummary: true,
        systemUpdates: true,
      };

      const loadedSecurity = res.data.settings?.security || {
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeoutMinutes: 30,
        profileVisibility: "private",
      };

      setProfile(loadedProfile);
      setProfileForm({
        name: loadedProfile.name || "",
        email: loadedProfile.email || "",
        phone: loadedProfile.phone || "",
      });

      setAppearance(loadedAppearance);
      setNotifications(loadedNotifications);
      setSecurity(loadedSecurity);

      applyTheme(loadedAppearance.theme);
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          type: "error",
          title: "Load Failed",
          message: err?.response?.data?.message || "Failed to load settings.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);
  const handleCancelEditProfile = () => {
    setProfileForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });
    setIsEditingProfile(false);
  };
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const res = await api.patch("/api/settings/profile", {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      });

      const updatedProfile = res.data.profile;

      setProfile(updatedProfile);

      setProfileForm({
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
      });

      setIsEditingProfile(false);

      dispatch(
        showToast({
          type: "success",
          title: "Profile Updated",
          message: "Profile updated successfully.",
        })
      );
    } catch (err) {
      console.error(err);

      dispatch(
        showToast({
          type: "error",
          title: "Update Failed",
          message: err?.response?.data?.message || "Failed to update profile.",
        })
      );
    } finally {
      setSaving(false);
    }
  };
  const handleStartEditProfile = () => {
    setProfileForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });
    setIsEditingProfile(true);
  };

  const saveAppearance = async () => {
    try {
      setSaving(true);

      await api.patch("/api/settings/appearance", {
        theme: appearance.theme,
      });

      applyTheme(appearance.theme);

      dispatch(
        showToast({
          type: "success",
          title: "Appearance Updated",
          message: "Theme settings saved successfully.",
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          type: "error",
          title: "Save Failed",
          message: err?.response?.data?.message || "Failed to save appearance settings.",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setSaving(true);

      await api.patch("/api/settings/notifications", notifications);

      dispatch(
        showToast({
          type: "success",
          title: "Notifications Updated",
          message: "Notification preferences saved successfully.",
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          type: "error",
          title: "Save Failed",
          message: err?.response?.data?.message || "Failed to save notification settings.",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const saveSecurity = async () => {
    try {
      setSaving(true);

      await api.patch("/api/settings/security", security);

      dispatch(
        showToast({
          type: "success",
          title: "Security Updated",
          message: "Security & privacy settings saved successfully.",
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          type: "error",
          title: "Save Failed",
          message: err?.response?.data?.message || "Failed to save security settings.",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("avatar", file);

      setSaving(true);

      const res = await api.patch("/api/settings/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data.profile);

      dispatch(
        showToast({
          type: "success",
          title: "Avatar Updated",
          message: "Profile image uploaded successfully.",
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          type: "error",
          title: "Upload Failed",
          message: err?.response?.data?.message || "Failed to upload avatar.",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const themeCards = [
    {
      key: "light",
      title: "Light",
      icon: Sun,
      desc: "Bright workspace for daytime use.",
    },
    {
      key: "dark",
      title: "Dark",
      icon: Moon,
      desc: "Comfortable low-light dashboard view.",
    },
    {
      key: "system",
      title: "System",
      icon: Monitor,
      desc: "Follow your device appearance.",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
              Settings
            </h1>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
              Configure your admin environment, notification flow, privacy, and profile preferences.
            </p>
          </div>

          <PrimaryBtn
            label={saving ? "Saving..." : "Save Current Changes"}
            icon={saving ? Loader2 : Save}
            disabled={saving}
            onClick={() => {
              if (activeTab === "profile") saveProfile();
              if (activeTab === "appearance") saveAppearance();
              if (activeTab === "notifications") saveNotifications();
              if (activeTab === "security") saveSecurity();
            }}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-4 h-fit">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <TabBtn
                  key={tab.key}
                  icon={tab.icon}
                  label={tab.label}
                  active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                />
              ))}
            </div>
          </div>

          <div>
            {loading ? (
              <SettingsSkeleton />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  {activeTab === "profile" && (
                    <>
                      <Card
                        title="Profile Settings"
                        subtitle="Update your admin identity and contact information."
                        icon={UserIcon}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
                          <div className="space-y-4">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden border border-slate-200/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                              {profile.avatar?.url ? (
                                <img
                                  src={profile.avatar.url}
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full grid place-items-center text-slate-500 dark:text-slate-400 text-[13px] font-semibold">
                                  No Avatar
                                </div>
                              )}
                            </div>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                            />

                            <OutlineBtn
                              label={saving ? "Uploading..." : "Upload Avatar"}
                              onClick={() => fileInputRef.current?.click()}
                              disabled={saving}
                            />
                          </div>

                          {isEditingProfile ? (
                          <div className="space-y-4">
                            <div>
                              <Label>Full Name</Label>
                              <div className="mt-2">
                                <Input
                                  value={profileForm.name}
                                  onChange={(e) =>
                                    setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Email</Label>
                              <div className="mt-2">
                                <Input
                                  type="email"
                                  value={profileForm.email}
                                  onChange={(e) =>
                                    setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Phone</Label>
                              <div className="mt-2">
                                <Input
                                  value={profileForm.phone}
                                  onChange={(e) =>
                                    setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                              <OutlineBtn label="Cancel" onClick={handleCancelEditProfile} />
                              <PrimaryBtn
                                label={saving ? "Saving..." : "Save Changes"}
                                onClick={handleSaveProfile}
                                disabled={saving}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <Label>Full Name</Label>
                              <div className="mt-2 text-[14px] text-slate-900 dark:text-slate-100">
                                {profile.name || "—"}
                              </div>
                            </div>

                            <div>
                              <Label>Email</Label>
                              <div className="mt-2 text-[14px] text-slate-900 dark:text-slate-100">
                                {profile.email || "—"}
                              </div>
                            </div>

                            <div>
                              <Label>Phone</Label>
                              <div className="mt-2 text-[14px] text-slate-900 dark:text-slate-100">
                                {profile.phone || "—"}
                              </div>
                            </div>

                            <div className="pt-2">
                              <PrimaryBtn label="Edit Profile" onClick={handleStartEditProfile} />
                            </div>
                          </div>
                        )}
                        </div>
                      </Card>
                    </>
                  )}

                  {activeTab === "appearance" && (
                    <Card
                      title="Appearance"
                      subtitle="Choose how your admin panel should look."
                      icon={Palette}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themeCards.map((theme) => {
                          const Icon = theme.icon;
                          const selected = appearance.theme === theme.key;

                          return (
                            <button
                              key={theme.key}
                              type="button"
                              onClick={() => {
                                setAppearance((prev) => ({ ...prev, theme: theme.key }));
                                applyTheme(theme.key);
                              }}
                              className={[
                                "text-left rounded-2xl border p-5 transition",
                                selected
                                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                  : "border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
                                  <Icon size={18} className="text-indigo-600 dark:text-indigo-300" />
                                </span>

                                {selected ? <PillSelected /> : null}
                              </div>

                              <div className="mt-4 text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                                {theme.title}
                              </div>
                              <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                                {theme.desc}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-5">
                        <PrimaryBtn
                          label={saving ? "Saving..." : "Save Appearance"}
                          icon={CheckCircle2}
                          disabled={saving}
                          onClick={saveAppearance}
                        />
                      </div>
                    </Card>
                  )}

                  {activeTab === "notifications" && (
                    <Card
                      title="Notification Settings"
                      subtitle="Control which operational alerts you receive."
                      icon={Bell}
                    >
                      <div className="space-y-1">
                        <SettingRow
                          title="Low Stock Alerts"
                          description="Notify when a product stock reaches its threshold."
                          action={
                            <Toggle
                              checked={notifications.stockAlerts}
                              onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, stockAlerts: value }))
                              }
                            />
                          }
                        />

                        <SettingRow
                          title="Out of Stock Alerts"
                          description="Notify when a product becomes unavailable."
                          action={
                            <Toggle
                              checked={notifications.outOfStockAlerts}
                              onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, outOfStockAlerts: value }))
                              }
                            />
                          }
                        />

                        <SettingRow
                          title="Return Requests"
                          description="Get notified for new customer return requests."
                          action={
                            <Toggle
                              checked={notifications.returnRequests}
                              onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, returnRequests: value }))
                              }
                            />
                          }
                        />

                        <SettingRow
                          title="Daily Sales Summary"
                          description="Receive daily sales summary notifications."
                          action={
                            <Toggle
                              checked={notifications.dailySalesSummary}
                              onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, dailySalesSummary: value }))
                              }
                            />
                          }
                        />

                        <SettingRow
                          title="System Updates"
                          description="Receive updates about platform improvements and maintenance."
                          action={
                            <Toggle
                              checked={notifications.systemUpdates}
                              onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, systemUpdates: value }))
                              }
                            />
                          }
                        />
                      </div>

                      <div className="pt-5">
                        <PrimaryBtn
                          label={saving ? "Saving..." : "Save Notifications"}
                          icon={CheckCircle2}
                          disabled={saving}
                          onClick={saveNotifications}
                        />
                      </div>
                    </Card>
                  )}

                  {activeTab === "security" && (
                    <Card
                      title="Security & Privacy"
                      subtitle="Adjust privacy visibility and account protection settings."
                      icon={Shield}
                    >
                      <div className="space-y-5">
                        <SettingRow
                          title="Two-Factor Authentication"
                          description="Add an extra layer of security to admin sign-in."
                          action={
                            <Toggle
                              checked={security.twoFactorEnabled}
                              onChange={(value) =>
                                setSecurity((prev) => ({ ...prev, twoFactorEnabled: value }))
                              }
                            />
                          }
                        />

                        <SettingRow
                          title="Login Alerts"
                          description="Receive alerts when new sign-ins are detected."
                          action={
                            <Toggle
                              checked={security.loginAlerts}
                              onChange={(value) =>
                                setSecurity((prev) => ({ ...prev, loginAlerts: value }))
                              }
                            />
                          }
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Session Timeout (Minutes)</Label>
                            <div className="mt-2">
                              <Input
                                type="number"
                                value={security.sessionTimeoutMinutes}
                                onChange={(e) =>
                                  setSecurity((prev) => ({
                                    ...prev,
                                    sessionTimeoutMinutes: e.target.value,
                                  }))
                                }
                                placeholder="Enter timeout"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Profile Visibility</Label>
                            <div className="mt-2">
                              <Select
                                value={security.profileVisibility}
                                onChange={(e) =>
                                  setSecurity((prev) => ({
                                    ...prev,
                                    profileVisibility: e.target.value,
                                  }))
                                }
                              >
                                <option value="private">Private</option>
                                <option value="team">Team</option>
                                <option value="public">Public</option>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4">
                            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                              <Eye size={16} />
                              Privacy Protected
                            </div>
                            <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                              Keep your admin profile visibility restricted to your preferred audience.
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4">
                            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                              <EyeOff size={16} />
                              Session Control
                            </div>
                            <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                              Limit inactive sessions automatically using timeout rules.
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <PrimaryBtn
                            label={saving ? "Saving..." : "Save Security"}
                            icon={CheckCircle2}
                            disabled={saving}
                            onClick={saveSecurity}
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function PillSelected() {
  return (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
      Selected
    </span>
  );
}