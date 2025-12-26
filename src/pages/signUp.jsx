import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic.js";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [err, setError] = useState("");
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
            const response = await axiosPublic.post("http://localhost:5000/auth/register", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data.success) {
                navigate("/login");
            } else {
                setError(response.data.error);
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "SignUp failed"
            );
        }

    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl ">
                {/*logo*/}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex justify-center items-center">
                        <span className="text-white text-3xl font-bold">💬</span>
                    </div>

                </div>
                <h1 className="text-center mb-2 text-gray-800 text-2xl font-bold">Create your account</h1>
                <p className="text-center mb-6 text-gray-500">SignUp to continue to chatApp</p>

                {err && (
                    <p className="text-center text-xl mb-3 text-red-500">{err}</p>
                )}
                <form onSubmit={handleSignUp} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg text-lg font-semibold transition"

                    > SignUp</button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Already have an account?
                    <Link to="/login" className="text-green-600 font-medium">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
