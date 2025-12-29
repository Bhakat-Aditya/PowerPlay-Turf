// server/utils/email.js
import nodemailer from 'nodemailer';
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your App Password
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: `"PowerPlay Turf" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text, 
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email Error:", error.message);
    }
};