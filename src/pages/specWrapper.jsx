// src/pages/SpecWrapper.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SpecPage from "./specPage";
import { specs, allSpecSlugs } from "../data/specs";

const WA_NUMBER = "+6287856277372"; // nomor internasional (ubah di sini jika perlu)

// ======= CUSTOM MESSAGE (W4) =======
// Ubah pesan ini sesuai kebutuhan. {MODEL} akan diganti dengan title model otomatis.
const CUSTOM_WA_MESSAGE = "Halo, saya tertarik dengan model {MODEL}. Mohon info harga, stok, dan promo. Terima kasih.";

// ====================================

function createWaLink(number, message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export default function SpecWrapper() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
useEffect(() => {
  if (!slug) return;
  
  // System auto-complete untuk slug pendek
  const autoCompleteSlug = (shortSlug) => {
    if (shortSlug==="blindvan") {
      shortSlug = "traga-blind-van"
    } 
    if (shortSlug === 'nmr-58') {
      shortSlug = 'elf-nmr-hd-58'
    }
    if (shortSlug === 'nmr-65') {
      shortSlug = 'elf-nmr-hd-65'
    }
    const prefixMap = {
      "nmr": "elf-",
      "nmr-65":"elf-",
      "nlr": "elf-", 
      "nps": "elf-",
      "nqr": "elf-",
      "dmax": "",
      "traga": "",
      "blind-van":"traga-",
      "box":"traga-",
      "mu-x": "",
      "giga": "",
      "elf": "" 
    };
    
    // Cari prefix yang cocok
    for (const [key, prefix] of Object.entries(prefixMap)) {
      if (shortSlug.startsWith(key) || shortSlug === key.replace('-', '')) {
        return prefix + shortSlug;
      }
    }
    
    return shortSlug; // return as-is jika tidak ada match
  };

  const actualSlug = autoCompleteSlug(slug);
  const found = specs[actualSlug];
  navigate(`/spec/${actualSlug}`, { replace: true });
  if (found) {
    setData(found);
  } else {
    // Fallback: cari slug yang mengandung keyword
    const fallbackSlug = allSpecSlugs.find(s => s.includes(slug)) || allSpecSlugs[0];
    console.log(`Fallback to: ${fallbackSlug}`);
    navigate(`/spec/${fallbackSlug}`, { replace: true });
  }
}, [slug, navigate]);

  // Floating WA link (bottom right) uses model title in message
  const waMessage = data ? CUSTOM_WA_MESSAGE.replace("{MODEL}", data.title) : CUSTOM_WA_MESSAGE;
  const waLink = createWaLink(WA_NUMBER, waMessage);

  // Popup after user scrolls down 60%
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress > 99) {
        setShowPopup(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <SpecPage data={data} />

      {/* Floating WA CTA */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-50"
        aria-label="Chat via WhatsApp"
      >
        <div className="flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.52 3.478A11.933 11.933 0 0012 0C5.373 0 .02 5.353.02 12c0 2.114.56 4.097 1.62 5.86L0 24l6.45-1.63A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.18-3.48-8.522zM12 22c-1.67 0-3.287-.44-4.72-1.27l-.34-.2-3.84.97.97-3.74-.22-.36A9.006 9.006 0 0112 3c4.966 0 9 4.034 9 9s-4.034 10-9 10z" />
            <path d="M17.45 14.33c-.28-.14-1.66-.82-1.92-.91-.26-.09-.45-.14-.64.14s-.74.91-.9 1.09c-.16.18-.32.2-.59.07-1.6-.79-2.65-1.43-3.72-3.21-.28-.48.28-.44.83-1.47.09-.21.05-.39-.02-.53-.07-.14-.64-1.53-.88-2.09-.23-.55-.47-.48-.64-.48-.17 0-.37-.01-.57-.01s-.53.08-.81.38c-.28.3-1.06 1.03-1.06 2.5 0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.35 5.14 4.69 2.02.92 2.82.98 3.84.82.62-.11 1.98-.81 2.26-1.59.28-.78.28-1.45.2-1.59-.08-.13-.29-.2-.57-.33z" />
          </svg>
          <span className="hidden sm:inline-block font-medium">Tanya via WhatsApp</span>
        </div>
      </a>  
    </>
  );
}
