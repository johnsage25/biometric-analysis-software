const mongoose = require("mongoose");
const RosterCellsSchema = new mongoose.Schema(
  {
    sheet: [
      {
        type: mongoose.ObjectId,
        ref: "RosterSheets",
      },
    ],
    rosterEvent: [
      {
        type: mongoose.ObjectId,
        ref: "RosterEvents",
      },
    ],
    month: String,
    D30: String,
    D20: String,
    D31: String,
    D10: String,
    D21: String,
    D11: String,
    D22: String,
    D12: String,
    D23: String,
    D13: String,
    D24: String,
    D14: String,
    D25: String,
    D15: String,
    D26: String,
    D16: String,
    D27: String,
    staffName: String,
    D17: String,
    D28: String,
    cellDate: Date,
    D18: String,
    D29: String,
    D19: String,
    D1: String,
    D2: String,
    D3: String,
    D4: String,
    D5: String,
    D6: String,
    D7: String,
    D8: String,
    D9: String,
    staff: [
      {
        type: mongoose.ObjectId,
        ref: "StaffEnrolment",
      },
    ],
    year: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export { RosterCellsSchema };
