import { useState, useMemo, useEffect } from "react";
import { NumericFormat } from "react-number-format";
// Asumsi path dan struktur data ini sudah benar
import { IsuzuPrices, getUniqueTypes } from "../data/isuzuPrices"; 
import { LeasingData } from "../data/LeasingData"; 

// Fungsi utilitas format
const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

// Fungsi perhitungan (Asumsi: Flat Rate seperti kode Anda, tapi dibuat lebih aman)
const hitungAngsuran = (otrNumber, dp, tenor, bunga) => {
  if (otrNumber <= 0 || tenor <= 0) return 0;

  const loanAmount = otrNumber - dp;
  // Perhitungan Bunga (Flat Rate Tahunan)
  // Catatan: 'bunga' di sini diasumsikan sebagai persentase desimal (misal 0.08 untuk 8%)
  const totalBunga = loanAmount * bunga * (tenor / 12); 
  
  return (loanAmount + totalBunga) / tenor; // Angsuran Bulanan
};


export default function SimulasiKredit() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [otrPrice, setOtrPrice] = useState(0);
  const [dpRp, setDpRp] = useState(70000000);
  const [dpPercent, setDpPercent] = useState(20);

  const uniqueTypes = getUniqueTypes();

  const filteredModels = Object.values(IsuzuPrices)
    .flat()
    .filter((item) => item.type === selectedType);

  // --- EFFECT UNTUK HARGA OTR ---
  useEffect(() => {
    const modelData = filteredModels.find(
      (item) => item.model === selectedModel
    );
    if (modelData) setOtrPrice(Number(modelData.price));
    else setOtrPrice(0);
  }, [selectedModel, filteredModels]);

  // --- EFFECT UNTUK DP (Percent ke Rupiah) ---
  useEffect(() => {
    // Pastikan otrPrice > 0 sebelum menghitung DP Rupiah
    if (otrPrice > 0) {
        setDpRp(Math.round((dpPercent / 100) * otrPrice));
    } else {
        setDpRp(0);
    }
  }, [dpPercent, otrPrice]);

  
  // --- USEMEMO UNTUK SEMUA HASIL PERHITUNGAN DAN VALIDASI ---
  const simulationResults = useMemo(() => {
    
    // 1. VALIDASI KESIAPAN DATA
    const isReady = otrPrice > 0 && dpRp > 0 && selectedModel !== "";
    
    if (!isReady) {
        return { isReady: false, formattedOtr: formatRupiah(otrPrice), results: [] };
    }
    
    // 2. JIKA SIAP, LAKUKAN PERHITUNGAN
    
    // Hasil dihitung untuk setiap leasing dan tenor
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
    
  }, [otrPrice, dpRp, selectedModel]); // Dependensi: hanya state input yang relevan

  return (
    <div className="flex justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">

        {/* Form Input */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-6 text-center lg:text-left">
            Simulasi Kredit Mobil Baru
          </h2>

          {/* Tipe */}
          <label className="block mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">Segmen</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedModel("");
              }}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="" disabled>
                Pilih Segmen
              </option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          {/* Model */}
          <label className="block mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">Model</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedType}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="" disabled>
                Pilih Model
              </option>
              {filteredModels.map((item) => (
                <option key={item.model} value={item.model}>
                  {item.model}
                </option>
              ))}
            </select>
          </label>

          {/* Harga OTR (Menggunakan hasil dari useMemo) */}
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
            Hasil Simulasi Cicilan
          </h2>
          
          {simulationResults.isReady ? (
            // --- KONTEN HASIL (Mapping data dari useMemo) ---
            <>
              {simulationResults.results.map((leasing) => (
                <div key={leasing.name} className="mb-6">
                  <h3 className="font-semibold dark:text-white text-center lg:text-left">
                    {leasing.surname}
                  </h3>
                  <span className="text-xs text-gray-400">{leasing.name}</span>
                  {leasing.tenorData.map((data) => (
                    <div
                      key={data.tenor}
                      className="flex justify-between p-2 border-b text-sm sm:text-base dark:border-gray-700"
                    >
                      <span>{data.tenor} bulan</span>
                      <span className="font-semibold">{data.formattedCicilan}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            // --- KONTEN PESAN (jika belum siap) ---
            <div className="flex items-center justify-center min-h-[300px] p-8 text-center bg-gray-50 rounded-lg dark:bg-gray-800">
                <p className="font-medium text-gray-600 dark:text-gray-400">
                    Mohon **Pilih Segmen** dan **Model** kendaraan, serta pastikan **Harga OTR** dan **Uang Muka** sudah terisi untuk menampilkan simulasi kredit.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}