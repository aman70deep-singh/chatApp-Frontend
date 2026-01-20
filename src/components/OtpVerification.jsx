import { useState, useRef } from "react";
import axiosPublic from "../api/axiosPublic";
import toast from "react-hot-toast";

const OtpVerification = ({ email, onSuccess }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);

    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join("");

        if (enteredOtp.length < 6) {
            toast.error("Please enter complete OTP");
            return;
        }

        setLoading(true);

        try {
            await axiosPublic.post("/auth/verify-otp", {
                email,
                otp: enteredOtp,
            });

            toast.success("OTP verified successfully");
            onSuccess(); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
                Verify OTP
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
                Enter the 6-digit OTP sent to your email
            </p>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-2 mt-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 text-center text-lg border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                ))}
            </div>

            {/* Button */}
            <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full mt-6 py-2 rounded-lg text-white font-medium transition
                   bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
        </div>
    );
};

export default OtpVerification;
