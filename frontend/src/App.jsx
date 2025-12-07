import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePlan from "./pages/CreatePlan";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import YogaVideos from "./pages/YogaVideos";
import YogaTypes from "./pages/YogaTypes";
import VerifyOTP from "./pages/VerifyOTP";
import GlobalChatbot from "./components/GlobalChatbot";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast-custom.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-plan"
            element={
              <ProtectedRoute>
                <CreatePlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/yoga-types"
            element={
              <ProtectedRoute>
                <YogaTypes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/yoga-videos"
            element={
              <ProtectedRoute>
                <YogaVideos />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalChatbot />
      </div>

    </Router>
  );
}

export default App;
