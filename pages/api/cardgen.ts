import type { NextApiRequest, NextApiResponse } from "next";
var path = require("path");
const plugin = require.resolve("@jimp/plugin-print");
var Jimp = require("jimp");
var QRCode = require("qrcode");
const ucwords = require('ucwords');
import fs from 'fs'
const appRoot = path.resolve(__dirname);
import { encode, decode } from "js-base64";
import { StaffEnrolment } from "../../database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { staffId } = req.query;

  let staff:any = await new Promise((resolve, reject) => {
    StaffEnrolment.findOne({ _id: staffId })
      .populate(["scheduler"])
      .then((result: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        reject({});
      });
  });

  // Writing image after processing

  const font14 = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  const image = await Jimp.read("./card/Madonnal-new-ID-card.png");

  const staff_image = await Jimp.read(`./public/uploads/${staff.staff_image}`);

  await QRCode.toFile(
    "./qrl.png",
    encode(JSON.stringify({ baseId: staff._id })),
    {
      height: 200,
      width: 200,
    }
  );




  if (staff.fullname.length > 27 && staff.fullname.length < 29) {

    const font = await Jimp.loadFont(
      "./fonts/poppins-bold/90/dBJf_Y_pZpnCMk2RM8eeHOD2.ttf.fnt"
    );
    await image.print(font, 280, 1050, staff.fullname);
  }else
  if (staff.fullname.length > 29 && staff.fullname.length < 35) {

    console.log(staff.fullname.length);

    const font = await Jimp.loadFont(
      "./fonts/poppins-bold/80/K7jyq8tHPu5Kj415tf1078lx.ttf.fnt"
    );
    await image.print(font, 280, 1050, staff.fullname);

  }
else if (staff.fullname.length > 35 && staff.fullname.length < 50) {
    const font = await Jimp.loadFont(
      "./fonts/poppins-bold/70/g5YF9tqdkubJWJKZJxUreCMv.ttf.fnt"
    );
    await image.print(font, 280, 1050, staff.fullname);
  } else {
    const font = await Jimp.loadFont(
      "./fonts/poppins-bold/100/xy2qbSdTuFB3GDeoe1oCeKOw.ttf.fnt"
    );
    await image.print(font, 280, 1050, ucwords(staff?.fullname) );
  }

  const staff_qrcode = await Jimp.read("./qrl.png");
  staff_qrcode.resize(250, 250);
  await image.composite(staff_qrcode, 1664, 420);

  staff_image.resize(505, 572);
  // Defining the text font
  await image.composite(staff_image, 164, 420);

  await image.print(font14, 1100, 540, staff?.unique_id_no);
  await image.print(font14, 860, 650, ucwords(staff?.fac_a_department));
  await image.print(
    font14,
    950,
    750,
    ucwords(staff?.gender)
  );
  await image.print(font14, 994, 850, ucwords(staff.work_position));
  // Writing image after processing
  await image.writeAsync("./card/card_done.png");

  const filePath = path.resolve(".", "./card/card_done.png");
  const imageBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "image/png");
  res.send(imageBuffer);

  // res.status(200).json(staff);
}
