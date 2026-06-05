import { getMailFrom, transporter } from './transporter';

interface PasswordResetData {
  email: string;
  userName?: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail(data: PasswordResetData) {
  const greeting = data.userName ? `Bonjour ${data.userName}` : 'Bonjour';

  const mailOptions = {
    from: getMailFrom('ImoPanorama'),
    to: data.email,
    subject: 'Réinitialisation de votre mot de passe - ImoPanorama',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 14px 36px; background: #667eea; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
            .link-fallback { background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 12px; color: #4b5563; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 ImoPanorama</h1>
              <p>Réinitialisation de mot de passe</p>
            </div>
            <div class="content">
              <p>${greeting},</p>

              <p>Vous avez demandé à réinitialiser le mot de passe de votre compte ImoPanorama. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>

              <p style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </p>

              <div class="warning">
                <strong>⏰ Ce lien expire dans 1 heure.</strong><br>
                Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email — votre mot de passe restera inchangé.
              </div>

              <p style="font-size: 13px; color: #6b7280;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
              <div class="link-fallback">${data.resetUrl}</div>

              <p style="margin-top: 30px;">À bientôt,<br><strong>L'équipe ImoPanorama</strong></p>
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de réinitialisation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email réinitialisation:', error);
    throw error;
  }
}
