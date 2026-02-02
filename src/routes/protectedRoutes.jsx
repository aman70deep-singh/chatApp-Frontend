import { useAuth } from "../context/authContext"
import { Navigate } from "react-router-dom"
import Spinner from "../components/Spinner"

const ProtectedRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    if (user && token) {
        return children;
    }

    return <Navigate to="/login" replace />
}
export default ProtectedRoute;