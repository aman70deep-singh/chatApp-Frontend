import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx"
import SignUp from './pages/signUp.jsx';
import ProtectedRoute from './routes/protectedRoutes.jsx'
import { useAuth } from './context/authContext';

function App() {
  const navigate = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (token) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  }, [token, loading, navigate]);

  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signUp' element={<SignUp></SignUp>}></Route>
      <Route path={'/home'} element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }></Route>
    </Routes>
  );
}

export default App;
