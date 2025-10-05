import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";
import arrow_icon from "../assets/arrow_icon.png";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(authContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currentState === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
    navigate("/loading");
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-sm">
      {/*left side*/}
      <div className="flex flex-col w-full px-4 py-6 max-w-md rounded-lg items-center">
        <img src="icon.png" alt="" className="w-[min(30vw,250px)]" />
        <div className="items-center flex flex-1 text-center text-white">
          <p>Presented by</p>
          <img
            src="brand-logo.png"
            alt=""
            className="max-w-[80px] max-h-[40px]"
          />
        </div>
      </div>
      {/*right side*/}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currentState === "Sign Up" && !isDataSubmitted && (
          <>
            <input
              onChange={(e) => setfullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              placeholder="Full Name"
              required
            />
          </>
        )}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Email Address"
              required
            />
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Password"
              required
            />
          </>
        )}
        {currentState === "Sign Up" && isDataSubmitted && (
          <>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="provide a short bio..."
              required
            ></textarea>
          </>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400/30 to-via-blue-500/30 to-violet-600/30 text-white rounded-md hover:from-purple-400/50 hover:to-blue-500/50 transition cursor-pointer"
        >
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the Terms and Conditions</p>
        </div>
        <div className="flex flex-col gap-2 text-center">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login"), setIsDataSubmitted(false);
                }}
                className="hover:text-green-400 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign Up"), setIsDataSubmitted(false);
                }}
                className="hover:text-green-400 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
