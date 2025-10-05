import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { formatDate } from "../lib/utils";
import { authContext } from "../../context/AuthContext";
import { chatContext } from "../../context/chatContext";
import avatar_icon from "../assets/avatar_icon.png";
import help_icon from "../assets/help_icon.png";
import send_button from "../assets/send_button.svg";
import arrow_icon from "../assets/arrow_icon.png";
import gallery_icon from "../assets/gallery_icon.svg";

const ChatContainer = () => {
  const scrollEnd = useRef(null);
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(chatContext);
  const { authUser, onlineUsers } = useContext(authContext);
  const [input, setInput] = useState("");

  //handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() === "") return null;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  //handle sending image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = null;
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Chat Header */}
      <div className="flex item-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-300"></span>
          )}
        </p>
        <img
          onClick={() => {
            setSelectedUser(null);
          }}
          src={arrow_icon}
          alt=""
          className="md:hidden max-w-6 max-h-6 cursor-pointer"
        />
        <img
          src={help_icon}
          alt=""
          className="max-md:hidden max-w-6 max-h-6 cursor-pointer"
        />
      </div>
      {/* Chat Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {message.image ? (
              <img
                src={message.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[230px] md-text-sm font-light rounded-lg mb-8 break-all text-white ${
                  message.senderId === authUser._id
                    ? "rounded-br-none bg-indigo-600/30"
                    : "rounded-bl-none bg-gray-700/30"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser?.profilePic || avatar_icon
                    : selectedUser?.profilePic || avatar_icon
                }
                alt=""
                className="w-7 h-7 rounded-full"
              />
              <p className="text-gray-500">{formatDate(message.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/** Chat Input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center p-3 gap-3">
        <div className="flex-1 flex items-center bg-gray-900/30 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(e);
              }
            }}
            type="text"
            placeholder="Send message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-blue-100 placeholder-gray-200"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={gallery_icon}
              alt=""
              className="max-w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={send_button}
          alt=""
          className="max-w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={"icon.png"} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
