import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Loading from "./pages/Loading";
import { Toaster } from "react-hot-toast";
import { authContext } from "../context/AuthContext";

const App = () => {
  const [Video, setVideo] = useState("/bg-video1.webm");
  const [videoError, setVideoError] = useState(false);

  const { authUser } = useContext(authContext);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      {!videoError ? (
        <video
          key={Video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          onError={() => setVideoError(true)} // if video fails to load
        >
          <source src={Video} type="video/webm" />
        </video>
      ) : (
        <img
          src="/bg.png"
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
      )}

      {/* Page Routes */}
      <div className="relative z-10">
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/loading" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/loading"
            element={
              authUser ? (
                <Loading setVideo={setVideo} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
