import { useState, useMemo, useEffect } from "react";
import { Info } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import { specs, allSpecSlugs } from "../data/specs";

// 1. Data Default didefinisikan sekali di luar komponen
const DEFAULT_DATA = {
  hargaTruk: 300000000,
  umurPakai: 5,
  nilaiSisa: 100000000,
  bungaKredit: 8,
  kirPajak: 10000000,
  asuransi: 8000000,
  gajiSupir: 3000000,
  hargaSolar: 5500,
  rasioBBM: 5,
  jarakTahunan: 50000,
  perawatan: 20000000,
  ban: 10000000,
};

// Fungsi utilitas untuk membersihkan harga string menjadi angka
const cleanPrice = (priceString) => {
    const rawPrice = priceString.replace(/[^0-9]/g, '');
    return parseInt(rawPrice, 10) || DEFAULT_DATA.hargaTruk; // Fallback ke harga default jika gagal
};

// Fungsi Autocomplete di luar komponen untuk kebersihan
const autoCompleteSlug = (shortSlug) => {
    if (!shortSlug) return null;
    if (shortSlug === "blindvan") return "traga-blind-van";
    
    const prefixMap = {
        "nmr": "elf-", "nlr": "elf-", "nps": "elf-", "nqr": "elf-",
        "dmax": "", "traga": "", "blind-van": "traga-", "box": "traga-",
        "mu-x": "", "giga": "", "elf": ""
    };
    for (const [key, prefix] of Object.entries(prefixMap)) {
        if (shortSlug.startsWith(key) || shortSlug === key.replace('-', '')) {
            return prefix + shortSlug;
        }
    }
    return shortSlug;
};
// Di dalam VehicleCostCalculator:
const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Nilai 'value' dari NumericFormat sudah berupa angka murni (atau 0 jika kosong), 
    // jadi kita tidak perlu lagi konversi string atau cek kosong/0.
    setData(prevData => ({ 
        ...prevData, 
        // Langsung gunakan nilai yang dikirim dari NumericFormat
        [name]: value 
    }));
};

