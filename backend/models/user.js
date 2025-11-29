const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Admin"], required: true },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String, default: "" },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });
mongoose.models = {};
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;