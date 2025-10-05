import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = ({ setVideo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Set initial loading video
    setVideo("/bg-video2.webm");

    // Step 2: After 5 seconds, switch to main background and redirect
    const timer = setTimeout(() => {
      setVideo("/bg-video1.webm");
      navigate("/");
    }, 5000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [setVideo, navigate]);

  return (
    <div className="flexh-screen text-white text-xl">
      <p className="animate-pulse font-bold">Welcome to Void...</p>
    </div>
  );
};

export default Loading;
