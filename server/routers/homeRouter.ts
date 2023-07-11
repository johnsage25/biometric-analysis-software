import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import {
  Attendance,
  RosterEvents,
  Schedules,
  StaffEnrolment,
  mongoose,
} from "../../database";
import { PaginationInterface } from "../../types/PaginationInterface";
import { StaffDataInterface } from "../../types/StaffDataInterface";
import { SchedulerInterface } from "../../types/SchedulerInterface";
import { rosterInterface } from "../../types/rosterInterface";
const bcrypt = require("bcrypt");
const moment = require("moment");
export const t = initTRPC.create();

export const homeRouter = t.router({
  monthlyAttn: procedure
    // using zod schema to validate and infer input values
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return new Promise(async (resolve, reject) => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        let countAttendance = await Attendance.count({
          timestamp_date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        let completed = await new Promise((resolve, reject) => {
          Attendance.aggregate([
            {
              $match: {
                attns_type: "completed",
                timestamp_date: { $gte: startOfMonth, $lte: endOfMonth },
              },
            },
            {
              $group: {
                _id: { $dayOfWeek: "$timestamp_date" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $group: {
                _id: null,
                data: {
                  $push: {
                    k: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$_id", 1] },
                            then: "monday",
                          },
                          {
                            case: { $eq: ["$_id", 2] },
                            then: "tuesday",
                          },
                          {
                            case: { $eq: ["$_id", 3] },
                            then: "wednesday",
                          },

                          {
                            case: { $eq: ["$_id", 4] },
                            then: "thursday",
                          },

                          {
                            case: { $eq: ["$_id", 5] },
                            then: "friday",
                          },

                          {
                            case: { $eq: ["$_id", 6] },
                            then: "saturday",
                          },

                          {
                            case: { $eq: ["$_id", 7] },
                            then: "sunday",
                          },
                        ],
                      },
                    },
                    v: "$count",
                  },
                },
              },
            },
            {
              $project: {
                data: { $arrayToObject: "$data" },
              },
            },
          ])
            .then((result: any) => {
              resolve(result);
            })
            .catch((err: any) => {
              reject(err);
            });
        });

        /// get incomplete

        let incomplete = await new Promise((resolve, reject) => {
          Attendance.aggregate([
            {
              $match: {
                attns_type: "incomplete",
                timestamp_date: { $gte: startOfMonth, $lte: endOfMonth },
              },
            },
            {
              $group: {
                _id: { $dayOfWeek: "$timestamp_date" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $group: {
                _id: null,
                data: {
                  $push: {
                    k: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$_id", 1] },
                            then: "monday",
                          },
                          {
                            case: { $eq: ["$_id", 2] },
                            then: "tuesday",
                          },
                          {
                            case: { $eq: ["$_id", 3] },
                            then: "wednesday",
                          },

                          {
                            case: { $eq: ["$_id", 4] },
                            then: "thursday",
                          },

                          {
                            case: { $eq: ["$_id", 5] },
                            then: "friday",
                          },

                          {
                            case: { $eq: ["$_id", 6] },
                            then: "saturday",
                          },

                          {
                            case: { $eq: ["$_id", 7] },
                            then: "sunday",
                          },
                        ],
                      },
                    },
                    v: "$count",
                  },
                },
              },
            },
            {
              $project: {
                data: { $arrayToObject: "$data" },
              },
            },
          ])
            .then((result: any) => {
              resolve(result);
            })
            .catch((err: any) => {
              reject(err);
            });
        });

        resolve({ completed, incomplete, countAttendance });
      });
    }),

  totalStaff: procedure
    // using zod schema to validate and infer input values
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return new Promise((resolve, reject) => {
        StaffEnrolment.find()
          .then((result: any) => {
            var grouped = _.mapValues(
              _.groupBy(result, "work_position"),
              (clist) => {
                return clist.map((staff) => _.omit(staff, "work_position"));
              }
            );

            let dataGraph = Object.entries(grouped).map(([key, value]) => {
              return [key, value?.length || 0];
            });

            resolve({ dataGraph, total: result.length });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }),

  yearlyBarGraph: procedure
    // using zod schema to validate and infer input values
    .input(
      z
        .object({
          _id: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const yearStart = moment().startOf("year");

      return new Promise(async (resolve, reject) => {
        let completed = await Attendance.aggregate([
          {
            $match: {
              attns_type: "completed",
              timestamp_date: {
                $gte: yearStart.toDate(),
                $lte: moment(yearStart).endOf("year").toDate(),
              },
            },
          },
          {
            $group: {
              _id: { year_month: { $substrCP: ["$timestamp_date", 0, 7] } },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.year_month": 1 },
          },
          {
            $project: {
              _id: 0,
              count: 1,
              month_year: {
                $concat: [
                  {
                    $arrayElemAt: [
                      monthsArray,
                      {
                        $subtract: [
                          { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                          1,
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              data: { $push: { k: "$month_year", v: "$count" } },
            },
          },
          {
            $project: {
              data: { $arrayToObject: "$data" },
              _id: 0,
            },
          },
        ]).catch((err: any) => {});

        let incomplete = await Attendance.aggregate([
          {
            $match: {
              staff_objectId: new mongoose.Types.ObjectId(input?._id),
              attns_type: "signed_in",
              timestamp_date: {
                $gte: yearStart.toDate(),
                $lte: moment(yearStart).endOf("year").toDate(),
              },
            },
          },
          {
            $group: {
              _id: { year_month: { $substrCP: ["$timestamp_date", 0, 7] } },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.year_month": 1 },
          },
          {
            $project: {
              _id: 0,
              count: 1,
              month_year: {
                $concat: [
                  {
                    $arrayElemAt: [
                      monthsArray,
                      {
                        $subtract: [
                          { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                          1,
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              data: { $push: { k: "$month_year", v: "$count" } },
            },
          },
          {
            $project: {
              data: { $arrayToObject: "$data" },
              _id: 0,
            },
          },
        ]).catch((err: any) => {});

        /// data out

        resolve({ completed, incomplete });
      });
    }),
});
