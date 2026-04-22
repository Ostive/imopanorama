# Configuration Mailtrap pour ImoPanorama

## 📧 Qu'est-ce que Mailtrap?

Mailtrap est un service de test d'emails qui permet de capturer tous les emails envoyés par votre application en développement sans les envoyer réellement aux destinataires. C'est parfait pour tester les emails sans risquer d'envoyer des emails de test à de vrais clients.

## 🚀 Configuration

### 1. Créer un compte Mailtrap

1. Allez sur [https://mailtrap.io](https://mailtrap.io)
2. Créez un compte gratuit
3. Confirmez votre email

### 2. Obtenir les identifiants SMTP

1. Connectez-vous à Mailtrap
2. Allez dans **Email Testing** → **Inboxes**
3. Cliquez sur votre inbox (ou créez-en une nouvelle)
4. Dans l'onglet **SMTP Settings**, sélectionnez **Nodemailer**
5. Copiez les informations de connexion

### 3. Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local`:

```env
# Mailtrap Configuration
MAILTRAP_HOST="sandbox.smtp.mailtrap.io"
MAILTRAP_PORT="2525"
MAILTRAP_USER="votre_username_mailtrap"
MAILTRAP_PASS="votre_password_mailtrap"

# Admin Email (pour recevoir les notifications)
ADMIN_EMAIL="admin@imopanorama.mg"
```

## 📨 Fonctionnalités Email

### 1. Contact Terrain

Quand un client contacte pour un terrain:

**Email au client:**
- ✅ Confirmation de la demande
- 📋 Récapitulatif du terrain
- 📍 Localisation et prix
- 💬 Message envoyé
- 🔗 Lien vers le terrain

**Email à l'admin:**
- 🔔 Notification de nouvelle demande
- 👤 Informations du client
- 🏡 Détails du terrain
- 📝 Message du client
- 🔗 Lien vers l'admin

### 2. Demande de Devis BatiPanorama

Quand un client demande un devis:

**Email au client:**
- ✅ Confirmation de la demande
- 🏗️ Type de projet
- 💰 Budget estimé
- 📍 Localisation
- ⏱️ Délai de réponse (48h)

**Email à l'admin:**
- 🔔 Notification de nouvelle demande
- 👤 Informations du client
- 🏗️ Détails du projet
- 📝 Message du client

## 🧪 Tester l'envoi d'emails

### Test de connexion

Créez un fichier de test `src/app/api/test-email/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { testMailtrapConnection } from '@/lib/email';

export async function GET() {
  try {
    const isConnected = await testMailtrapConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Connexion Mailtrap réussie!' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Échec de la connexion Mailtrap' 
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

Puis visitez: `http://localhost:3000/api/test-email`

### Test d'envoi d'email

```typescript
import { 
  sendTerrainContactConfirmation,
  sendBatiQuoteConfirmation 
} from '@/lib/email';

// Test email terrain
await sendTerrainContactConfirmation({
  terrainTitle: 'Terrain de 500m² à Antananarivo',
  terrainId: 'test-123',
  terrainPrice: '50 000 000 Ar',
  terrainLocation: 'Antananarivo, Ivandry',
  clientName: 'Jean Dupont',
  clientEmail: 'test@example.com',
  clientPhone: '+261 34 12 345 67',
  message: 'Je suis intéressé par ce terrain.'
});

// Test email devis BatiPanorama
await sendBatiQuoteConfirmation({
  projectType: 'Construction de maison',
  budget: '100 000 000 - 150 000 000 Ar',
  location: 'Antananarivo',
  clientName: 'Marie Martin',
  clientEmail: 'test@example.com',
  clientPhone: '+261 34 98 765 43',
  message: 'Je souhaite construire une maison de 150m².'
});
```

## 📊 Voir les emails dans Mailtrap

1. Connectez-vous à Mailtrap
2. Allez dans votre inbox
3. Tous les emails envoyés apparaîtront ici
4. Vous pouvez:
   - Voir le HTML rendu
   - Vérifier le code source
   - Tester sur différents clients email
   - Vérifier les headers
   - Analyser le spam score

## 🔄 Intégration dans les APIs

### API Contact Terrain

```typescript
// Dans /api/contacts/route.ts
import { 
  sendTerrainContactConfirmation,
  sendTerrainContactNotificationToAdmin 
} from '@/lib/email';

export async function POST(request: Request) {
  // ... validation et sauvegarde en DB ...
  
  try {
    // Envoyer email au client
    await sendTerrainContactConfirmation({
      terrainTitle: terrain.title,
      terrainId: terrain.id,
      terrainPrice: formatPrice(terrain.price),
      terrainLocation: `${terrain.city}, ${terrain.address}`,
      clientName: `${body.firstName} ${body.lastName}`,
      clientEmail: body.email,
      clientPhone: body.phone,
      message: body.message
    });
    
    // Envoyer notification à l'admin
    await sendTerrainContactNotificationToAdmin({
      // ... même données ...
    });
  } catch (emailError) {
    console.error('Erreur envoi email:', emailError);
    // Ne pas faire échouer la requête si l'email échoue
  }
  
  return NextResponse.json({ success: true });
}
```

### API Devis BatiPanorama

```typescript
// Dans /api/bati-quotes/route.ts
import { 
  sendBatiQuoteConfirmation,
  sendBatiQuoteNotificationToAdmin 
} from '@/lib/email';

export async function POST(request: Request) {
  // ... validation et sauvegarde en DB ...
  
  try {
    // Envoyer email au client
    await sendBatiQuoteConfirmation({
      projectType: body.projectType,
      budget: body.budget,
      location: body.location,
      clientName: `${body.firstName} ${body.lastName}`,
      clientEmail: body.email,
      clientPhone: body.phone,
      message: body.message
    });
    
    // Envoyer notification à l'admin
    await sendBatiQuoteNotificationToAdmin({
      // ... même données ...
    });
  } catch (emailError) {
    console.error('Erreur envoi email:', emailError);
  }
  
  return NextResponse.json({ success: true });
}
```

## 🚀 Passage en Production

Pour la production, vous devrez:

1. **Utiliser un vrai service SMTP** (pas Mailtrap):
   - SendGrid
   - Mailgun
   - Amazon SES
   - Brevo (ex-Sendinblue)

2. **Mettre à jour les variables d'environnement**:
```env
MAILTRAP_HOST="smtp.sendgrid.net"  # ou autre service
MAILTRAP_PORT="587"
MAILTRAP_USER="apikey"
MAILTRAP_PASS="votre_api_key"
```

3. **Configurer un domaine email**:
   - Utiliser un vrai domaine (ex: noreply@imopanorama.mg)
   - Configurer SPF, DKIM, DMARC

## 🎨 Personnalisation des Templates

Les templates HTML sont dans `/src/lib/email.ts`. Vous pouvez:

- Modifier les couleurs
- Ajouter votre logo
- Changer la structure
- Ajouter des sections
- Personnaliser les messages

## 📝 Bonnes Pratiques

1. ✅ **Toujours tester** avant d'envoyer en production
2. ✅ **Gérer les erreurs** sans faire échouer la requête principale
3. ✅ **Logger les envois** pour le débogage
4. ✅ **Utiliser des templates** HTML responsive
5. ✅ **Inclure un lien de désabonnement** (pour les newsletters)
6. ✅ **Respecter le RGPD** et les lois anti-spam

## 🆘 Dépannage

### Erreur de connexion

```
Error: Invalid login: 535 5.7.8 Error: authentication failed
```

**Solution:** Vérifiez vos identifiants Mailtrap dans `.env.local`

### Email non reçu

1. Vérifiez les logs de la console
2. Vérifiez votre inbox Mailtrap
3. Vérifiez que les variables d'environnement sont chargées

### Erreur de timeout

```
Error: Connection timeout
```

**Solution:** Vérifiez votre connexion internet et le port (2525 ou 587)

## 📚 Ressources

- [Documentation Mailtrap](https://mailtrap.io/docs)
- [Documentation Nodemailer](https://nodemailer.com)
- [Guide HTML Email](https://www.campaignmonitor.com/css/)
