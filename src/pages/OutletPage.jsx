import { useState } from "react";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { outlets } from "../data/siteContent.json";

export default function OutletSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = outlets[activeIndex];

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Judul */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Lokasi Dealer Kami
        </h2>

        {/* Tombol outlet */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {outlets.map((outlet, i) => (
            <button
              key={outlet.name}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                i === activeIndex
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {outlet.name}
            </button>
          ))}
        </div>

        {/* Info dan Map */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Info */}
          <div className="flex-1 flex items-start space-x-3">
            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-xl">{active.name}</h3>
              <p className="text-gray-600 mb-3">{active.address}</p>
              <a
                href={active.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Map dengan animasi */}
          <div className="flex-1 w-full h-[300px] rounded-xl overflow-hidden shadow-md relative">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={active.embed} // agar ganti animasi saat embed berubah
                src={active.embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Lokasi ${active.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              ></motion.iframe>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
