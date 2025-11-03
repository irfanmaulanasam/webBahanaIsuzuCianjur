import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { IsuzuPrices, getUniqueTypes } from "../data/isuzuPrices";
import { LeasingData } from "../data/LeasingData";

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);

const hitungAngsuran = (otrNumber, dp, tenor, bunga) => {
  const loanAmount = otrNumber - dp;
  const totalBunga = loanAmount * bunga * (tenor / 12);
  return (loanAmount + totalBunga) / tenor;
};

export default function SimulasiKredit() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [otrPrice, setOtrPrice] = useState(0);
  const [dpRp, setDpRp] = useState(70000000);
  const [dpPercent, setDpPercent] = useState(20);

  const uniqueTypes = getUniqueTypes();

  const filteredModels = Object.values(IsuzuPrices).flat().filter((item) => item.type === selectedType);

  // Update OTR saat model dipilih
  useEffect(() => {
    const modelData = filteredModels.find((item) => item.model === selectedModel);
    if (modelData){
      setOtrPrice(Number(modelData.price));
    } 
    else setOtrPrice(0);
  }, [selectedModel, filteredModels]);

  // Update DP Rp saat persen berubah
  useEffect(() => {
    setDpRp(Math.round((dpPercent / 100) * otrPrice));
  }, [dpPercent, otrPrice]);

  const formattedOtr = formatRupiah(otrPrice);

  return (
    <div className="flex justify-center p-8 bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-6xl flex shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">

        {/* Form Input */}
        <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white mb-6">Simulasi Kredit Mobil Baru</h2>

          {/* Merek */}
          <label className="block mb-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">Merek</span>
            <input
              type="text"
              value="ISUZU"
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300 font-semibold text-center"
            />
          </label>

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
              <option value="" disabled>Pilih Segmen</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
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
              <option value="" disabled>Pilih Model</option>
              {filteredModels.map((item) => (
                <option key={item.model} value={item.model}>{item.model}</option>
              ))}
            </select>
          </label>

          {/* Harga OTR */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Harga OTR</span>
            <p className="font-bold text-lg text-isuzu dark:text-isuzu-dark">{formattedOtr}</p>
          </div>

          {/* Uang Muka */}
          <div className="flex space-x-4 mb-4">
            <label className="block w-1/2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Uang Muka (Rp)</span>
              <NumericFormat
                value={dpRp}
                thousandSeparator="."
                decimalSeparator=","   // tambahkan ini
                prefix="Rp "
                onValueChange={(values) => setDpRp(values.floatValue || 0)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                />
            </label>

            <label className="block w-1/2">
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

        {/* Hasil Simulasi */}
        <div className="w-full w-1/2 p-6">
          <h2 className="text-xl font-semibold dark:text-white mb-6">Hasil Simulasi Cicilan</h2>
          {LeasingData.map((leasing) => (
            <div key={leasing.name} className="mb-4">
              <h3 className="font-semibold dark:text-white">{leasing.name}</h3>
              {leasing.tenor.map((tenor) => {
                const cicilan = hitungAngsuran(otrPrice, dpRp, tenor, leasing.rate);
                return (
                  <div key={tenor} className="flex justify-between p-2 border-b dark:border-gray-700">
                    <span>{tenor} bulan</span>
                    <span>{formatRupiah(cicilan)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import { IsuzuPrices, getUniqueTypes } from "../data/isuzuPrices";
// import { LeasingData } from "../data/LeasingData";
// import { useSearchParams } from "react-router-dom";

// const formatRupiah = (number) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(number);

// const hitungAngsuran = (otr, dp, tenor, bunga) => {
//   const loanAmount = otr - dp;
//   const totalBunga = loanAmount * bunga * (tenor / 12);
//   return Math.round((loanAmount + totalBunga) / tenor);
// };

// export default function SimulasiKredit() {
//   const [searchParams] = useSearchParams();
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [otrPrice, setOtrPrice] = useState(0);
//   const [dpPercent] = useState(20);
//   const [dpRp, setDpRp] = useState(0);

//   const uniqueTypes = getUniqueTypes();

//   const filteredModels = Object.values(IsuzuPrices)
//     .flat()
//     .filter((item) => item.type === selectedType);

//   // Ambil default model dari URL
//   useEffect(() => {
//     const modelFromUrl = searchParams.get("model") || "Traga Pick Up (FD)";
//     const found = Object.values(IsuzuPrices)
//       .flat()
//       .find((item) => item.model.toLowerCase().includes(modelFromUrl.toLowerCase()));
//     if (found) {
//       console.log(found)
//       setSelectedType(found.type);
//       setOtrPrice(found.price);
//       setSelectedModel(found.model);
//     }
//   }, [searchParams]);

//   // Update DP otomatis
//   useEffect(() => {
//     setDpRp(Math.round((dpPercent / 100) * otrPrice));
//   }, [dpPercent, otrPrice]);

//   const formattedOtr = formatRupiah(otrPrice);
//   const formattedDp = formatRupiah(dpRp);

//   return (
//     <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
//       <div className="max-w-6xl mx-auto flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">
//         {/* Form Input */}
//         <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold mb-4 dark:text-white">Simulasi Kredit Mobil Baru</h2>

//           {/* Merek */}
//           <div className="mb-4">
//             <label className="block text-sm text-gray-700 dark:text-gray-300">Merek</label>
//             <input
//               type="text"
//               value="ISUZU"
//               disabled
//               className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
//             />
//           </div>

//           {/* Tipe */}
//           <div className="mb-4">
//             <label className="block text-sm text-gray-700 dark:text-gray-300">Tipe</label>
//             <select
//               value={selectedType}
//               onChange={(e) => {
//                 setSelectedType(e.target.value);
//                 setSelectedModel("");
//               }}
//               className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
//             >
//               <option value="" disabled>Pilih Tipe</option>
//               {uniqueTypes.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           {/* Model */}
//           <div className="mb-4">
//             <label className="block text-sm text-gray-700 dark:text-gray-300">Model</label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               disabled={!selectedType}
//               className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
//             >
//               <option value="" disabled>Pilih Model</option>
//               {filteredModels.map((item) => (
//                 <option key={item.model} value={item.model}>{item.model}</option>
//               ))}
//             </select>
//           </div>

//           {/* Harga OTR */}
//           <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
//             <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Harga OTR</span>
//             <p className="font-bold text-lg text-isuzu dark:text-isuzu-dark">{formattedOtr}</p>
//           </div>

//           {/* DP otomatis */}
//           <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
//             <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Uang Muka ({dpPercent}%)</span>
//             <p className="font-bold text-lg text-isuzu dark:text-isuzu-dark">{formattedDp}</p>
//           </div>
//         </div>

//         {/* Hasil Simulasi */}
//         <div className="w-full lg:w-1/2 p-6">
//           <h2 className="text-xl font-semibold mb-4 dark:text-white">Hasil Simulasi Cicilan</h2>

//           {selectedModel ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
//                 <thead className="bg-gray-100 dark:bg-gray-800">
//                   <tr>
//                     <th className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">Leasing</th>
//                     <th className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">Tenor (bulan)</th>
//                     <th className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">Cicilan/bln</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {LeasingData.map((leasing) =>
//                     leasing.tenor.map((t) => (
//                       <tr key={`${leasing.name}-${t}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                         <td className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">{leasing.name}</td>
//                         <td className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">{t}</td>
//                         <td className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">
//                           {formatRupiah(hitungAngsuran(otrPrice, dpRp, t, leasing.rate))}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500 dark:text-gray-400">Pilih model untuk melihat simulasi cicilan.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }