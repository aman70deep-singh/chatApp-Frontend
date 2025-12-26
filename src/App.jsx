import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx"
import SignUp from './pages/signUp.jsx';
import ProtectedRoute from './routes/protectedRoutes.jsx'

function App() {
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
