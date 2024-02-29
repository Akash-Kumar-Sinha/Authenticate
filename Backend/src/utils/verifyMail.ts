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
      html: `<div style="font-family: Arial, sans-serif; text-align: center;">
      <a href="${link}" style="text-decoration: none; color: #007bff; font-size: 18px;">Click here to validate</a>
  </div>`,
    });
  } catch (error) {
    console.log("error:verifyEmail", error);
  }
};

export default verifyEmail;
