const mongoose = require("mongoose");
const SchedulesSchema = new mongoose.Schema(
  {
    sign_in:Array,
    sign_out:Array,
    title:String,
    createdAt: {type : Date, default: Date.now},
    updatedAt: {type : Date, default: Date.now}
  },
  {
    timestamps: true,
  }
);

export { SchedulesSchema };
