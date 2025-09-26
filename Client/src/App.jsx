import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Pages/Layout";
import Login from "./Pages/Login";
import EmailVerify from "./Pages/EmailVerify";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Files from "./Pages/Files";
import CreatePasskey from "./Pages/CreatePasskey";
import Features from "./Pages/Features";
import Notes from "./Pages/Notes";

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
          path="/Features"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Createpasskey"
          element={
            <ProtectedRoute>
              <CreatePasskey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Files"
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;