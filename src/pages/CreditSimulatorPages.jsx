import { useState, useMemo, useEffect, useCallback } from "react";
import { NumericFormat } from "react-number-format";
import { useParams, useNavigate } from "react-router-dom";
// Ambil semua data mobil tanpa filter tipe
import { IsuzuPrices } from "../data/isuzuPrices"; 
import { LeasingData } from "../data/LeasingData"; 
import { specs, allSpecSlugs } from "../data/specs";

// --- Data & Utils ---

// Daftar semua model untuk datalist
const allIsuzuModels = Object.values(IsuzuPrices).flat();

// Fungsi utilitas format
const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

// Fungsi perhitungan (Flat Rate)
const hitungAngsuran = (otrNumber, dp, tenor, bunga) => {
  if (otrNumber <= 0 || tenor <= 0) return 0;

  const loanAmount = otrNumber - dp;
  // Perhitungan Bunga (Flat Rate Tahunan)
  const totalBunga = loanAmount * bunga * (tenor / 12); 
  
  return (loanAmount + totalBunga) / tenor; // Angsuran Bulanan
};

const toSlug = (text) => {
    if (!text) return '';
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Fungsi baru untuk mencari NAMA MODEL dari SLUG
const slugToModelName = (targetSlug, models) => {
    return models.find(item => toSlug(item.model) === targetSlug)?.model;
};

export default function SimulasiKredit() {
  const {slug} = useParams()
  const navigate = useNavigate()
  const [selectedModel, setSelectedModel] = useState("");
  const [otrPrice, setOtrPrice] = useState(0);
  const [dpRp, setDpRp] = useState(70000000);
  const [dpPercent, setDpPercent] = useState(20);

  // Fungsi untuk mencari data model berdasarkan nama
  const findModelData = useCallback((modelName) => {
    return allIsuzuModels.find((item) => item.model === modelName);
  }, []);

  useEffect(()=>{
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

  const foundModel = allIsuzuModels.find(item => {
        const itemSlug = toSlug(item.model);
        return itemSlug.includes(shortSlug);
      });

      return foundModel ? toSlug(foundModel.model) : shortSlug; // Kembalikan slug yang lebih lengkap atau as-is
    };

    const targetSlug = autoCompleteSlug(slug);
    
    // --- Langkah 2: Cari Nama Model yang sesuai dengan Slug ---
    const modelName = slugToModelName(targetSlug, allIsuzuModels);

    if (modelName) {
      // Model ditemukan, atur state ke NAMA MODEL yang benar
      setSelectedModel(modelName); 
      
      // Jika slug di URL beda dengan targetSlug (misal, slug = 'nmr-58' tapi targetSlug = 'elf-nmr-hd-58'),
      // maka kita ganti URL-nya ke slug yang benar (bersih).
      if (targetSlug !== slug) {
          navigate(`/credit-simulator/${targetSlug}`, { replace: true });
      }
      
    } else {
      // Model tidak ditemukan atau slug yang dicari tidak valid.
      console.warn(`Model untuk slug "${slug}" (${targetSlug}) tidak ditemukan.`);
      
      // FALLBACK: Arahkan ke halaman simulasi tanpa slug (atau ke model default pertama)
      const defaultModel = allIsuzuModels[0];
      const defaultSlug = toSlug(defaultModel.model);
      
      // Hapus slug dari URL dan set model default
      setSelectedModel(defaultModel.model);
      navigate(`/credit-simulator/${defaultSlug}`, { replace: true });
    }
    
  }, [slug, navigate]); // Dependensi diperhatikan
//   const actualSlug = autoCompleteSlug(slug);
//   const found = actualSlug

//   navigate(`/credit-simulator/${actualSlug}`, { replace: true });
//   if (found) {
//     setSelectedModel(found);
//   } else {
//     // Fallback: cari slug yang mengandung keyword
//     const fallbackSlug = allIsuzuModels.find(s => s.includes(slug)) || allIsuzuModels[0];
//     console.log(`Fallback to: ${fallbackSlug}`);
//     navigate(`/credit-simulator/${fallbackSlug}`, { replace: true });
//   }
// }, [slug, navigate]);

  // 2. EFFECT UNTUK HARGA OTR BERDASARKAN selectedModel
  useEffect(() => {
    const modelData = findModelData(selectedModel);
    if (modelData) setOtrPrice(Number(modelData.price));
    else setOtrPrice(0);
  }, [selectedModel, findModelData]);

  // 3. EFFECT UNTUK DP (Percent ke Rupiah)
  useEffect(() => {
    if (otrPrice > 0) {
        setDpRp(Math.round((dpPercent / 100) * otrPrice));
    } else {
        setDpRp(0);
    }
  }, [dpPercent, otrPrice]);

  
  // 4. USEMEMO UNTUK SEMUA HASIL PERHITUNGAN DAN VALIDASI
  const simulationResults = useMemo(() => {
    
    // VALIDASI KESIAPAN DATA
    const isReady = otrPrice > 0 && dpRp > 0 && selectedModel !== "";
    
    if (!isReady) {
        return { isReady: false, formattedOtr: formatRupiah(otrPrice), results: [] };
    }
    
    // JIKA SIAP, LAKUKAN PERHITUNGAN
    const results = LeasingData.map(leasing => ({
        ...leasing,
        tenorData: leasing.tenor.map(tenor => {
            const cicilan = hitungAngsuran(otrPrice, dpRp, tenor, leasing.rate);
            
            return {
                tenor,
                cicilan,
                formattedCicilan: formatRupiah(cicilan)
            };
        })
    }));

    return { 
        isReady: true, 
        formattedOtr: formatRupiah(otrPrice), 
        results 
    };
    
  }, [otrPrice, dpRp, selectedModel]); 

  // --- RENDER KOMPONEN ---
  return (
    <div className="flex justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">

        {/* Form Input */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-6 text-center lg:text-left">
            Simulasi Kredit Mobil Baru 🚗
          </h2>
          
          {/* Model (Input + Datalist) */}
          <label className="block mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">Pilih Model Kendaraan</span>
            <input
              type="text"
              id="model-select"
              list="model-options"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder="Ketik nama model..."
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
            <datalist id="model-options">
              {allIsuzuModels.map((item) => (
                <option key={item.model} value={item.model} />
              ))}
            </datalist>
          </label>

          {/* Harga OTR */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Harga OTR</span>
            <p className="font-bold text-lg text-isuzu dark:text-isuzu-dark">
              {simulationResults.formattedOtr}
            </p>
          </div>

          {/* Uang Muka */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
            <label className="block w-full sm:w-1/2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Uang Muka (Rp)</span>
              <NumericFormat
                value={dpRp}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                onValueChange={(values) => setDpRp(values.floatValue || 0)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              />
            </label>

            <label className="block w-full sm:w-1/2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Uang Muka (%)</span>
              <input
                type="number"
                value={dpPercent}
                onChange={(e) => setDpPercent(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              />
            </label>
          </div>
        </div>

        {/* Hasil Simulasi - CONDITIONAL RENDERED */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-6 text-center lg:text-left">
            Hasil Simulasi Cicilan 🧾
          </h2>
          
          {simulationResults.isReady ? (
            // --- KONTEN HASIL ---
            <>
              {simulationResults.results.map((leasing) => (
                <div key={leasing.name} className="mb-6 border rounded-lg p-3 dark:border-gray-700">
                  <h3 className="font-semibold text-lg dark:text-white text-center lg:text-left mb-1">
                    {leasing.surname}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-3">
                    {leasing.name} (Bunga Flat {Math.round(leasing.rate * 100)}%)
                  </span>
                  {leasing.tenorData.map((data) => (
                    <div
                      key={data.tenor}
                      className="flex justify-between p-2 text-sm sm:text-base even:bg-gray-50 dark:even:bg-gray-800 rounded-sm"
                    >
                      <span>**{data.tenor} bulan**</span>
                      <span className="font-bold text-isuzu dark:text-isuzu-dark">
                        {data.formattedCicilan}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            // --- KONTEN PESAN (jika belum siap) ---
            <div className="flex items-center justify-center min-h-[300px] p-8 text-center bg-gray-50 rounded-lg dark:bg-gray-800">
                <p className="font-medium text-gray-600 dark:text-gray-400">
                    Mohon **Ketik dan Pilih Model** kendaraan yang tersedia. Pastikan **Harga OTR** dan **Uang Muka** sudah terisi untuk menampilkan simulasi kredit.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}