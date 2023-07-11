const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailVerified: { type: Boolean, default: false },
    position: String,
    phone: String,
    authData: String,
    department: String,
    status: { type: Boolean, default: true },
    role:String,
    username: {
      type: String,
      unique: true,
      required: true,
    },
    staffAvatar: String,
    fullname: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export { UserSchema };
