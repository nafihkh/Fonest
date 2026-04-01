import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteFooter from "../../layout/SiteFooter";
import SiteHeader from "../../layout/SiteHeader";

function ToggleRow({ title, description, checked, onChange, noBorder = false }) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        noBorder ? "" : "border-b border-gray-100 dark:border-gray-800"
      }`}
    >
      <div>
        <h3 className="mb-1 text-[15px] font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
        <div className="relative h-6 w-11 rounded-full bg-gray-200 transition dark:bg-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full dark:after:border-gray-500" />
      </label>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium transition-all duration-300 ${
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <i className={`${icon} text-[18px]`} />
      {label}
    </button>
  );
}

export default function ProfileSection({
  profile,
  settings,
  addresses = [],
  loading,
  error,
  onSaveProfile,
  onSaveSettings,
  onLogout,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
  });

  // Sync form when profile loads
  const syncedFullName = isEditing ? formData.fullName : (profile?.fullName || "");
  const syncedPhone = isEditing ? formData.phone : (profile?.phone || "");

  const handleEditToggle = async () => {
    if (isEditing) {
      setSaving(true);
      await onSaveProfile?.({ fullName: formData.fullName, phone: formData.phone });
      setSaving(false);
    } else {
      setFormData({ fullName: profile?.fullName || "", phone: profile?.phone || "" });
    }
    setIsEditing((prev) => !prev);
  };

  const handleSettingToggle = (key, value) => {
    onSaveSettings?.({ notifications: { [key]: value } });
  };

  const emailNotifs = settings?.notifications?.email ?? true;
  const smsNotifs = settings?.notifications?.sms ?? false;
  const orderNotifs = settings?.notifications?.orderUpdates ?? true;
  const darkMode = settings?.appearance?.theme === "dark";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      <SiteHeader />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                {/* Avatar */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile?.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                        {(profile?.fullName || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h2 className="mb-1 text-[18px] font-bold text-gray-900 dark:text-gray-100">
                    {profile?.fullName || "User"}
                  </h2>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400">
                    {profile?.email || ""}
                  </p>
                </div>

                {/* Nav */}
                <div className="space-y-2">
                  <NavItem
                    icon="ri-user-line"
                    label="Profile Information"
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                  />
                  <NavItem
                    icon="ri-map-pin-line"
                    label="Saved Addresses"
                    active={activeTab === "addresses"}
                    onClick={() => setActiveTab("addresses")}
                  />
                  <NavItem
                    icon="ri-file-list-3-line"
                    label="My Orders"
                    active={false}
                    onClick={() => navigate("/purchase-history")}
                  />
                  <NavItem
                    icon="ri-settings-3-line"
                    label="Settings"
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                  />
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium text-red-500 transition-all duration-300 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <i className="ri-logout-box-line text-[18px]" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Loading / Error */}
              {loading && (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-400 dark:border-gray-800 dark:bg-gray-900">
                  <i className="ri-loader-4-line animate-spin text-[36px]" />
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-100 bg-white p-6 text-center text-red-500 dark:border-red-800/30 dark:bg-gray-900 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Profile Tab */}
              {!loading && activeTab === "profile" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
                      Profile Information
                    </h2>
                    <button
                      onClick={handleEditToggle}
                      disabled={saving}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-[14px] font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {saving ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: "Full Name", key: "fullName", type: "text", value: syncedFullName },
                      { label: "Phone Number", key: "phone", type: "tel", value: syncedPhone },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="mb-2 block text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                          {f.label}
                        </label>
                        <input
                          type={f.type}
                          value={f.value}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [f.key]: e.target.value }))
                          }
                          disabled={!isEditing}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] transition-all focus:border-blue-600 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
                        />
                      </div>
                    ))}

                    {/* Read-only fields */}
                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <p className="mt-1 text-[12px] text-gray-400">Email cannot be changed</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {!loading && activeTab === "addresses" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={() => navigate("/profile/addresses/new")}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Add Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                      <i className="ri-map-pin-line text-[48px]" />
                      <p className="mt-2 text-[14px]">No saved addresses yet</p>
                      <button
                        onClick={() => navigate("/profile/addresses/new")}
                        className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-[14px] font-medium text-white hover:bg-blue-700 dark:bg-blue-500"
                      >
                        Add First Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="mb-1 flex items-center gap-2">
                                <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                                  {addr.fullName}
                                </span>
                                <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] capitalize text-gray-500 dark:border-gray-700">
                                  {addr.label || addr.type || "home"}
                                </span>
                                {addr.isDefault && (
                                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                                {[addr.addressLine1 || addr.line1, addr.city, addr.state, addr.pincode]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {!loading && activeTab === "settings" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-6 text-[20px] font-bold text-gray-900 dark:text-gray-100">
                    Settings
                  </h2>
                  <div className="space-y-1">
                    <ToggleRow
                      title="Dark Mode"
                      description="Enable dark theme across the app"
                      checked={darkMode}
                      onChange={() =>
                        onSaveSettings?.({
                          appearance: { theme: darkMode ? "light" : "dark" },
                        })
                      }
                    />
                    <ToggleRow
                      title="Email Notifications"
                      description="Receive order updates via email"
                      checked={emailNotifs}
                      onChange={() => handleSettingToggle("email", !emailNotifs)}
                    />
                    <ToggleRow
                      title="SMS Notifications"
                      description="Receive updates via SMS"
                      checked={smsNotifs}
                      onChange={() => handleSettingToggle("sms", !smsNotifs)}
                    />
                    <ToggleRow
                      title="Order Updates"
                      description="Get notified about order status changes"
                      checked={orderNotifs}
                      onChange={() => handleSettingToggle("orderUpdates", !orderNotifs)}
                      noBorder
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}