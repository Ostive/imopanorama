'use client'

import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

interface AgencyActionButtonsProps {
  phone?: string
  whatsapp?: string
  email?: string
  propertyTitle?: string
  propertyId?: string
  onScheduleVisit?: () => void
  className?: string
}

export function AgencyActionButtons({
  phone = '+261202212345',
  whatsapp = '261202212345',
  email = 'contact@imopanorama.mg',
  propertyTitle,
  propertyId,
  onScheduleVisit,
  className,
}: AgencyActionButtonsProps) {
  const handleCall = () => {
    window.location.href = `tel:${phone}`
  }

  const handleWhatsApp = () => {
    const msg = propertyTitle && propertyId
      ? `Bonjour, je suis intéressé(e) par votre propriété "${propertyTitle}" (réf: ${propertyId}). Pouvez-vous me donner plus d'informations ?`
      : 'Bonjour, je souhaite avoir des informations sur vos propriétés.'
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleEmail = () => {
    const subject = propertyTitle
      ? `Demande d'information — ${propertyTitle}`
      : "Demande d'information"
    const body = propertyTitle && propertyId
      ? `Bonjour,\n\nJe suis intéressé(e) par la propriété "${propertyTitle}" (réf: ${propertyId}).\n\nPouvez-vous me donner plus d'informations ?\n\nCordialement,`
      : "Bonjour,\n\nJe souhaite avoir des informations sur vos propriétés.\n\nCordialement,"
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className={`space-y-3${className ? ` ${className}` : ''}`}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleCall}
          className="w-full justify-start px-6 bg-primary-600 hover:bg-primary-700 text-white py-6 gap-3 shadow-xl shadow-primary-500/30 rounded-xl"
          size="lg"
        >
          <PhoneIcon className="w-5 h-5" />
          <span>Appeler directement</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleWhatsApp}
          className="w-full justify-start px-6 bg-green-600 hover:bg-green-700 text-white py-6 gap-3 shadow-xl shadow-green-500/30 rounded-xl"
          size="lg"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span>WhatsApp</span>
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleEmail}
          variant="outline"
          className="w-full justify-start px-6 py-6 gap-3 border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50 rounded-xl"
          size="lg"
        >
          <EnvelopeIcon className="w-5 h-5" />
          <span>Envoyer par email</span>
        </Button>
      </motion.div>

      {onScheduleVisit && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onScheduleVisit}
            variant="outline"
            className="w-full justify-start px-6 py-6 gap-3 border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50 rounded-xl"
            size="lg"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Programmer une visite</span>
          </Button>
        </motion.div>
      )}
    </div>
  )
}
