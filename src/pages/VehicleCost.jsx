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
  
  // 🟢 KOMPONEN KREDIT BARU
  tenor: 4, 
  uangMuka: 50000000, 
  // -------------------------
  
  kirPajak: 10000000,
  asuransi: 8000000,
  gajiSupir: 3000000,
  hargaSolar: 5500,
  rasioBBM: 5,
  jarakTahunan: 50000,
  perawatan: 20000000,
  ban: 10000000,
};

// Fungsi utilitas
const cleanPrice = (priceString) => {
    const rawPrice = priceString.replace(/[^0-9]/g, '');
    return parseInt(rawPrice, 10) || DEFAULT_DATA.hargaTruk;
};

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

export default function VehicleCostCalculator() {
  const [data, setData] = useState(DEFAULT_DATA);

  const { slug } = useParams();
  const navigate = useNavigate();

  // --- LOGIKA LOAD DATA & REDIRECT ---
  useEffect(() => {
    // 1. KONDISI DEFAULT (/vehicle-cost)
    if (!slug) {
      if (data.hargaTruk !== DEFAULT_DATA.hargaTruk) {
        setData(DEFAULT_DATA);
      }
      return; 
    }
    
    // 2. KONDISI SLUG ADA: Autocomplete & Redirect
    const actualSlug = autoCompleteSlug(slug);
    
    if (actualSlug && actualSlug !== slug) {
        navigate(`/vehicle-cost/${actualSlug}`, { replace: true }); 
        return; 
    }
    
    // 3. Load Data Spesifik
    const found = specs[actualSlug];

    if (found) {
        const priceNumber = cleanPrice(found.price);

        setData(prevData => ({
          ...prevData, 
          hargaTruk: priceNumber, 
          // Jika ada data lain di 'specs' yang ingin di-update, tambahkan di sini
        }));
    } else {
        // Fallback: Jika slug valid namun tidak ditemukan
        const fallbackSlug = allSpecSlugs.find(s => s.includes(slug));

        if (fallbackSlug) {
            navigate(`/vehicle-cost/${fallbackSlug}`, { replace: true });
        } else {
            setData(DEFAULT_DATA);
        }
    }
  }, [slug, navigate]); 
  
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
    // Input Data dengan Fallback
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
    // ------------------------------------
    const tenor = data.tenor || 1; // Tenor dalam tahun (minimal 1)
    const uMuka = data.uangMuka || 0; 
    // ------------------------------------
    
    // 1. KOMPONEN KREDIT (FLAT RATE)
    const nilaiPinjaman = hTruk > uMuka ? hTruk - uMuka : 0; // Pastikan pinjaman tidak negatif

    // Total Bunga Selama Tenor
    const totalBungaFlat = nilaiPinjaman * (bKredit / 100) * tenor;
    
    // Angsuran Pokok / Tahun
    const pokokTahunan = tenor > 0 ? nilaiPinjaman / tenor : nilaiPinjaman; 

    // Bunga Tahunan (Flat Rate)
    const bungaTahunan = tenor > 0 ? totalBungaFlat / tenor : totalBungaFlat;

    // Total Angsuran Kredit per Tahun
    const angsuranTahunan = pokokTahunan + bungaTahunan;

    
    // 2. BIAYA TETAP (FIXED COST)
    // Penyusutan Ekonomi (untuk Nilai Sisa):
    const penyusutanEkonomi = uPakai > 0 ? (hTruk - nSisa) / uPakai : (hTruk - nSisa); 

    // Fixed Cost = Angsuran Tahunan + Biaya Tetap Lain
    // (Angsuran Tahunan sudah mencakup Angsuran Pokok dan Bunga)
    const fixedCost = angsuranTahunan + kPajak + asu + gSupir * 12;
    
    
    // 3. BIAYA VARIABEL
    const konsumsiBBM = rBBM > 0 ? jTahunan / rBBM : 0;
    const biayaBBM = konsumsiBBM * hSolar;
    const variableCost = biayaBBM + pRawat + banCost;
    
    // 4. TOTAL & PER KM
    const totalCost = fixedCost + variableCost;
    const costPerKm = jTahunan > 0 ? totalCost / jTahunan : 0; 

    return { 
        penyusutan: penyusutanEkonomi, 
        bunga: bungaTahunan, 
        pokokTahunan, 
        angsuranTahunan, 
        fixedCost, 
        variableCost, 
        totalCost, 
        costPerKm 
    };
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

            {/* Input Uang Muka Baru */}
            <Input 
                label="Uang Muka (Down Payment)"
                name="uangMuka"
                value={data.uangMuka}
                onChange={handleChange}
                info="Uang muka yang dibayarkan di awal transaksi kredit." 
            />
            <span className="text-xs text-gray-500">
                Uang muka yang dibayarkan di awal transaksi kredit
            </span>
            
            {/* Input Tenor Baru */}
            <Input 
                label="Tenor Kredit (Tahun)"
                name="tenor"
                value={data.tenor}
                onChange={handleChange}
                info="Jangka waktu kredit dalam tahun." 
            />
            <span className="text-xs text-gray-500">
                Jangka waktu kredit dalam tahun
            </span>

            {/* Input Bunga Kredit (%) */}
            <Input
              label="Bunga Kredit Tahunan (%)"
              name="bungaKredit"
              value={data.bungaKredit}
              onChange={handleChange}
              info="Persentase bunga tahunan yang diterapkan oleh lembaga pembiayaan (flat rate)." 
            />
            <span className="text-xs text-gray-500">
              Persentase bunga tahunan yang diterapkan oleh lembaga pembiayaan (flat rate)
            </span>
          </Section>

          <Section title="Biaya Tetap Lain">
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
            <Input 
                label="Jarak Tempuh per Tahun (Km)" 
                name="jarakTahunan" 
                value={data.jarakTahunan} 
                onChange={handleChange} 
                info="Perkiraan total jarak yang ditempuh kendaraan dalam setahun." 
            />
            <Input 
                label="Perawatan / Tahun" 
                name="perawatan" 
                value={data.perawatan} 
                onChange={handleChange} 
                info="Biaya servis rutin, oli, dan spare part." 
            />
            <Input 
                label="Ban / Tahun" 
                name="ban" 
                value={data.ban} 
                onChange={handleChange} 
                info="Rata-rata biaya penggantian ban tahunan." 
            />
          </Section>

          {/* HASIL PERHITUNGAN */}
          <Section title="Hasil Perhitungan">
            <Result label="Angsuran Pokok Kredit / Tahun" value={formatRp(result.pokokTahunan)} />
            <Result label="Bunga Kredit / Tahun" value={formatRp(result.bunga)} />
            <Result label="Total Angsuran Kredit / Tahun" value={formatRp(result.angsuranTahunan)} highlight />
            <hr className="my-2"/>
            <Result label="Penyusutan Ekonomi / Tahun" value={formatRp(result.penyusutan)} />
            <Result label="Total Fixed Cost (Termasuk Angsuran)" value={formatRp(result.fixedCost)} />
            <Result label="Total Variable Cost" value={formatRp(result.variableCost)} />
            <Result label="Total Biaya Operasional / Tahun" value={formatRp(result.totalCost)} highlight />
            <Result label="Biaya per Km" value={`${formatRp(result.costPerKm)}/km`} highlight />
          </Section>
        </div>
      </div>
    </div>
  );
}

