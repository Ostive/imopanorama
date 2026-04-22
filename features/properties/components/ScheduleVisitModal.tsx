'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface ScheduleVisitModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  propertyTitle: string
}

const visitTypes = [
  { value: 'sur-place', label: 'Visite sur place' },
  { value: 'appel-video', label: 'Premier échange en visio' },
  { value: 'appel-telephone', label: 'Appel téléphonique avant visite' },
]

const timeSlots = [
  { value: 'matin', label: 'Matin' },
  { value: 'midi', label: 'Midi' },
  { value: 'apres-midi', label: 'Après-midi' },
  { value: 'fin-journee', label: 'Fin de journée' },
]

export default function ScheduleVisitModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
}: ScheduleVisitModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    visitType: '',
    preferredDate: '',
    timeSlot: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const updateField = (name: keyof typeof formData, value: string) => {
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.visitType || !formData.preferredDate || !formData.timeSlot) {
      toast.error('Merci de compléter les champs principaux')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          propertyId,
          message: [
            'Demande de rendez-vous visite',
            '',
            `Bien : ${propertyTitle}`,
            `Référence : ${propertyId}`,
            `Type de rendez-vous : ${labelFor(visitTypes, formData.visitType)}`,
            `Date souhaitée : ${formData.preferredDate}`,
            `Créneau : ${labelFor(timeSlots, formData.timeSlot)}`,
            '',
            formData.message || 'Aucun message complémentaire.',
          ].join('\n'),
        }),
      })

      if (!response.ok) throw new Error('Visit request failed')

      toast.success('Demande de visite envoyée')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        visitType: '',
        preferredDate: '',
        timeSlot: '',
        message: '',
      })
      onClose()
    } catch {
      toast.error("Nous n'avons pas pu envoyer la demande")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black">Programmer une visite</DialogTitle>
          <DialogDescription>
            Choisissez le type de rendez-vous et le créneau souhaité. L'équipe confirmera la disponibilité.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-bold text-gray-900">{propertyTitle}</p>
            <p>Référence : {propertyId}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field icon={<UserIcon className="h-4 w-4" />} label="Prénom *">
              <Input name="firstName" value={formData.firstName} onChange={handleChange} className="h-12 rounded-xl" />
            </Field>
            <Field label="Nom *">
              <Input name="lastName" value={formData.lastName} onChange={handleChange} className="h-12 rounded-xl" />
            </Field>
            <Field icon={<EnvelopeIcon className="h-4 w-4" />} label="Email *">
              <Input type="email" name="email" value={formData.email} onChange={handleChange} className="h-12 rounded-xl" />
            </Field>
            <Field icon={<PhoneIcon className="h-4 w-4" />} label="Téléphone">
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+261 34 00 000 00" className="h-12 rounded-xl" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Type *">
              <Select value={formData.visitType} onValueChange={(value) => updateField('visitType', value)}>
                <SelectTrigger className="h-12 w-full rounded-xl">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {visitTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field icon={<CalendarIcon className="h-4 w-4" />} label="Date *">
              <Input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="h-12 rounded-xl" />
            </Field>
            <Field icon={<ClockIcon className="h-4 w-4" />} label="Créneau *">
              <Select value={formData.timeSlot} onValueChange={(value) => updateField('timeSlot', value)}>
                <SelectTrigger className="h-12 w-full rounded-xl">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>{slot.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Message complémentaire">
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Disponibilités alternatives, questions avant la visite..."
              className="min-h-28 resize-none rounded-xl"
            />
          </Field>

          <Button disabled={isSubmitting} className="h-12 w-full rounded-xl bg-primary-600 text-white hover:bg-primary-700">
            {isSubmitting ? 'Envoi en cours...' : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Envoyer la demande de visite
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
        {icon}
        {label}
      </span>
      {children}
    </label>
  )
}

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label || value || 'Non renseigné'
}
