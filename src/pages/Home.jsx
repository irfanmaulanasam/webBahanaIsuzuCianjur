import { FacebookIcon,InstagramIcon,MessageCircle } from 'lucide-react'
import data from '../data/siteContent.json'
import Banner from '../components/Banner'
import ContactForm from "../components/ContactForm"

export default function Home(){
  return (
    <div>
      <Banner data={data.banner} />
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Produk Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.products.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <a
                href={'/products/'+item.category}
                rel="noopener noreferrer"
                className="inline-block bg-bahana text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
              >
                Lihat Produk
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-4">Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services.map((service, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Hubungi Kami */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Kontak */}
          <div>
            <p className="text-gray-700 mb-2">
              <strong>Telepon:</strong> {data.contact.phone}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong>{' '}
              <a href={`mailto:${data.contact.email}`} className="text-blue-600 hover:underline">
                {data.contact.email}
              </a>
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Alamat:</strong> {data.contact.address}
            </p>
            <a
              href={data.contact.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:underline mb-4"
            >
              Lihat di Google Maps
            </a>

            <div className="flex space-x-4 mt-4">
              {data.contact.social.facebook && (
                <a href={data.contact.social.facebook} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon/>
                </a>
              )}
              {data.contact.social.instagram && (
                <a href={data.contact.social.instagram} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon/>
                </a>
              )}
              {data.contact.social.whatsapp && (
                <a href={data.contact.social.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle/>
                </a>
              )}
            </div>
          </div>

          {/* Formulir Kontak */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}