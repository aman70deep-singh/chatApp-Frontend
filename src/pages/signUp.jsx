import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic.js";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSignUp = async (e) => {

        try {
            e.preventDefault()
            const response = await axiosPublic.post("/auth/register", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data.success) {
                toast.success("Account created successfully!");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                toast.error(response.data.error);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "SignUp failed"
            );
        }

    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl ">
                {/*logo*/}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex justify-center items-center">
                        <span className="text-white text-3xl font-bold">💬</span>
                    </div>

                </div>
                <h1 className="text-center mb-2 text-2xl font-bold" style={{ color: '#6e706f' }}>Create your account</h1>
                <p className="text-center mb-6" style={{ color: '#6e706f' }}>SignUp to continue to chatApp</p>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ color: '#25D366' }}>
                            <FaUser />
                        </span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 rounded-lg border outline-none focus:ring-2 focus:ring-[#25D366]"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ color: '#25D366' }}>
                            <FaEnvelope />
                        </span>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 rounded-lg border outline-none focus:ring-2 focus:ring-[#25D366]"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ color: '#25D366' }}>
                            <FaLock />
                        </span>
                        <input
                            type="text"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 rounded-lg border outline-none focus:ring-2 focus:ring-[#25D366]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-4 rounded-lg text-lg font-semibold transition"
                    > SignUp</button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?
                    <Link to="/login" className="font-medium hover:underline" style={{ color: '#25D366' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
