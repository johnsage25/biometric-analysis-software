import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { Users } from "../../../database";
var bcrypt = require("bcryptjs");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  if (req.method == "POST") {
    let userSession: any = await new Promise((resolve, reject) => {
      Users.findOne({ $or: [{ email: username }, { username: username }] })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

    let compare = await new Promise((resolve, reject) => {
      bcrypt.compare(password, userSession?.password, function (err, result) {
        resolve(result);
      });
    });

    if (compare) {
      res.status(200).json({
        body: userSession,
        loginStatus: true,
        message: "Login was successfull",
      });

    } else {
      res.status(200).json({
        body:userSession,
        loginStatus: false,
        message: "Invalid login details",
      });
    }
  } else {
    res.status(200).json({
      status: false,
      message: "Invalid request",
    });
  }
};

export default handler;
