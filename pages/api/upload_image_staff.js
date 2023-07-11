import { IncomingForm } from 'formidable'
const sharp = require('sharp');
var mv = require('mv');

export const config = {
    api: {
        bodyParser: false,
    }
};




export default function handler(req, res) {
    if (req.method.toLowerCase() === 'post') {

        const form = new IncomingForm({
            keepExtensions: false
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }

            var filepath = files.avatar.filepath


            var newPath = `./public/images/profile/${files.avatar.newFilename}`;



            // mv(filepath, newPath, { mkdirp: true }, function (err) {

            //     res.status(200).json({ name: err })
            // });

            sharp(filepath)
                .resize(200)
                .webp({ lossless: true, quality:70 })
                .withMetadata({
                    exif: {
                        IFD0: {
                            Copyright: 'BAS by PearlDrift Technologies LTD'
                        }
                    }
                })
                .resize(400)
                .toFile(`./public/images/profile/${files.avatar.newFilename}.webp`)
                .then(() => {


                    // output.png is a 200 pixels wide and 300 pixels high image
                    // containing a nearest-neighbour scaled version
                    // contained within the north-east corner of a semi-transparent white canvas
                });

                res.status(200).json({ uploaded: true, avatar: files?.avatar })
        });


    } else {
        res.status(400).json({ error: true  })
    }
}