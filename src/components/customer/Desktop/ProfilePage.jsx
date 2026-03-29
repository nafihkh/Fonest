import React, { useState } from "react";
import Footer from "../../layout/SiteFooter";
import Header from "../../layout/SiteHeader";

const initialProfile = {
  fullName: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Street, Silicon Valley, CA 94025",
  avatar:
    "https://readdy.ai/api/search-image?query=professional%20man%20smiling%20portrait%20headshot%20clean%20white%20background%20studio%20lighting%20realistic&width=200&height=200&seq=profileavatar&orientation=squarish",
};

const initialSettings = {
  darkMode: false,
  emailNotifications: true,
  smsNotifications: false,
  orderUpdates: true,
};

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
        <p className="text-[13px] text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className="relative h-6 w-11 rounded-full bg-gray-200 transition dark:bg-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full dark:after:border-gray-500" />
      </label>
    </div>
  );
}

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(initialProfile);
  const [settings, setSettings] = useState(initialSettings);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      <Header />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
            My Profile
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h2 className="mb-1 text-[18px] font-bold text-gray-900 dark:text-gray-100">
                    {profile.fullName}
                  </h2>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400">
                    {profile.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium transition-all duration-300 ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <i className="ri-user-line text-[18px]"></i>
                    Profile Information
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium transition-all duration-300 ${
                      activeTab === "settings"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <i className="ri-settings-3-line text-[18px]"></i>
                    Settings
                  </button>

                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium transition-all duration-300 ${
                      activeTab === "addresses"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <i className="ri-map-pin-line text-[18px]"></i>
                    Saved Addresses
                  </button>

                  <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10">
                    <i className="ri-logout-box-line text-[18px]"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-2">
              {activeTab === "profile" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
                      Profile Information
                    </h2>

                    <button
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] transition-all duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] transition-all duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] transition-all duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-[15px] transition-all duration-300 focus:border-blue-600 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-6 text-[20px] font-bold text-gray-900 dark:text-gray-100">
                    Settings
                  </h2>

                  <div className="space-y-5">
                    <ToggleRow
                      title="Dark Mode"
                      description="Enable dark theme"
                      checked={settings.darkMode}
                      onChange={() => handleToggle("darkMode")}
                    />

                    <ToggleRow
                      title="Email Notifications"
                      description="Receive updates via email"
                      checked={settings.emailNotifications}
                      onChange={() => handleToggle("emailNotifications")}
                    />

                    <ToggleRow
                      title="SMS Notifications"
                      description="Receive updates via SMS"
                      checked={settings.smsNotifications}
                      onChange={() => handleToggle("smsNotifications")}
                    />

                    <ToggleRow
                      title="Order Updates"
                      description="Get notified about order status"
                      checked={settings.orderUpdates}
                      onChange={() => handleToggle("orderUpdates")}
                      noBorder
                    />
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
                      Saved Addresses
                    </h2>

                    <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                      Add Address
                    </button>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-2 text-[16px] font-semibold text-gray-900 dark:text-gray-100">
                      Default Address
                    </h3>
                    <p className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
                      {profile.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}