// ==== Komponen kecil (Tetap sama) ====

function Section({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, name, value, onChange, info }) {
  // Tentukan apakah input perlu prefix mata uang
  const isCurrency = ['hargaTruk', 'nilaiSisa', 'uangMuka', 'kirPajak', 'asuransi', 'gajiSupir', 'perawatan', 'ban'].includes(name);

  return (
    <div>
      <label className="font-medium text-sm text-gray-700 flex items-center gap-1">
        {label} <Info className="w-4 h-4 text-gray-400" title={info} />
      </label>
      
      <NumericFormat
        name={name}
        value={value ?? ''}
        
        // --- Konfigurasi Formatting ---
        thousandSeparator="."
        decimalSeparator=","
        prefix={isCurrency ? 'Rp ' : ''} // Tambahkan prefix Rp berdasarkan isCurrency
        suffix={name === 'bungaKredit' ? ' %' : (name === 'rasioBBM' ? ' Km/L' : (name === 'jarakTahunan' ? ' Km' : ''))} // Tambahkan suffix untuk persentase, KM/L, atau KM
        allowNegative={false}
        decimalScale={name === 'bungaKredit' || name === 'rasioBBM' ? 2 : 0} // Izinkan desimal untuk Bunga dan Rasio BBM
        
        // --- Integrasi Handler ---
        onValueChange={(values) => {
          onChange({ 
            target: { 
              name: name,
              value: values.floatValue ?? 0 
            } 
          });
        }}
        
        className="w-full border rounded-lg p-2 mt-1 text-sm"
      />
    </div>
  );
}

function Result({ label, value, highlight }) {
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