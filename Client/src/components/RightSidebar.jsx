import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { chatContext } from "../../context/chatContext";
import { authContext } from "../../context/AuthContext";
import avatar_icon from "../assets/avatar_icon.png";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(chatContext);
  const { logout, onlineUsers } = useContext(authContext);

  const [msgImages, setMsgImages] = useState([]);

  //get all images store them in msgImages

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || avatar_icon}
            alt=""
            className="w-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />

        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            logout();
          }}
          className="absolute bottom-5 text-sm left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600/30 to-via-violet-600/30 to bg-red-600/30 border-none font-light px-20 text-white py-2 rounded-full cursor-pointer hover:bg-gradient-to-b hover:from-red-600/30 hover:via-violet-600/30 hover:to-blue-600/30 transition-all"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
