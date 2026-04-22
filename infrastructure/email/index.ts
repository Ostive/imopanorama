// Export all email types
export * from './types';

// Export transporter and connection test
export { transporter, testMailtrapConnection } from './transporter';

// Export property contact emails
export { sendPropertyContactConfirmation } from './property-contact-confirmation';
export { sendPropertyContactNotificationToAdmin } from './property-contact-admin';

// Export generic contact emails
export { sendGenericContactConfirmation } from './generic-contact-confirmation';
export { sendGenericContactNotificationToAdmin } from './generic-contact-admin';

// Export BatiPanorama quote emails
export { sendBatiQuoteConfirmation } from './bati-quote-confirmation';
export { sendBatiQuoteNotificationToAdmin } from './bati-quote-admin';

// Export password reset email
export { sendPasswordResetEmail } from './password-reset';
