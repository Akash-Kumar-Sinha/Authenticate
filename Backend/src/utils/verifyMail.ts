import nodemailer from "nodemailer";

const verifyEmail = async (email: string, link: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "process.env.EMAIL",
      to: email,
      subject: "Email Verification",
      text: "Welcome",
      html: `<div><a href="${link}">Click here to validate</a>
      <p>${link}</p></div>`,
    });
  } catch (error) {
    console.log("error:verifyEmail", error);
  }
};

export default verifyEmail;
// googlemailverification
// rgjq rmwf cycz qeqf