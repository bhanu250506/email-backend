import dotenv from 'dotenv';
dotenv.config(); // 👈 Load environment variables from .env
// 2️⃣ Debug log to verify .env is working
console.log('Loaded Email Config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '✔️ Loaded' : '❌ Not loaded'
});


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (options) => {
    const mailOptions = {
        from: `"${options.fromName}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        replyTo: options.replyToEmail, // ✅ ADD THIS LINE
        subject: options.subject,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.to}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${options.to}:`, error);
        return false;
    }
};