const mongoose = require("mongoose");
const StaffSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    gender: String,
    right_fingerprint: String,
    mobile: String,
    fac_a_department: String,
    nfc_card_code: String,
    enrolled_date: Date,
    right_inpsize: String,
    left_fingerprint: String,
    birthdate: Date,
    work_hour: String,
    status: { type: Boolean, default: true },
    left_inpsize: String,
    username: String,
    unique_id_no: String,
    work_position: String,
    fullname: String,
    password: String,
    scheduler: [
      {
        type: mongoose.ObjectId,
        ref: "Schedules",
      },
    ],
    by_staff: [
      {
        type: mongoose.ObjectId,
        ref: "Users",
        default: "",
      },
    ],
    uuid: {
      type: String,
      unique: true,
      required: true,
    },
    staff_image: String,
    staff_category: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export { StaffSchema };
