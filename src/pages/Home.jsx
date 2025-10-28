import React from 'react'
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
          {/* simple placeholders */}
          <div className="p-4 border rounded">Product Card</div>
          <div className="p-4 border rounded">Product Card</div>
          <div className="p-4 border rounded">Product Card</div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-4">Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded">Service 1</div>
            <div className="p-4 border rounded">Service 2</div>
            <div className="p-4 border rounded">Service 3</div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
        <ContactForm />
      </section>

    </div>
  )
}