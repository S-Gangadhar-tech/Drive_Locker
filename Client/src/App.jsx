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

const ProtectedRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);

  // The isLoading check has been removed.
  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);

  // The isLoading check has been removed.
  if (isLoggedin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  // The isLoading check at the top level has also been removed.
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
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
          element={
            <ResetPassword />
          }
        />
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
          path="/create-passkey"
          element={
            <ProtectedRoute>
              <CreatePasskey />
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
    </Routes>
  );
};

export default App;