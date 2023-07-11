import _ from "lodash";
import { RosterSheets, StaffEnrolment, Users } from "../database";
import { NextApiRequest, NextApiResponse } from "next";

export const GetRosterSheet = async (sheetId: any) => {
  return new Promise((resolve, reject) => {
    RosterSheets.findOne({ _id: sheetId })
      .then((result: any) => {
        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        reject({});
      });
  });
};
