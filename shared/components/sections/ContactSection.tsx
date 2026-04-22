'use client'

export default function ContactSection() {
  const contactInfo = [
    {
      icon: "📍",
      title: "Adresse",
      details: ["Antananarivo, Madagascar", "Quartier Analakely"]
    },
    {
      icon: "📞",
      title: "Téléphone",
      details: ["+261 34 XX XX XX XX", "+261 33 XX XX XX XX"]
    },
    {
      icon: "✉️",
      title: "Email",
      details: ["contact@imopanorama.mg", "info@batipanorama.mg"]
    },
    {
      icon: "🕒",
      title: "Horaires",
      details: ["Lun - Ven: 8h - 17h", "Sam: 8h - 12h"]
    }
  ]

  return (
    <section id="contact" className="section-padding bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Contactez-nous
              </h2>
              <p className="text-xl text-gray-300">
                Prêt à investir dans votre avenir ? Notre équipe est là pour vous accompagner 
                dans votre projet immobilier à Madagascar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">{info.icon}</span>
                    <h3 className="text-lg font-semibold">{info.title}</h3>
                  </div>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-300 ml-8">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <h3 className="text-2xl font-bold mb-6">Demande d&apos;information</h3>
            
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium mb-2">
                  Je m&apos;intéresse à *
                </label>
                <select
                  id="interest"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Choisissez une option</option>
                  <option value="terrain">Achat de terrain</option>
                  <option value="construction">Construction avec BatiPanorama</option>
                  <option value="both">Terrain + Construction</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Décrivez votre projet..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full btn-primary">
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
