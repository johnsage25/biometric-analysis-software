import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { mongoose, Schedules, StaffEnrolment } from "../../database";
import { StaffObjectInterface } from "../../types/StaffObjectInterface";
const path = require("path");

var fs = require("fs");
// let request = require("request");

// let download = function (uri, filename, callback) {
//   request.head(uri, function (err, res, body) {
//     console.log("content-type:", res.headers["content-type"]);
//     console.log("content-length:", res.headers["content-length"]);

//     request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
//   });
// };

type StaffObjectOmited = Omit<StaffObjectInterface, "by_staff">;

let page = 1;
var displayLimit = 1000;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let staff = await new Promise((resolve, reject) => {
    StaffEnrolment.find()
      .then((result: any) => {
        let _d: StaffObjectOmited = result
        resolve(_d);
      })
      .catch((err: any) => {
        reject(err);
      });
  });

  res.status(200).json({
    staff,
  });
};

export default handler;
