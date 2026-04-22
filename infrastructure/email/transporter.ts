import nodemailer from 'nodemailer';

// Configuration Mailtrap
export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.MAILTRAP_PORT || '2525'),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Fonction de test de connexion Mailtrap
export async function testMailtrapConnection() {
  try {
    await transporter.verify();
    console.log('✅ Connexion Mailtrap réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Mailtrap:', error);
    return false;
  }
}
