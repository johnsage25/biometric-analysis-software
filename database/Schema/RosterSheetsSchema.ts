const mongoose = require("mongoose");
const RosterSheetsSchema = new mongoose.Schema(
  {
    label: String,
    department: String,
    rosterDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export { RosterSheetsSchema };
