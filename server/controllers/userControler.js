import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId; 
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId not found in request",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!!!",
      });
    }

    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email:user.email,
        isAccountVerified: user.isAccountVerified,
      },
      message: "✅ Verified User",
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
