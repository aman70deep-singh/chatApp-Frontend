import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AuthRedirect = () => {
    const { token, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return token ? (
        <Navigate to="/home" replace />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AuthRedirect;
