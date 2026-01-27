import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail(email: string, otp: string) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Your ePay Account Verification Code",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ePay Verification</h1>
          </div>
          <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
              Welcome to ePay! Please use the code below to verify your email address and complete your registration.
            </p>
            <div style="background: white; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your verification code is:</p>
              <p style="color: #dc2626; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 5px;">${otp}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 30px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              © ePay. All rights reserved.
            </p>
          </div>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error("Email send error:", error);
        return false;
    }
}
