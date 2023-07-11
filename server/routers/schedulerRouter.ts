import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { Schedules, StaffEnrolment, mongoose } from "../../database";
import { PaginationInterface } from "../../types/PaginationInterface";
import { StaffDataInterface } from "../../types/StaffDataInterface";
import { SchedulerInterface } from "../../types/SchedulerInterface";
const bcrypt = require("bcrypt");
export const t = initTRPC.create();

export const schedulerRouter = t.router({
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
        Schedules.find()
          .sort({ createdAt: -1 })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  addNew: procedure
    .input(z.custom<SchedulerInterface>())
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        Schedules.create({
          _id: mongoose.Types.ObjectId(),
          ...input,
        })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  update: procedure
    .input(z.custom<SchedulerInterface>())
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        Schedules.update(
          {
            _id: input._id,
          },
          { ...input }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  delete: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        Schedules.deleteOne({ _id: input.id })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
});
