import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { Schedules, StaffEnrolment, Users, mongoose } from "../../database";
import { PaginationInterface } from "../../types/PaginationInterface";
import { StaffDataInterface } from "../../types/StaffDataInterface";
import { AddNewStaffInterface } from "../../types/AddNewStaffInterface";
const bcrypt = require("bcrypt");
export const t = initTRPC.create();

export const settingsRouter = t.router({
  adminUserlist: procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return new Promise((resolve, reject) => {
        Users.find()
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  addAdminUser: procedure

    .input(z.custom<AddNewStaffInterface>())
    .mutation(async ({ input }) => {
      const saltRounds = 10;
      // encrypt user password

      let passwordString = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
          bcrypt.hash(input.password, salt, function (err: any, hash: any) {
            resolve(hash);
          });
        });
      });

      return new Promise((resolve, reject) => {
        Users.create({
          _id: mongoose.Types.ObjectId(),
          ...input,
          password: passwordString,
        })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  updateAdmin: procedure

    .input(z.custom<AddNewStaffInterface>())
    .mutation(async ({ input }: { input: AddNewStaffInterface }) => {
      const saltRounds = 10;
      // encrypt user password
      if (!_.isEmpty(input.password)) {
        let passwordString = await new Promise((resolve, reject) => {
          bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
            bcrypt.hash(input.password, salt, function (err: any, hash: any) {
              resolve(hash);
            });
          });
        });

        input.password = passwordString;
      }
      else{
        delete input.password
      }

      return new Promise((resolve, reject) => {
        Users.update(
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

  deleteAdmin: procedure

    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        Users.deleteOne({ _id: input.id })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
});
