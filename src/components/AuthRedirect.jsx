import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "./Spinner";

const AuthRedirect = () => {
    const { token, user, loading } = useAuth();

    if (loading) return <Spinner />;

    return (token || user) ? (
        <Navigate to="/home" replace />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AuthRedirect;
