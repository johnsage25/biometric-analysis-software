import _ from "lodash";
import { StaffEnrolment } from "../database";
import { NextApiRequest, NextApiResponse } from "next";

export const StaffDetails = async (ctx: any) => {
  return new Promise((resolve, reject) => {
    StaffEnrolment.findOne({ _id: ctx.query.objectId })
      .then((result: any) => {
        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        reject({});
      });
  });
};
