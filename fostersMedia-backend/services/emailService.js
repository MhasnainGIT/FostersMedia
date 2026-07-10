import nodemailer from 'nodemailer';
import { AppError } from './errorMiddleware.js';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Fosters Media" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw new AppError('Failed to send email', 500);
  }
};

export const sendNewEnquiryEmail = async (enquiry) => {
  const html = `
    <h2>New Enquiry Received</h2>
    <p><strong>Company:</strong> ${enquiry.brandDetails?.companyName}</p>
    <p><strong>Contact:</strong> ${enquiry.brandDetails?.contactPerson}</p>
    <p><strong>Email:</strong> ${enquiry.brandDetails?.email}</p>
    <p><strong>Campaign Type:</strong> ${enquiry.campaignType}</p>
    <p><strong>Message:</strong> ${enquiry.message}</p>
  `;

  await sendEmail(process.env.EMAIL_USER, 'New Enquiry - Fosters Media', html);
};

export const sendBookingRequestEmail = async (enquiry) => {
  const html = `
    <h2>Booking Request Confirmation</h2>
    <p>Thank you for your booking request. We will contact you shortly.</p>
    <p><strong>Reference:</strong> ${enquiry._id}</p>
  `;

  if (enquiry.brandDetails?.email) {
    await sendEmail(enquiry.brandDetails.email, 'Booking Request Received', html);
  }
};
