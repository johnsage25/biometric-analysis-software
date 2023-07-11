import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { Schedules, StaffEnrolment, mongoose } from "../../database";
import { PaginationInterface } from "../../types/PaginationInterface";
import { StaffDataInterface } from "../../types/StaffDataInterface";
const bcrypt = require("bcrypt");
export const t = initTRPC.create();

export const staffRouter = t.router({
  list: procedure

    .input(z.custom<PaginationInterface>())
    .query(async ({ input }: { input: PaginationInterface }) => {
      return await new Promise((resolve, reject) => {
        StaffEnrolment.paginate(input.searchString, { ...input })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  schedulerList: procedure
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
        Schedules.find()
          .sort({ createdAt: -1 })
          .then((result: any) => {
            let array = result.map((item, k) => {
              return {
                label: item.title,
                value: item._id,
              };
            });
            resolve(array);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  update: procedure

    .input(z.custom<StaffDataInterface>())
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        StaffEnrolment.updateOne(
          { _id: input._id },
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

  updateProfile: procedure

    .input(z.custom<StaffDataInterface>())
    .mutation(async ({ input }) => {


      const saltRounds = 10;
      let passwordString = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
          bcrypt.hash(input?.password, salt, function (err: any, hash: any) {
            resolve(hash);
          });
        });
      });

      return new Promise((resolve, reject) => {
        StaffEnrolment.updateOne(
          { _id: input._id },
          {
            ...input,
            password: passwordString
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

    deleteStaff: procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        staffId: z.string(),
      })
    )
    .mutation(({ input }) => {

      return new Promise((resolve, reject) => {
        StaffEnrolment.deleteOne({ _id: input.staffId })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),


});
