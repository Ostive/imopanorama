import { getMailFrom, transporter } from './transporter';
import { GenericContactData } from './types';

/**
 * Envoie un email de confirmation au client après un contact générique
 */
export async function sendGenericContactConfirmation(data: GenericContactData) {
    const mailOptions = {
        from: getMailFrom('ImoPanorama'),
        to: data.clientEmail,
        subject: `Confirmation de votre message - ImoPanorama`,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏡 ImoPanorama</h1>
              <p>Merci pour votre message</p>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.clientName}</strong>,</p>
              <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
              <div class="message-box">
                <p><strong>📝 Votre message :</strong></p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 6px; font-style: italic;">${data.message}</p>
              </div>
              <p>Nous vous contacterons à l'adresse <strong>${data.clientEmail}</strong>${data.clientPhone ? ` ou au <strong>${data.clientPhone}</strong>` : ''}.</p>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/proprietes" class="button">Voir nos propriétés</a>
              </p>
              <p>À très bientôt,<br><strong>L'équipe ImoPanorama</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ImoPanorama - Tous droits réservés</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
}
