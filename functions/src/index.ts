import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as cors0 from "cors";

const cors = cors0({origin: true});

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "homes.carealot@gmail.com",
    pass: "54mMyl0v3!",
  },
});

export const sendEmail = functions.https.onRequest((request, response) => {
  if (request.app === undefined || request.app === null) {
    throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app.");
  }
  cors(request, response, () => {
    const dest = request.body.data.toEmail;

    const mailOptions = {
      from: "CareALot Homes <homes.carealot@gmail.com>",
      to: dest,
      subject: "Request for info for " + request.body.data.location,
      html: `<p>${request.body.data.message}</p>`,
    };

    return transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return response.send(err.toString());
      }
      return response.send({data: "sent"});
    });
  });
});
