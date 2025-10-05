import React from "react";
import SiderBar from "../components/SiderBar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useContext } from "react";
import { chatContext } from "../../context/chatContext";

const HomePage = () => {
  const { selectedUser } = useContext(chatContext);
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`grid grid-cols-1 relative h-full backdrop-blur-lg border-2 border-gray-600 rounded-2xl overflow-hidden ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <SiderBar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
