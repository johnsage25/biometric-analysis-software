const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const {from, to, html, text, subject} = req.body

        try {


            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USERNAME, // generated ethereal user
                    pass: process.env.MAIL_PASSWORD, // generated ethereal password
                },
            });


            // send mail with defined transport object
            let mailServer = await transporter.sendMail({
                "from": from !== undefined  ? from : process.env.MAIL_FROM,
                "to": to,
                "html": html.length> 0 ? html : "",
                "text": text?.length>0 ? text : "",
                "subject": subject?.length > 0 ? subject: ""
            });
            nodemailer.getTestMessageUrl(mailServer)

            res.status(200).json({ message: "sent", status: true })

        } catch (error) {
            res.status(200).json({ message: error })
        }



    } else {
        res.status(200).json({ message: "Invalid request method" })
    }
}