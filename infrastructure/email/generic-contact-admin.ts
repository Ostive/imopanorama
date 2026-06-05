import { emailConfig, getMailFrom, transporter } from './transporter';
import { GenericContactData } from './types';

/**
 * Notifie l'admin d'un nouveau contact générique
 */
export async function sendGenericContactNotificationToAdmin(data: GenericContactData) {
    const adminEmail = emailConfig.adminEmail;

    const mailOptions = {
        from: getMailFrom('ImoPanorama'),
        to: adminEmail,
        subject: `[ImoPanorama] Nouveau message de contact de ${data.clientName}`,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Nouveau message de contact</h1>
              <p>ImoPanorama — Administration</p>
            </div>
            <div class="content">
              <p>Un visiteur vous a envoyé un message via le formulaire de contact.</p>
              <div class="info-box">
                <p><strong>👤 Nom :</strong> ${data.clientName}</p>
                <p><strong>📧 Email :</strong> <a href="mailto:${data.clientEmail}">${data.clientEmail}</a></p>
                ${data.clientPhone ? `<p><strong>📞 Téléphone :</strong> ${data.clientPhone}</p>` : ''}
                <p><strong>📝 Message :</strong></p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 6px; font-style: italic;">${data.message}</p>
              </div>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts" class="button">Voir dans l'administration</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ImoPanorama - Message généré automatiquement</p>
            </div>
          </div>
        </body>
      </html>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
}
