import  { useState, useMemo,useEffect } from "react";
import { Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { specs, allSpecSlugs } from "../data/specs";

export default function VehicleCostCalculator() {
  const {slug} = useParams()
  console.log("slug>>>",slug)
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!slug) return;
    
  //   const autoCompleteSlug = (shortSlug) => {
  //     if (shortSlug==="blindvan") {
  //       shortSlug = "traga-blind-van"
  //     }
  //     const prefixMap = {
  //       "nmr": "elf-",
  //       "nlr": "elf-", 
  //       "nps": "elf-",
  //       "nqr": "elf-",
  //       "dmax": "", // sudah lengkap
  //       "traga": "",
  //       "blind-van":"traga-",
  //       "box":"traga-",
  //       "mu-x": "",
  //       "giga": "",
  //       "elf": "" // sudah lengkap
  //     };
      
  //     // Cari prefix yang cocok
  //     for (const [key, prefix] of Object.entries(prefixMap)) {
  //       if (shortSlug.startsWith(key) || shortSlug === key.replace('-', '')) {
  //         return prefix + shortSlug;
  //       }
  //     }
      
  //     return shortSlug; // return as-is jika tidak ada match
  //   };
  
  //   const actualSlug = autoCompleteSlug(slug);
  //   const found = specs[actualSlug];  
  // console.log(`Slug: ${slug} → ${actualSlug}, Found:`, !!found);

  //   navigate(`/${actualSlug}`, { replace: true });
  //   if (found) {
  //     setData(found);
  //   } else {
  //     // Fallback: cari slug yang mengandung keyword
  //     const fallbackSlug = allSpecSlugs.find(s => s.includes(slug)) || allSpecSlugs[0];
  //     console.log(`Fallback to: ${fallbackSlug}`);
  //     navigate(`/${fallbackSlug}`, { replace: true });
  //   }
  // }, [slug, navigate]);

  const [data, setData] = useState({
    hargaTruk: 300000000,
    umurPakai: 5,
    nilaiSisa: 100000000,
    bungaKredit: 8,
    kirPajak: 10000000,
    asuransi: 8000000,
    gajiSupir: 3000000,
    hargaSolar: 5500,
    rasioBBM: 3,
    jarakTahunan: 50000,
    perawatan: 20000000,
    ban: 10000000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: Number(value) });
  };

  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

  // ====== PERHITUNGAN ======
  const result = useMemo(() => {
    const penyusutan =
      (data.hargaTruk - data.nilaiSisa) / data.umurPakai;
    const bunga = (data.hargaTruk * (data.bungaKredit / 100));
    const fixedCost = penyusutan + bunga + data.kirPajak + data.asuransi + data.gajiSupir * 12;
    const konsumsiBBM = data.jarakTahunan / data.rasioBBM;
    const biayaBBM = konsumsiBBM * data.hargaSolar;
    const variableCost = biayaBBM + data.perawatan + data.ban;
    const totalCost = fixedCost + variableCost;
    const costPerKm = totalCost / data.jarakTahunan;

    return { penyusutan, bunga, fixedCost, variableCost, totalCost, costPerKm };
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-center">Vehicle Cost Calculator</h1>
      <span className="text-center text-gray-600">
        Simulasi interaktif untuk menghitung biaya kendaraan komersial per tahun dan per kilometer.
      </span>
      <p></p>
      {/* === FORM === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bagian kiri */}
        <div className="space-y-6">
          <Section title="Harga & Finansial">
            <Input
              label="Harga Truk + Aplikasi"
              name="hargaTruk"
              value={data.hargaTruk}
              onChange={handleChange}
              info="Harga total kendaraan beserta perlengkapan tambahan seperti box atau GPS."
            />
            <Input
              label="Umur Pakai (tahun)"
              name="umurPakai"
              value={data.umurPakai}
              onChange={handleChange}
              info="Estimasi umur ekonomis kendaraan sebelum diganti."
            />
            <Input
              label="Nilai Sisa"
              name="nilaiSisa"
              value={data.nilaiSisa}
              onChange={handleChange}
              info="Nilai jual kembali kendaraan di akhir umur pakai."
            />
            <Input
              label="Bunga Kredit (%)"
              name="bungaKredit"
              value={data.bungaKredit}
              onChange={handleChange}
              info="Persentase bunga tahunan jika pembelian menggunakan kredit."
            />
          </Section>

          <Section title="Biaya Tetap">
            <Input
              label="KIR & Pajak / Tahun"
              name="kirPajak"
              value={data.kirPajak}
              onChange={handleChange}
              info="Biaya tahunan seperti KIR, pajak, dan administrasi kendaraan."
            />
            <span className="text-sm text-gray-500 mt-1">
                Biaya tahunan seperti KIR, pajak, dan administrasi kendaraan
            </span>
            <Input
              label="Asuransi / Tahun"
              name="asuransi"
              value={data.asuransi}
              onChange={handleChange}
              info="Premi tahunan asuransi kendaraan."
            />
            <span className="text-sm text-gray-500 mt-1">
                Premi tahunan asuransi kendaraan
            </span>
            <Input
              label="Gaji Supir / Bulan"
              name="gajiSupir"
              value={data.gajiSupir}
              onChange={handleChange}
              info="Total gaji bulanan untuk pengemudi."
            />
            <span className="text-sm text-gray-500 mt-1">
                Total gaji bulanan untuk pengemudi
            </span>
          </Section>
        </div>

        {/* Bagian kanan */}
        <div className="space-y-6">
          <Section title="Biaya Variabel">
            <Input
              label="Harga Solar per Liter"
              name="hargaSolar"
              value={data.hargaSolar}
              onChange={handleChange}
              info="Harga bahan bakar diesel yang digunakan."
            />
            <span className="text-sm text-gray-500 mt-1">
               Harga bahan bakar diesel yang digunakan
            </span>
            <Input
              label="Rasio Konsumsi BBM (Km/L)"
              name="rasioBBM"
              value={data.rasioBBM}
              onChange={handleChange}
              info="Berapa kilometer yang bisa ditempuh tiap 1 liter solar."
            />
            <span className="text-sm text-gray-500 mt-1">
               Berapa kilometer yang bisa ditempuh tiap 1 liter solar.
            </span>
            <Input
              label="Jarak Tempuh per Tahun (Km)"
              name="jarakTahunan"
              value={data.jarakTahunan}
              onChange={handleChange}
              info="Perkiraan total jarak yang ditempuh kendaraan dalam setahun."
            />
            <span className="text-sm text-gray-500 mt-1">
                Perkiraan total jarak yang ditempuh kendaraan dalam setahun.
            </span>
            <Input
              label="Perawatan / Tahun"
              name="perawatan"
              value={data.perawatan}
              onChange={handleChange}
              info="Biaya servis rutin, oli, dan spare part."
            />
            <span className="text-sm text-gray-500 mt-1">
                Biaya servis rutin, oli, dan spare part.
            </span>
            <Input
              label="Ban / Tahun"
              name="ban"
              value={data.ban}
              onChange={handleChange}
              info="Rata-rata biaya penggantian ban tahunan."
            />
            <span className="text-sm text-gray-500 mt-1">
                Rata-rata biaya penggantian ban tahunan
            </span>
          </Section>

          {/* HASIL PERHITUNGAN */}
          <Section title="Hasil Perhitungan">
            <Result label="Penyusutan per Tahun" value={formatRp(result.penyusutan)} />
            <Result label="Bunga Kredit per Tahun" value={formatRp(result.bunga)} />
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

// ==== Komponen kecil ====

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
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2 mt-1 text-sm"
      />
    </div>
  );
}

function Result({ label, value, highlight }) {
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
