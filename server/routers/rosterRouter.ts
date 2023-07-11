import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import {
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
export const t = initTRPC.create();

export const rosterRouter = t.router({
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
        RosterEvents.find()
          .sort({ createdAt: -1 })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  addnew: procedure.input(z.custom<rosterInterface>()).mutation(({ input }) => {
    return new Promise((resolve, reject) => {
      RosterEvents.create({
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

  update: procedure.input(z.custom<rosterInterface>()).mutation(({ input }) => {
    return new Promise((resolve, reject) => {
      RosterEvents.update(
        {
          _id: input._id,
        },
        {
          ...input,
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

  delete: procedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(({ input }) => {
    return new Promise((resolve, reject) => {
        RosterEvents.deleteOne({ _id: input.id })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }),
});
