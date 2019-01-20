import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER,
  },
  service: 'gmail',
  tls: {
    rejectUnauthorized: false,
  },
})

export default transporter
