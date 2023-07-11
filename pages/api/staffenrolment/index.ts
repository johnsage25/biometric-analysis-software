import { StaffEnrolment, mongoose } from "../../../database";

// Import required modules
const nextConnect = require("next-connect");
const multer = require("multer");

// Configure Multer to handle image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.body.uuid + ".jpg");
  },
});
const upload = multer({ storage });

// Initialize Next.js API route handler
const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(error);
    res.status(500).end("Internal Server Error");
  },
  onNoMatch(req, res) {
    res.status(405).end("Method Not Allowed");
  },
});

// Define API route
apiRoute.post(upload.single("image"), async (req, res) => {
  console.log(req.body);

  const imageUrl = `/uploads/images/${req.file.filename}`;

  let resp = await new Promise((resolve, reject) => {
    StaffEnrolment.create({
      _id: mongoose.Types.ObjectId(),
      ...req.body,
      staff_image: req.file.filename,
    })
      .then((result: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        resolve({});
      });
  });

  res.status(200).json({ body: resp });
});

// Export API route
export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
