import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import {
  Attendance,
  Schedules,
  StaffEnrolment,
  mongoose,
} from "../../database";
import { PaginationInterface } from "../../types/PaginationInterface";
import { StaffDataInterface } from "../../types/StaffDataInterface";
import { StaffAttendancePagingInterface } from "../../types/StaffAttendancePagingInterface";
import { ReportPdfInterterface } from "../../types/ReportPdfInterterface";
const moment = require("moment");
import dateFormat, { masks } from "dateformat";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  renderToFile,
  renderToStream,
} from "@react-pdf/renderer";
import { encode, decode } from "js-base64";
import ReactPDF from "@react-pdf/renderer";
import GeneratePdfAttendance from "../../node/GeneratePdfAttendance";

var QRCode = require("qrcode");

export const t = initTRPC.create();

export const attendanceRouter = t.router({
  list: procedure

    .input(z.custom<StaffAttendancePagingInterface>())
    .query(async ({ input }: { input: StaffAttendancePagingInterface }) => {
      const yearStart = moment(input.selectedDate).startOf("month");

      return await new Promise((resolve, reject) => {
        Attendance.paginate(
          {
            staff_objectId: new mongoose.Types.ObjectId(input?._id),
            timestamp_date: {
              $gte: yearStart,
              $lte: moment(yearStart).endOf("month"),
            },
          },
          { ...input }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  monthlygraph: procedure
    // using zod schema to validate and infer input values
    .input(
      z
        .object({
          _id: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      console.log(input?._id);

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
        let lateness = await Attendance.aggregate([
          {
            $match: {
              staff_objectId: new mongoose.Types.ObjectId(input?._id),
              is_late: true,
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

        let timeliness = await Attendance.aggregate([
          {
            $match: {
              staff_objectId: new mongoose.Types.ObjectId(input?._id),
              is_early: true,
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

        resolve({ lateness, timeliness });
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
              staff_objectId: new mongoose.Types.ObjectId(input?._id),
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

  // generate report in pdf

  staffReport: procedure
    .input(z.custom<ReportPdfInterterface>())
    .mutation(async ({ input }: { input: ReportPdfInterterface }) => {
      const yearStart = moment(input.date).startOf("month");

      let staff = await new Promise((resolve, reject) => {
        StaffEnrolment.findOne({ _id: input._id })
          .populate(["scheduler"])
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject({});
          });
      });

      return new Promise((resolve, reject) => {

        Attendance.find({
          staff_objectId: new mongoose.Types.ObjectId(input?._id),
          timestamp_date: {
            $gte: yearStart,
            $lte: moment(yearStart).endOf("month"),
          },
        })
          .populate(["staff_objectId"])
          .then(async (result: any) => {

            console.log(result);

            let data = await GeneratePdfAttendance(result, staff, input);

            resolve(data);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),


});
