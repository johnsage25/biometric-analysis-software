import _ from "lodash";
import { StaffEnrolment, Users } from "../database";
import { NextApiRequest, NextApiResponse } from "next";

export const AuthStaff = async (staffId: any) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ _id: staffId })
      .then((result: any) => {
        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        reject({});
      });
  });
};
