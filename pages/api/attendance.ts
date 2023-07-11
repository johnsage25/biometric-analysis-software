import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import dateFormat, { masks } from "dateformat";
import _ from "lodash";
import {
  Attendance,
  RosterCells,
  RosterEvents,
  StaffEnrolment,
  mongoose,
} from "../../database";
import { AttendanceInterface } from "../../types/AttendanceInterface";
import collect from "collect.js";
import { SchedulerInterfaceAtten } from "../../types/RosterTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const atten: AttendanceInterface = req.body;

  let object = atten.staff_objectId
    ? {
        _id: atten.staff_objectId,
      }
    : { uuid: atten.staff_uuid };

  let staff: any = await new Promise((resolve, reject) => {
    StaffEnrolment.findOne(object)
      .populate(["scheduler"])
      .then((result: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        resolve({});
      });
  });

  if (_.isEmpty(staff)) {
    res.status(200).json({
      staff: null,
    });

    return;
  }

  /// checking of staff exist in any shift roster

  let inShift = await new Promise((resolve, reject) => {
    const monthStart = moment(atten.timestamp_date).startOf("month"); // January 1, 2023
    const monthEnd = moment(atten.timestamp_date).endOf("month"); // January 31, 2023

    const today = moment(atten.timestamp_date).startOf("day");

    console.log(today);

    RosterCells.find({
      staff: [staff._id],
      cellDate: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    }).limit(1)
      .populate(["sheet"])
      .then((result: any) => {
        console.log(result);
        resolve(result);
      })
      .catch((err: any) => {
        resolve(err);
      });
  });

  /* Here we have to stop the normal process if we confirm that this shift roster is not empty */

  if (!_.isEmpty(inShift)) {
    let sta = await ShiftRosterHandler(atten, staff, inShift);

    res.status(200).json({
      staff: sta,
    });

    return;
  }

  /* Normal process starts here */

  if (atten.attns_type == "signed_in") {
    if (!_.isEmpty(staff.scheduler)) {
      let scheduler_time = moment(
        `${atten.timestamp_date} ${staff?.scheduler[0].sign_in[0]}`,
        "YYYY-MM-DD HH:mm"
      );
      let attendance_time = moment(
        `${atten.timestamp_date} ${atten.time}`,
        "YYYY-MM-DD HH:mm"
      );

      // checking if staff is late
      let is_late = moment(attendance_time, "HH:mm").isAfter(scheduler_time);

      // checking if staff is early
      let is_early = moment(attendance_time, "HH:mm").isBefore(scheduler_time);

      let early_duration = moment.duration(
        scheduler_time.diff(attendance_time)
      );

      let early_durationMinutes = Math.max(0, early_duration.asMinutes());

      // checking for lateness duration

      let lateDuration = moment.duration(attendance_time.diff(scheduler_time));
      let lateness_durationMinutes = Math.max(0, lateDuration.asMinutes());

      let entranceTime = convertMinutesToHoursAndMinutes(
        lateness_durationMinutes
      );

      let _pl = await new Promise((resolve, reject) => {
        Attendance.create({
          _id: mongoose.Types.ObjectId(),
          device_admin: atten.device_admin,
          leftearly_durationMinutes: 0,
          lateness_durationMinutes: lateness_durationMinutes,
          left_early: false,
          is_shift: false,
          is_early: is_early,
          early_durationMinutes: early_durationMinutes,
          uuid: atten.uid,
          capture_type: atten.capture_type,
          attns_type: atten.attns_type,
          location: atten.location,
          timestamp_date: atten.timestamp_date,
          time_in: atten.time,
          staff_objectId: staff._id,
          is_late: is_late,
          time_out: "",
        })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            resolve(err);
          });
      });
    }

    /// checking of staff is on shift

    //code here
  }

  // checking signout request
  if (atten.attns_type == "signed_out") {
    let scheduler_time = moment(
      `${atten.timestamp_date} ${staff.scheduler[0]?.sign_out[0]}`,
      "YYYY-MM-DD HH:mm"
    );
    let attendance_time = moment(
      `${atten.timestamp_date} ${atten.time}`,
      "YYYY-MM-DD HH:mm"
    );

    let left_early = moment(attendance_time, "HH:mm").isBefore(scheduler_time);
    let early_duration = moment.duration(scheduler_time.diff(attendance_time));
    let early_durationMinutes = Math.max(0, early_duration.asMinutes());

    let _EvenAttendance = await new Promise((resolve, reject) => {
      let uuidOut = atten.uid.split("-");
      Attendance.updateOne(
        { uuid: uuidOut[1], attns_type: "signed_in" },
        {
          left_early,
          time_out: atten.time,
          attns_type: "completed",
          leftearly_durationMinutes: early_durationMinutes,
        }
      )
        .then((result: any) => {
          resolve(result);
        })
        .catch((err) => {
          resolve({});
        });
    });
  }

  res.status(200).json({
    inShift,
  });
}

