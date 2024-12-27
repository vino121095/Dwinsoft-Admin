const nodemailer = require('nodemailer');

// transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'enool.project@gmail.com',
      pass: 'zrnbeyapxypapkbm',
    },
  });

  module.exports = transporter