import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
//Signup NewUser
export const signup = async (req, res) => {
  const { email, password, fullName, bio } = req.body;

  try {
    if (!email || !password || !fullName || !bio) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.find({ email });
    if (userExists.length) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
      bio,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      newUser,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating user", error });
  }
};
//Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const userData = await User.find({ email });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData[0].password
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData[0]._id);

    res.status(200).json({
      success: true,
      userData: userData[0],
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error logging in user", error });
  }
};
//check auth
export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};
//update user profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating profile", error });
  }
};
