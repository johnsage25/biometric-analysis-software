const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema(
  {
    sessionToken: String,
    expiresAt: String,
    user: [
      {
        type: mongoose.ObjectId,
        ref: "Users",
      },
    ],
    createdWith: String,
    installationId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export { SessionSchema };
