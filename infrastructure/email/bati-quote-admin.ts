import { emailConfig, getMailFrom, transporter } from './transporter';
import { BatiQuoteData } from './types';

/**
 * Envoie un email de notification à l'admin après une demande de devis BatiPanorama
 */
export async function sendBatiQuoteNotificationToAdmin(data: BatiQuoteData) {
  const mailOptions = {
    from: getMailFrom('BatiPanorama Notifications'),
    to: emailConfig.adminEmail,
    subject: `🔔 Nouvelle demande de devis - ${data.projectType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .label { font-weight: bold; color: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 Nouvelle demande de devis BatiPanorama</h2>
            </div>
            <div class="content">
              <div class="info-box">
                <h3>Informations du projet</h3>
                <p><span class="label">Type de projet :</span> ${data.projectType}</p>
                <p><span class="label">Budget :</span> ${data.budget}</p>
                <p><span class="label">Localisation :</span> ${data.location}</p>
              </div>

              <div class="info-box">
                <h3>Informations du client</h3>
                <p><span class="label">Nom :</span> ${data.clientName}</p>
                <p><span class="label">Email :</span> <a href="mailto:${data.clientEmail}">${data.clientEmail}</a></p>
                <p><span class="label">Téléphone :</span> <a href="tel:${data.clientPhone}">${data.clientPhone}</a></p>
              </div>

              <div class="info-box">
                <h3>Message du client</h3>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 6px;">${data.message}</p>
              </div>

              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts" style="display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px;">Voir dans l'admin</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de notification admin BatiPanorama envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email admin BatiPanorama:', error);
    throw error;
  }
}
