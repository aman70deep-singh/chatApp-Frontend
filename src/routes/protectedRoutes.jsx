import { useAuth } from "../context/authContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const { user,loading } = useAuth();
    if(loading){
        return <div>Loading....</div>
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" replace />
}
export default ProtectedRoute;