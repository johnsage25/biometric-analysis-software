const mongoose = require("mongoose");
const AttendanceSchema = new mongoose.Schema(
  {
    device_admin: String,
    leftearly_durationMinutes: Number,
    lateness_durationMinutes: Number,
    left_early: { type: Boolean, default: false },
    is_shift: { type: Boolean, default: false },
    is_early: { type: Boolean, default: false },
    early_durationMinutes: Number,
    uuid: {
      type: String,
      unique: true,
      required: true,
    },
    capture_type: String,
    attns_type: String,
    location: String,
    timestamp_date: Date,
    time_in: String,
    staff_objectId: [
      {
        type: mongoose.ObjectId,
        ref: "StaffEnrolment",
      },
    ],
    is_late: { type: Boolean, default: false },
    time_out: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export { AttendanceSchema };
