import { NextApiRequest, NextApiResponse } from "next";
import { Users, mongoose } from "../../database";
const bcrypt = require("bcrypt");

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const {
      full_name,
      username,
      password,
      role,
      department,
      newFilename,
      email,
      phone,
    } = req.body;

    const saltRounds = 10;
    // encrypt user password

    let passwordString = await new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
        bcrypt.hash(password, salt, function (err: any, hash: any) {
          resolve(hash);
        });
      });
    });

    let userData = await new Promise((resolve, reject) => {
      Users.create({
        _id: mongoose.Types.ObjectId(),
        ...req.body,
        password: passwordString,
      })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });

    console.log(req.body);

    res.status(200).json({ message: "Hello from Next.js!" });
  }
}
