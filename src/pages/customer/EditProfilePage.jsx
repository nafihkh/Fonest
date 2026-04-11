import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import {
  fetchMyProfile,
  updateMyProfile,
  selectProfile,
  selectProfileLoading,
  selectProfileSaving,
  selectProfileError,
} from "../../store/slices/profileSlice";

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const saving = useSelector(selectProfileSaving);
  const error = useSelector(selectProfileError);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (!profile) {
      dispatch(fetchMyProfile());
    } else {
      setForm({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
      });
    }
  }, [dispatch, profile]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = useCallback(async () => {
    const result = await dispatch(updateMyProfile(form));
    if (updateMyProfile.fulfilled.match(result)) {
      navigate("/profile");
    }
  }, [dispatch, form, navigate]);

  const fields = [
    { key: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name" },
    { key: "phone", label: "Phone Number", type: "tel", placeholder: "Enter phone number" },
  ];

  const content = (
    <div>
      {!isMobile && (
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1 text-[14px] text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="ri-arrow-left-line" /> Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h1>
          <p className="mt-1 text-[15px] text-gray-500 dark:text-gray-400">
            Update your personal information
          </p>
        </div>
      )}

      {isMobile && (
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <i className="ri-arrow-left-line text-[18px]" />
          </button>
          <h1 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">Edit Profile</h1>
        </div>
      )}

      {/* Avatar section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative mb-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-4xl font-bold text-white">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              (profile?.fullName || "U")[0].toUpperCase()
            )}
          </div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white shadow-md dark:border-gray-900">
            <i className="ri-camera-line text-[14px]" />
          </button>
        </div>
        <p className="text-[13px] text-gray-500 dark:text-gray-400">{profile?.email}</p>
      </div>

      {loading ? (
        <div className="space-y-5 animate-pulse py-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="mb-1.5 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
          <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      ) : (
        <div className={isMobile ? "" : "rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"}>
          <div className="space-y-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-[13px] font-semibold text-gray-600 dark:text-gray-400">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-500"
                />
              </div>
            ))}

            {/* Read-only email */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-[15px] text-gray-500 opacity-70 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              />
              <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                Email address cannot be changed
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className={`mt-8 flex gap-3 ${isMobile ? "fixed bottom-6 left-4 right-4 z-10" : ""}`}>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[14px] font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <i className="ri-save-line text-[16px]" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Spacer for mobile floating button */}
      {isMobile && <div className="h-24" />}
    </div>
  );

  if (isMobile) {
    return (
      <MobileLayout showHeader={false}>
        {content}
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 pb-20 pt-28">
        {content}
      </div>
      <SiteFooter />
    </div>
  );
}