export default function VehicleCostCalculator() {
  const [data, setData] = useState(DEFAULT_DATA);

  const { slug } = useParams();
  const navigate = useNavigate();

  // --- LOGIKA LOAD DATA & REDIRECT ---
  useEffect(() => {
    // 1. KONDISI DEFAULT (/vehicle-cost): Tidak ada slug, tampilkan data default
    if (!slug) {
      // Jika saat ini state berbeda dari default, reset ke default
      if (data.hargaTruk !== DEFAULT_DATA.hargaTruk) {
        setData(DEFAULT_DATA);
      }
      return; 
    }
    
    // 2. KONDISI SLUG ADA: Autocomplete & Redirect
    const actualSlug = autoCompleteSlug(slug);
    
    // Jika slug di URL belum benar, paksa redirect ke slug yang benar
    if (actualSlug && actualSlug !== slug) {
        // Redirect yang aman, tetap di path /vehicle-cost
        navigate(`/vehicle-cost/${actualSlug}`, { replace: true }); 
        return; 
    }
    
    // 3. Load Data Spesifik
    const found = specs[actualSlug];

    if (found) {
        const priceNumber = cleanPrice(found.price);

        // ✅ SOLUSI UNTUK DATA HILANG & UNCONTROLLED INPUT:
        // Gunakan prevData dan hanya timpa hargaTruk
        setData(prevData => ({
          ...prevData, // Memastikan semua key perhitungan lain tetap ada
          hargaTruk: priceNumber, 
          // Jika ada data lain di 'specs' (misal rasioBBM) yang ingin di-update:
          // rasioBBM: found.rasioBBM || prevData.rasioBBM,
        }));
    } else {
        // Fallback: Jika slug valid namun tidak ditemukan
        const fallbackSlug = allSpecSlugs.find(s => s.includes(slug));

        if (fallbackSlug) {
            navigate(`/vehicle-cost/${fallbackSlug}`, { replace: true });
        } else {
            // Jika benar-benar tidak ditemukan, reset ke default untuk menampilkan kalkulator
            setData(DEFAULT_DATA);
        }
    }
  }, [slug, navigate]); 
  // Dependency 'data' dihapus dari sini agar tidak memicu infinite loop saat setData(DEFAULT_DATA)

  // --- HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nilai string kosong ('') diubah menjadi 0
    const numericValue = Number(value === '' ? 0 : value); 
    setData(prevData => ({ ...prevData, [name]: numericValue }));
  };

  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

  // --- PERHITUNGAN (useMemo) ---
  const result = useMemo(() => {
    // ✅ SOLUSI UNTUK NaN: Gunakan 0 atau 1 sebagai fallback untuk mencegah NaN
    const hTruk = data.hargaTruk || 0;
    const uPakai = data.umurPakai || 1; 
    const nSisa = data.nilaiSisa || 0;
    const bKredit = data.bungaKredit || 0;
    const kPajak = data.kirPajak || 0;
    const asu = data.asuransi || 0;
    const gSupir = data.gajiSupir || 0;
    const hSolar = data.hargaSolar || 0;
    const rBBM = data.rasioBBM || 1; 
    const jTahunan = data.jarakTahunan || 1; 
    const pRawat = data.perawatan || 0;
    const banCost = data.ban || 0;


    const penyusutan = (hTruk - nSisa) / uPakai;
    const bunga = (hTruk * (bKredit / 100));
    const fixedCost = penyusutan + bunga + kPajak + asu + gSupir * 12;
    const konsumsiBBM = jTahunan / rBBM;
    const biayaBBM = konsumsiBBM * hSolar;
    const variableCost = biayaBBM + pRawat + banCost;
    const totalCost = fixedCost + variableCost;
    
    // Cegah pembagian dengan nol
    const costPerKm = jTahunan > 0 ? totalCost / jTahunan : 0; 

    return { penyusutan, bunga, fixedCost, variableCost, totalCost, costPerKm };
  }, [data]);


  // --- RENDER ---
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-0">
      <h1 className="text-2xl font-bold text-center">
        Vehicle Cost Calculator
      </h1>
      <p className="text-center text-gray-600">
        Simulasi interaktif untuk menghitung biaya kendaraan komersial per tahun dan per kilometer
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Section title="Harga & Finansial">
            <Input
              label="Harga Kendaraan + Aplikasi"
              name="hargaTruk"
              value={data.hargaTruk}
              onChange={handleChange}
              info="Harga total kendaraan beserta perlengkapan tambahan seperti box atau GPS."
            />
              <span className="text-xs text-gray-500">
                Harga total kendaraan beserta perlengkapan tambahan seperti box atau GPS.
              </span>
            {/* Input lainnya menggunakan data yang sudah di-spread dari DEFAULT_DATA */}
            <Input 
              label="Umur Pakai (tahun)"
              name="umurPakai" value={data.umurPakai}
              onChange={handleChange}
              info="Estimasi umur ekonomis kendaraan sebelum diganti." 
            />
            <span className="text-xs text-gray-500">
              Estimasi umur ekonomis kendaraan sebelum diganti.
            </span>
            <Input 
              label="Nilai Sisa"
              name="nilaiSisa"
              value={data.nilaiSisa}
              onChange={handleChange}
              info="Nilai jual kembali kendaraan di akhir umur pakai." 
            />
            <span className="text-xs text-gray-500">
              Nilai jual kembali kendaraan di akhir umur pakai
            </span>
            <Input
              label="Bunga Kredit (%)"
              name="bungaKredit"
              value={data.bungaKredit}
              onChange={handleChange}
              info="Persentase bunga tahunan jika pembelian menggunakan kredit." 
            />
            <span className="text-xs text-gray-500">
              Persentase bunga tahunan jika pembelian menggunakan kredit
            </span>
          </Section>

          <Section title="Biaya Tetap">
            {/* Input lainnya */}
            <Input 
              label="KIR & Pajak / Tahun"
              name="kirPajak"
              value={data.kirPajak}
              onChange={handleChange}
              info="Biaya tahunan seperti KIR, pajak, dan administrasi kendaraan." 
            />
              <span className="text-xs text-gray-500">
                Biaya tahunan seperti KIR, pajak, dan administrasi kendaraan
              </span>
            <Input
              label="Asuransi / Tahun"
              name="asuransi"
              value={data.asuransi}
              onChange={handleChange}
              info="Premi tahunan asuransi kendaraan."
            />
              <span className="text-xs text-gray-500">
              Premi tahunan asuransi kendaraan
              </span>
            <Input
              label="Gaji Supir / Bulan"
              name="gajiSupir"
              value={data.gajiSupir}
              onChange={handleChange}
              info="Total gaji bulanan untuk pengemudi."
            />
            <span className="text-xs text-gray-500">
              Total gaji bulanan untuk pengemudi
            </span>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Biaya Variabel">
            {/* Input lainnya */}
            <Input 
              label="Harga Solar per Liter"
              name="hargaSolar"
              value={data.hargaSolar}
              onChange={handleChange}
              info="Harga bahan bakar diesel yang digunakan."
            />
            <span className="text-xs text-gray-500">
              Harga bahan bakar diesel yang digunakan
            </span>
            <Input
              label="Rasio Konsumsi BBM (Km/L)"
              name="rasioBBM" value={data.rasioBBM} 
              onChange={handleChange}
              info="Berapa kilometer yang bisa ditempuh tiap 1 liter solar." 
            />
            <Input label="Jarak Tempuh per Tahun (Km)" name="jarakTahunan" value={data.jarakTahunan} onChange={handleChange} info="Perkiraan total jarak yang ditempuh kendaraan dalam setahun." />
            <Input label="Perawatan / Tahun" name="perawatan" value={data.perawatan} onChange={handleChange} info="Biaya servis rutin, oli, dan spare part." />
            <Input label="Ban / Tahun" name="ban" value={data.ban} onChange={handleChange} info="Rata-rata biaya penggantian ban tahunan." />
          </Section>

          {/* HASIL PERHITUNGAN */}
          <Section title="Hasil Perhitungan">
            <Result label="Total Fixed Cost" value={formatRp(result.fixedCost)} />
            <Result label="Total Variable Cost" value={formatRp(result.variableCost)} />
            <Result label="Total Biaya per Tahun" value={formatRp(result.totalCost)} highlight />
            <Result label="Biaya per Km" value={`${formatRp(result.costPerKm)}/km`} highlight />
          </Section>
        </div>
      </div>
    </div>
  );
}

