import nodemailer from 'nodemailer';

export const emailConfig = {
  host: process.env.SMTP_HOST || process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || process.env.MAILTRAP_PORT || '2525', 10),
  user: process.env.SMTP_USER || process.env.MAILTRAP_USER,
  pass: process.env.SMTP_PASS || process.env.MAILTRAP_PASS,
  from: process.env.SMTP_FROM || 'contact@imopanorama.mg',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@imopanorama.mg',
};

export function getMailFrom(name = 'ImoPanorama') {
  return `"${name}" <${emailConfig.from}>`;
}

export const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('Connexion email reussie');
    return true;
  } catch (error) {
    console.error('Erreur de connexion email:', error);
    return false;
  }
}

export const testMailtrapConnection = testEmailConnection;
