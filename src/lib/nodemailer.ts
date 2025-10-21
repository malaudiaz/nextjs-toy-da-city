// lib/nodemailer.ts
import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true para puerto 465, false para 587 (TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Amazon SES requiere TLS
      rejectUnauthorized: true,
    },
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado vía SES:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar correo con SES:', error);
    throw error;
  }
};