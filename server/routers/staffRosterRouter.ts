import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import {
  RosterCells,
  RosterSheets,
  Schedules,
  StaffEnrolment,
  mongoose,
} from "../../database";
import moment from "moment";
import { PaginationInterface } from "../../types/PaginationInterface";
import {
  StaffDataInterface,
  StaffRosterUpdateInterface,
} from "../../types/StaffDataInterface";
import { RosterDocumentInterface } from "../../types/RosterDocumentInterface";
const bcrypt = require("bcrypt");
export const t = initTRPC.create();

export const staffRosterRouter = t.router({
  list: procedure

    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return new Promise((resolve, reject) => {
        RosterSheets.find()
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  addRoster: procedure
    .input(z.custom<RosterDocumentInterface>())
    .mutation(async ({ input }) => {
      let staffInDepartment: any = await new Promise((resolve, reject) => {
        StaffEnrolment.find({
          fac_a_department: { $regex: input.department, $options: "i" },
        })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            resolve([]);
          });
      });

      var daysInMonth = moment(input.roster_date, "YYYY-MM-DD").daysInMonth();
      let daysArray = Array.from({ length: daysInMonth }, (v, k) => k + 1);

      return new Promise((resolve, reject) => {
        RosterSheets.create({
          _id: mongoose.Types.ObjectId(),
          ...input,
        })
          .then((result: any) => {
            /// creating cell for added list
            staffInDepartment.map(async (item) => {
              let year = moment(input.roster_date, "YYYY-MM-DD").format("Y");
              let month = moment(input.roster_date, "YYYY-MM-DD").format("M");
              let cellDate = moment(input.roster_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );

              let zk = {
                year,
                month,
                cellDate,
                sheet: result._id,
                staffName: item.fullname,
                staff: item._id,
              };

              daysArray.map((day) => {
                zk[`D${day}`] = "O";
              });

              RosterCells.create({
                _id: mongoose.Types.ObjectId(),
                ...zk,
              })
                .then((result) => {
                  console.log(result);
                })
                .catch((err) => {
                  console.log(err);
                });
            });

            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });

        resolve({});
      });
    }),

  delete: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      console.log(input.id);

      return new Promise((resolve, reject) => {
        RosterSheets.deleteOne({ _id: input.id })
          .then(async (result: any) => {
            await RosterCells.deleteMany({
              sheet: [input.id],
            });
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  rosterSheet: procedure

    .input(
      z
        .object({
          rosterId: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return new Promise((resolve, reject) => {
        RosterSheets.find({ _id: input?.rosterId })
          .populate(["cells"])
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  updateRoster: procedure

    .input(z.custom<StaffRosterUpdateInterface>())
    .mutation(({ input }) => {
      let dataObject = {};
      dataObject[`D${input.row}`] = `${input.value}`.toUpperCase();

      return new Promise((resolve, reject) => {
        RosterCells.update(
          { _id: input._id },
          {
            ...dataObject,
          }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
});
