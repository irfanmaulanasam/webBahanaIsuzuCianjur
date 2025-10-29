import React, { useState } from "react";

export default function CreditSimulator() {
  
  const [harga, setHarga] = useState(350000000);
  const [dp, setDp] = useState(30);
  const [tenor, setTenor] = useState(48);

  const bunga = 0.06;
  const totalPinjaman = harga - (harga * dp) / 100;
  const cicilan =
    (totalPinjaman * (1 + bunga * (tenor / 12))) / tenor;
  
  

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
      <div className="flex justify-between">
        <label>Harga Kendaraan:</label>
        <input
          type="number"
          value={harga}
          onChange={(e) => setHarga(Number(e.target.value))}
          className="border rounded px-2 w-32"
        />
      </div>

      <div className="flex justify-between">
        <label>DP (%):</label>
        <input
          type="number"
          value={dp}
          onChange={(e) => setDp(Number(e.target.value))}
          className="border rounded px-2 w-20"
        />
      </div>

      <div className="flex justify-between">
        <label>Tenor (bulan):</label>
        <input
          type="number"
          value={tenor}
          onChange={(e) => setTenor(Number(e.target.value))}
          className="border rounded px-2 w-20"
        />
      </div>

      <div className="pt-3 border-t">
        <p className="font-semibold text-gray-800">
          Estimasi Cicilan: Rp {Math.round(cicilan).toLocaleString("id-ID")} /bulan
        </p>
      </div>
    </div>
  );
}
