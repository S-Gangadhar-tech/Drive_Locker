import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Files from "./pages/Files";
import CreatePasskey from "./pages/CreatePasskey";
import Features from "./pages/Features";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Loader from "./components/Loader";

import AuthLayout from "./pages/AuthLayout";

const ProtectedRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);

  if (isLoggedin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { globalLoading } = useContext(AppContext);
  return (
    <>
      <Routes>
        {/* Main Dashboard Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <Features />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <Files />
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
        </Route>

        {/* Authentication Layout */}
        <Route element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="email-verify"
            element={
              <ProtectedRoute>
                <EmailVerify />
              </ProtectedRoute>
            }
          />
          <Route
            path="reset-password"
            element={<ResetPassword />}
          />
          <Route
            path="/create-passkey"
            element={
              <ProtectedRoute>
                <CreatePasskey />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    {globalLoading && <Loader />}
    </>
  );
};

export default App;