import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";


export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/otp/send", { contact });
      setIsNewUser(res.data.isNewUser);
      console.log("OTP Response:", res.data);
      setStep(2);
    } catch (err) {
      console.log("OTP Error:", err); 
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  const goAfterLogin = ({ isNewUser, user }) => {
  if (isNewUser) return navigate("/complete-profile", { replace: true });

  if (user?.role === "admin") return navigate("/admin", { replace: true });

  return navigate("/home", { replace: true });
};

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/otp/verify", {
        contact,
        otp,
        ...(isNewUser ? { name } : {}),
      });

      dispatch(setCredentials({
        accessToken: res.data.accessToken,
        user: res.data.user,
      }))

      goAfterLogin({ isNewUser: res.data.isNewUser, user: res.data.user });

    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const res = await api.post("/auth/google", {
        access_token: tokenResponse.access_token,
      });

      dispatch(setCredentials({
        accessToken: res.data.accessToken,
        user: res.data.user,
      }))

     goAfterLogin({ isNewUser: res.data.isNewUser, user: res.data.user });
     
    } catch (err) {
      setError("Google login failed");
    }
  },
  flow: "implicit",
});

  return (
    <>
      <div className="mx-auto flex min-h-screen  bg-[#E9E9E9]">
        <section className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative h-[360px] w-[520px]">
           
                <div className="absolute bottom-6 left-16 h-6 w-[360px] rounded-full bg-black/5 blur-[1px]"></div>

                {/* <!-- orange half-circle --> */}
                <div className="absolute z-10 bottom-6 left-8 h-48 w-96 overflow-hidden rounded-t-[999px] bg-[#FF7A2F]">
                  {/* <!-- face --> */}
                  <div className="absolute left-1/2 top-20 h-4 w-4 -translate-x-12 rounded-full bg-black/70"></div>
                  <div className="absolute left-1/2 top-20 h-4 w-4 translate-x-10 rounded-full bg-black/70"></div>
                  <div className="absolute left-1/2 top-[116px] h-3 w-6 -translate-x-3 rounded-b-full bg-black/70"></div>
                </div>

                {/* <!-- purple tall --> */}
                <div className="absolute bottom-20 left-64 h-80 w-40 rounded-sm bg-[#6A39FF]">
                  <div className="absolute left-10 top-12 h-3 w-3 rounded-full bg-white/90"></div>
                  <div className="absolute right-10 top-12 h-3 w-3 rounded-full bg-white/90"></div>
                  <div className="absolute left-1/2 top-12 h-10 w-2 -translate-x-1 rounded bg-black/70"></div>
                </div>

                {/* <!-- black tall --> */}
                <div className="absolute bottom-6 left-96 h-64 w-32 rounded-sm bg-[#1F2025]">
                  <div className="absolute left-12 top-12 h-3 w-3 rounded-full bg-white/90"></div>
                  <div className="absolute right-12 top-12 h-3 w-3 rounded-full bg-white/90"></div>
                </div>

                {/* <!-- yellow capsule --> */}
                <div className="absolute bottom-6 left-[450px] h-52 w-40 rounded-t-[999px] bg-[#F4C400]">
                  <div className="absolute left-14 top-14 h-3 w-3 rounded-full bg-black/70"></div>
                  <div className="absolute left-20 top-[84px] h-2 w-24 rounded-full bg-black/70"></div>
                </div>
              </div>
            </div>
            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg rounded-3xl bg-white px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                {/* <!-- top center logo --> */}
                <div className="flex justify-center">
                  <div className="relative h-20 w-20">
                    <img src="https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771488532/LogoTp_v6sqpl.png" alt="Logo" />
                  </div>
                </div>

                <h1 className="mt-4 text-center text-4xl font-semibold tracking-tight text-zinc-900">
                  Welcome back!
                </h1>
                <p className="mt-2 text-center text-sm text-zinc-500">Please sign in to continue</p>

                 {error && (
                  <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
                    {error}
                  </div>
                )} 
                <AnimatePresence mode="wait">
                 {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22 }}
                    className="mt-10"
                  >
                  <div className="">
                    <label className="sr-only" htmlFor="contact">
                      Phone number or email
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm focus-within:border-zinc-400">
                      <div
                        aria-label="Country code"
                        className="w-28 bg-transparent text-sm text-zinc-700 outline-none select-none"
                        style={{ fontFamily: "Segoe UI Emoji, system-ui" }}
                      >
                        🇮🇳 +91
                      </div>

                      <div className="h-6 w-px bg-zinc-200" />

                      <input
                        id="contact"
                        type="text"
                        placeholder="Phone number or Email"
                        className="w-full bg-transparent text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || !contact.trim()}
                      className="mt-6 w-full rounded-full bg-[#1C1D21] py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-95 active:brightness-90 disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Continue"}
                    </button>

                    <div className="my-8 flex items-center gap-3">
                      <div className="h-px flex-1 bg-zinc-200" />
                      <span className="text-xs font-medium text-zinc-400">OR</span>
                      <div className="h-px flex-1 bg-zinc-200" />
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={() => googleLogin()}
                      className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white py-4 text-base font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                    >
                      <svg width="22" height="22" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 3.1l6-6C34.5 3.3 29.7 1.5 24 1.5 14.7 1.5 6.7 6.8 2.9 14.4l7 5.4C12 14 17.5 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.6c-.5 3-2.2 5.6-4.8 7.3l7.3 5.6c4.3-4 7.4-9.9 7.4-14.6z"></path>
                        <path fill="#FBBC05" d="M9.9 28.3c-.6-1.7-.9-3.5-.9-5.3s.3-3.6.9-5.3l-7-5.4C1.3 15.5.5 19.1.5 23s.8 7.5 2.4 10.7l7-5.4z"></path>
                        <path fill="#34A853" d="M24 46.5c5.7 0 10.5-1.9 14-5.1l-7.3-5.6c-2 1.4-4.6 2.3-6.7 2.3-6.5 0-12-4.4-14-10.4l-7 5.4C6.7 41.2 14.7 46.5 24 46.5z"></path>
                      </svg>

                      Sign in with Google
                    </button>

                    <p className="mt-10 text-center text-sm text-zinc-500">
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        onClick={() =>{
                          setStep(1);
                          setOtp("");
                          setName("");
                        }}
                        className="font-semibold text-[#1C1D21] hover:underline"
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                  </motion.div>
                )}
                {/* STEP 2 */}
                {step === 2 && (
                   <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22 }}
                    className="mt-10"
                  >
                  <div className="">
                    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
                      <p className="text-xs text-zinc-500">Sent OTP to</p>
                      <p className="text-sm font-semibold text-zinc-900 break-all">
                        {contact}
                      </p>
                    </div>

                    <div className="mt-4">
                      <label className="sr-only" htmlFor="name">
                        Name
                      </label>
                      {isNewUser && (
                      <input
                        id="name"
                        type="text"
                        placeholder="Your Name (first time only)"
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none focus:border-zinc-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="sr-only" htmlFor="otp">
                        OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6 digit OTP"
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none focus:border-zinc-400"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.trim().length < 4}
                      className="mt-6 w-full rounded-full bg-[#1C1D21] py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-95 active:brightness-90 disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>

                    <p className="mt-10 text-center text-sm text-zinc-500">
                      Would you like to update phone number or email address?{" "}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="font-semibold text-[#1C1D21] hover:underline"
                      >
                        Update
                      </button>
                    </p>
                  </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
        </section>
        
      </div>
    </>
  );
}
