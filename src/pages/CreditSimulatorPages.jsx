import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { IsuzuPrices, getUniqueTypes } from "../data/isuzuPrices";
import { LeasingData } from "../data/LeasingData";

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

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

  const filteredModels = Object.values(IsuzuPrices)
    .flat()
    .filter((item) => item.type === selectedType);

  useEffect(() => {
    const modelData = filteredModels.find(
      (item) => item.model === selectedModel
    );
    if (modelData) setOtrPrice(Number(modelData.price));
    else setOtrPrice(0);
  }, [selectedModel, filteredModels]);

  useEffect(() => {
    setDpRp(Math.round((dpPercent / 100) * otrPrice));
  }, [dpPercent, otrPrice]);

  const formattedOtr = formatRupiah(otrPrice);

  return (
    <div className="flex justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">

        {/* Form Input */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-6 text-center lg:text-left">
            Simulasi Kredit Mobil Baru
          </h2>

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

          {/* Harga OTR */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Harga OTR</span>
            <p className="font-bold text-lg text-isuzu dark:text-isuzu-dark">
              {formattedOtr}
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

        {/* Hasil Simulasi */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-6 text-center lg:text-left">
            Hasil Simulasi Cicilan
          </h2>
          {LeasingData.map((leasing) => (
            <div key={leasing.name} className="mb-6">
              <h3 className="font-semibold dark:text-white text-center lg:text-left">
                {leasing.name}
              </h3>
              {leasing.tenor.map((tenor) => {
                const cicilan = hitungAngsuran(otrPrice, dpRp, tenor, leasing.rate);
                return (
                  <div
                    key={tenor}
                    className="flex justify-between p-2 border-b text-sm sm:text-base dark:border-gray-700"
                  >
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