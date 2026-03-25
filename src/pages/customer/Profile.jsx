import React, { useState } from "react";
import Footer from "../../components/layout/SiteFooter";
import Header from "../../components/layout/SiteHeader"

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
        noBorder ? "" : "border-b border-gray-100"
      }`}
    >
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-[13px] text-gray-500">{description}</p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full relative transition peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-300 after:transition-all peer-checked:after:translate-x-full" />
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
    <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                    <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                    />
                    </div>

                    <h2 className="text-[18px] font-bold text-gray-900 mb-1">
                    {profile.fullName}
                    </h2>
                    <p className="text-[14px] text-gray-500">{profile.email}</p>
                </div>

                <div className="space-y-2">
                    <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full px-4 py-3 rounded-xl font-medium text-[14px] text-left flex items-center gap-3 transition-all duration-300 ${
                        activeTab === "profile"
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    >
                    <i className="ri-user-line text-[18px]"></i>
                    Profile Information
                    </button>

                    <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full px-4 py-3 rounded-xl font-medium text-[14px] text-left flex items-center gap-3 transition-all duration-300 ${
                        activeTab === "settings"
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    >
                    <i className="ri-settings-3-line text-[18px]"></i>
                    Settings
                    </button>

                    <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full px-4 py-3 rounded-xl font-medium text-[14px] text-left flex items-center gap-3 transition-all duration-300 ${
                        activeTab === "addresses"
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    >
                    <i className="ri-map-pin-line text-[18px]"></i>
                    Saved Addresses
                    </button>

                    <button className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-[14px] text-left flex items-center gap-3 transition-all duration-300">
                    <i className="ri-logout-box-line text-[18px]"></i>
                    Logout
                    </button>
                </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-2 space-y-8">
                {activeTab === "profile" && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">
                        Profile Information
                    </h2>

                    <button
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium text-[14px] hover:bg-red-700 transition-all duration-300"
                    >
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                    </div>

                    <div className="space-y-5">
                    <div>
                        <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                        Full Name
                        </label>
                        <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-red-600 focus:outline-none text-[15px] disabled:opacity-60 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                        Email Address
                        </label>
                        <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-red-600 focus:outline-none text-[15px] disabled:opacity-60 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                        Phone Number
                        </label>
                        <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-red-600 focus:outline-none text-[15px] disabled:opacity-60 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-[14px] font-semibold text-gray-900 mb-2">
                        Address
                        </label>
                        <textarea
                        rows={3}
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-red-600 focus:outline-none text-[15px] disabled:opacity-60 resize-none transition-all duration-300"
                        />
                    </div>
                    </div>
                </div>
                )}

                {activeTab === "settings" && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                    <h2 className="text-[20px] font-bold text-gray-900 mb-6">
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
                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">
                        Saved Addresses
                    </h2>

                    <button className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium text-[14px] hover:bg-red-700 transition-all duration-300">
                        Add Address
                    </button>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-2">
                        Default Address
                    </h3>
                    <p className="text-[14px] text-gray-600 leading-relaxed">
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