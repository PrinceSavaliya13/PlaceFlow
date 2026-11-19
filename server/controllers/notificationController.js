import Notification from "../models/Notification.js";
export const list = async (req, res) =>
  res.json({
    success: true,
    notifications: await Notification.find({ recipient: req.user._id })
      .sort("-createdAt")
      .limit(50),
  });
export const read = async (req, res) =>
  res.json({
    success: true,
    notification: await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true },
    ),
  });

