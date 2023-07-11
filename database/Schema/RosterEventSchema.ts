const mongoose = require("mongoose");
const RosterEventSchema = new mongoose.Schema(
  {
    roster_event: {
      type: String,
      unique: true,
      required: true,
    },
    sign_in:Array,
    sign_out:Array,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }

);

export { RosterEventSchema };
