import { useState } from "react";
import axiosPublic from "../api/axiosPublic";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = ({ email }) => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await axiosPublic.patch("/auth/reset-password", {
                email,
                newPassword,
            });

            toast.success(res.data.message || "Password reset successful");

            // Redirect to login after short delay
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Reset Password
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Create a new password for your account
                </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                    <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                </div>

                <div>
                    <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg text-white font-medium transition
                     bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
