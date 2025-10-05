import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";
// get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    //count number of message unseen messages
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        recieverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res
      .status(200)
      .json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: selectedUserId },
        { senderId: selectedUserId, recieverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, recieverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { seen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking message as seen:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = await Message.create({
      text,
      image: imageUrl,
      senderId,
      recieverId,
    });

    //emit the message to receiver if online
    const receiverSocketId = userSocketMap[recieverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