// ==== Komponen kecil (Direvisi untuk Nilai Default) ====

function Section({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, name, value, onChange, info }) {
  return (
    <div>
      <label className="font-medium text-sm text-gray-700 flex items-center gap-1">
        {label} <Info className="w-4 h-4 text-gray-400" title={info} />
      </label>
      
      {/* MENGGUNAKAN NUMERIC FORMAT */}
      <NumericFormat
        // Perluas props agar sesuai dengan input lama
        name={name}
        value={value ?? ''} // Pastikan nilai adalah string kosong jika null/undefined
        
        // --- Konfigurasi Formatting ---
        thousandSeparator="." // Pemisah ribuan (titik)
        decimalSeparator=","  // Pemisah desimal (koma)
        prefix={name === 'hargaTruk' ? 'Rp ' : ''} // Tambahkan prefix Rp hanya untuk Harga Truk
        allowNegative={false} // Pastikan input tidak bisa negatif
        
        // --- Integrasi Handler ---
        onValueChange={(values) => {
          // values.floatValue adalah angka murni yang bisa digunakan di state
          // values.value adalah string terformat yang ditampilkan
          
          // Panggil onChange milik parent component (VehicleCostCalculator)
          onChange({ 
            target: { 
              name: name,
              // Kirim angka murni (floatValue) ke handleChange
              value: values.floatValue ?? 0 
            } 
          });
        }}
        
        className="w-full border rounded-lg p-2 mt-1 text-sm"
      />
      {/* ... (Hilangkan span info yang duplikat jika ada) ... */}
    </div>
  );
}

function Result({ label, value, highlight }) {
  // Hanya menampilkan pesan error jika hasilnya NaN
  if (!value) {
    value = "data tidak ditemukan"
  }
  return (
    <div
      className={`flex justify-between items-center text-sm py-1 ${
        highlight ? "font-semibold text-blue-700" : "text-gray-700"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
