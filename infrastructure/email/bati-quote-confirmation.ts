import { transporter } from './transporter';
import { BatiQuoteData } from './types';

/**
 * Envoie un email de confirmation au client après une demande de devis BatiPanorama
 */
export async function sendBatiQuoteConfirmation(data: BatiQuoteData) {
  const mailOptions = {
    from: '"BatiPanorama" <noreply@demomailtrap.co>',
    to: data.clientEmail,
    subject: `Confirmation de votre demande de devis - ${data.projectType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .project-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏗️ BatiPanorama</h1>
              <p>Merci pour votre demande de devis</p>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.clientName}</strong>,</p>

              <p>Nous avons bien reçu votre demande de devis pour votre projet de construction :</p>

              <div class="project-info">
                <h3>Détails de votre projet</h3>
                <p><strong>🏗️ Type de projet :</strong> ${data.projectType}</p>
                <p><strong>💰 Budget estimé :</strong> ${data.budget}</p>
                <p><strong>📍 Localisation :</strong> ${data.location}</p>
                <p><strong>📝 Votre message :</strong></p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 6px; font-style: italic;">${data.message}</p>
              </div>

              <p>Notre équipe d'experts en construction va analyser votre demande et vous proposera un devis personnalisé dans les 48 heures.</p>

              <p>Nous vous contacterons à l'adresse email <strong>${data.clientEmail}</strong> ou au numéro <strong>${data.clientPhone}</strong>.</p>

              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/batipanorama" class="button">Découvrir nos services</a>
              </p>

              <p>À très bientôt,<br><strong>L'équipe BatiPanorama</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} BatiPanorama - Tous droits réservés</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation devis BatiPanorama envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email devis BatiPanorama:', error);
    throw error;
  }
}
