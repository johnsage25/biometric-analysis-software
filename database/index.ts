import { AttendanceSchema } from "./Schema/AttendanceSchema";
import { RosterCellsSchema } from "./Schema/RosterCellsSchema";
import { RosterEventSchema } from "./Schema/RosterEventSchema";
import { RosterSheetsSchema } from "./Schema/RosterSheetsSchema";
import { SchedulesSchema } from "./Schema/SchedulesSchema";
import { SessionSchema } from "./Schema/SessionSchema";
import { StaffSchema } from "./Schema/StaffSchema";
import { UserSchema } from "./Schema/UserSchema";

const mongoose = require("mongoose");
const createOrUpdate = require("mongoose-create-or-update");
const mongoosePaginate = require("mongoose-paginate-v2");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_LNK);

// delete mongoose.models.RosterCells;

StaffSchema.index({ fullname: "text" });

StaffSchema.plugin(createOrUpdate);
StaffSchema.plugin(mongoosePaginate);
AttendanceSchema.plugin(mongoosePaginate);

UserSchema.virtual("session", {
  ref: "Sessions",
  localField: "_id",
  foreignField: "customer",
});

RosterSheetsSchema.virtual("cells", {
  ref: "RosterCells",
  localField: "_id",
  foreignField: "sheet",
});

const StaffEnrolment =
  mongoose.models.StaffEnrolment ||
  mongoose.model("StaffEnrolment", StaffSchema);

const Schedules =
  mongoose.models.Schedules || mongoose.model("Schedules", SchedulesSchema);

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

const RosterCells =
  mongoose.models.RosterCells ||
  mongoose.model("RosterCells", RosterCellsSchema);

const RosterEvents =
  mongoose.models.RosterEvents ||
  mongoose.model("RosterEvents", RosterEventSchema);

const Sessions =
  mongoose.models.Sessions || mongoose.model("Sessions", SessionSchema);

const Users = mongoose.models.Users || mongoose.model("Users", UserSchema);
const RosterSheets =
  mongoose.models.RosterSheets ||
  mongoose.model("RosterSheets", RosterSheetsSchema);

export {
  StaffEnrolment,
  Schedules,
  Attendance,
  Sessions,
  RosterSheets,
  RosterEvents,
  RosterCells,
  mongoose,
  Users,
};
