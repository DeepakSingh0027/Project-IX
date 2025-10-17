import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";
import { chatContext } from "../../context/chatContext";
import menu_icon from "../assets/menu_icon.png";
import search_icon from "../assets/search_icon.png";
import avatar_icon from "../assets/avatar_icon.png";

const SiderBar = () => {
  const navigate = useNavigate();
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(chatContext);
  const { logout, onlineUsers } = useContext(authContext);
  const [input, setInput] = useState("");
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);
  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pd-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center ">
            <img src={"icon.png"} alt="logo" className="max-w-8" />
            <p className={`font-bold text-2xl bg-shine`}>Void</p>
          </div>
          <div className="relative py-2 group">
            <img
              src={menu_icon}
              alt="logo"
              className="max-h-5 cursor-pointer text-blue-200"
            />
            <div className="absolute hidden group-hover:block top-full right-0 bg-gray-800 text-blue-100 p-2 rounded-md shadow-lg z-20 w-32">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-green-200 hover:text-shadow-blue-50-100"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={() => logout()}
                className="cursor-pointer text-sm hover:text-green-200 hover:text-shadow-blue-50-100"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-400/20 rounded-full flex items-center gap-2 px-4 py-3 mt-5">
          <img src={search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-blue-200 text-sm placeholder-[#c8c8c8] flex-1"
            placeholder="Search User"
          />
        </div>
      </div>
      <div className="flex flex-col pt-3 overflow-y-scroll gap-2 max-h-[60vh]">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || avatar_icon}
              alt=""
              className="w-[35px] aspect-square rounded-full"
            />
            <div>
              <p>{user?.fullName || "Unknown User"}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-xs text-green-400">Online</span>
              ) : (
                <span className="text-xs text-gray-800">Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-blue-500/70">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiderBar;
