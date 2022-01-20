import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as cors0 from "cors";

const cors = cors0({origin: true});

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "carealothomes.m@gmail.com",
    pass: "FSOMlBrJdHvTG05gE0JZ!",
  },
});

export const sendEmail = functions.https.onRequest((request, response) => {
  if (request.app === undefined || request.app === null) {
    throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app.");
  }
  cors(request, response, () => {
    const dest = request.body.toEmail;

    const mailOptions = {
      from: "CareALot Homes <carealothomes.m@gmail.com>",
      to: dest,
      subject: "Request for info for" + request.body.location,
      html: `<p>${request.body.message}</p>`,
    };

    return transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return response.send(err.toString());
      }
      return response.send("sent");
    });
  });
});
