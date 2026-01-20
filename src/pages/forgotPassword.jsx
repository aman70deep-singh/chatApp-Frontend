import { useState } from "react";
import axiosPublic from "../api/axiosPublic";
import OtpVerification from "../components/OtpVerification";
import ResetPassword from "../components/ResetPassword";
import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
    const [step, setStep] = useState("EMAIL");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required");
            return;
        }

        setLoading(true);

        try {
            const res = await axiosPublic.post("/auth/forgot-password", { email });
            toast.success(res.data.message || "OTP sent to your email");
            setStep("OTP");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Toaster position="top-center" reverseOrder={false} />

            {step === "EMAIL" && (
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Forgot Password
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Enter your email to receive an OTP
                        </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-lg text-white font-medium transition
                         bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            )}

            {step === "OTP" && (
                <OtpVerification
                    email={email}
                    onSuccess={() => setStep("RESET")}
                />
            )}

            {step === "RESET" && (
                <div className="text-center">
                    <ResetPassword email={email} />
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