export function convertMinutesToHoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    remainingMinutes > 0
      ? `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
      : "";

  return `${hourString} ${minuteString}`.trim();
}

/// processing shift roster

const ShiftRosterHandler = async (
  atten: AttendanceInterface,
  staff: any,
  inShift: any
) => {
  // looking for shift roster table Code
  const day = moment(atten.timestamp_date).format("DD");

  let selected = _.map(inShift, `D${parseInt(day)}`);

  let Rosterevent: SchedulerInterfaceAtten | any = await new Promise(
    (resolve, reject) => {
      RosterEvents.findOne({ roster_event: selected[0] })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    }
  );

  if (!_.isEmpty(Rosterevent)) {
    // Processing attendance

    if (atten.attns_type == "signed_in") {
      let scheduler_time = moment(
        `${atten.timestamp_date} ${Rosterevent?.sign_in[0]}`,
        "YYYY-MM-DD HH:mm"
      );
      let attendance_time = moment(
        `${atten.timestamp_date} ${atten.time}`,
        "YYYY-MM-DD HH:mm"
      );

      // checking if staff is late
      let is_late = moment(attendance_time, "HH:mm").isAfter(scheduler_time);

      // checking if staff is early
      let is_early = moment(attendance_time, "HH:mm").isBefore(scheduler_time);

      let early_duration = moment.duration(
        scheduler_time.diff(attendance_time)
      );

      let early_durationMinutes = Math.max(0, early_duration.asMinutes());

      let lateDuration = moment.duration(attendance_time.diff(scheduler_time));
      let lateness_durationMinutes = Math.max(0, lateDuration.asMinutes());

      let _pl = await new Promise((resolve, reject) => {
        Attendance.create({
          _id: mongoose.Types.ObjectId(),
          device_admin: atten.device_admin,
          leftearly_durationMinutes: 0,
          lateness_durationMinutes: lateness_durationMinutes,
          left_early: false,
          is_shift: true,
          is_early: is_early,
          early_durationMinutes: early_durationMinutes,
          uuid: atten.uid,
          capture_type: atten.capture_type,
          attns_type: atten.attns_type,
          location: atten.location,
          timestamp_date: atten.timestamp_date,
          time_in: atten.time,
          staff_objectId: staff._id,
          is_late: is_late,
          time_out: "",
        })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            resolve(err);
          });
      });
    }

    if (atten.attns_type == "signed_out") {
      let scheduler_time = moment(
        `${atten.timestamp_date} ${staff.scheduler[0]?.sign_out[0]}`,
        "YYYY-MM-DD HH:mm"
      );
      let attendance_time = moment(
        `${atten.timestamp_date} ${atten.time}`,
        "YYYY-MM-DD HH:mm"
      );

      let left_early = moment(attendance_time, "HH:mm").isBefore(
        scheduler_time
      );
      let early_duration = moment.duration(
        scheduler_time.diff(attendance_time)
      );

      let early_durationMinutes = Math.max(0, early_duration.asMinutes());

      let _EvenAttendance = await new Promise((resolve, reject) => {
        let uuidOut = atten.uid.split("-");

        Attendance.updateOne(
          { uuid: uuidOut[1], attns_type: "signed_in" },
          {
            left_early,
            time_out: atten.time,
            attns_type: "completed",
            leftearly_durationMinutes: early_durationMinutes,
          }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err) => {
            resolve({});
          });
      });
    }
  } else {
    return null;
  }

  return inShift;
};
