import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: "wisest.ai.team@gmail.com",
    user: "wisest.ai.team@gmail.com",
    // pass: "pqiv vtiq mrci pmnw",
    pass: "sjok nenr wysx mdul"
  },
});

export const sendResetEmail = (email, token) => {
  const mailOptions = {
    from: "wisest.ai.team@gmail.com",
    to: email,
    subject: 'Wisest Annotate Password Reset',
    text: `You requested a password reset. Here is your reset code: ${token}`,
  };

  return transporter.sendMail(mailOptions);
};
