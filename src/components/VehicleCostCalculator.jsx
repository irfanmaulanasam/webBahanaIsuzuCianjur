// VehicleCostCalculator.jsx
import { useMemo, useState } from "react";

/**
 * VehicleCostCalculator
 * - Tailwind classes used (pastikan Tailwind sudah ter-setup)
 * - Paste component ini ke project React, lalu import dan render <VehicleCostCalculator />
 *
 * UX:
 * - Two modes: Full Form (all inputs visible) and Presentation (stepper view)
 * - Real-time computed results on the right / under the form
 * - Print button to export the current view (useful for client handouts)
 */

/* ---------- Helpers ---------- */
const fmt = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? n.toLocaleString("id-ID", { maximumFractionDigits: 0 })
    : "";
const parseNumber = (v) => {
  if (v === "" || v == null) return 0;
  // remove non-digit (except dot/comma), handle Indonesian format
  const cleaned = String(v).replace(/[^\d.-]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};

export default function VehicleCostCalculator() {
  const [mode, setMode] = useState("presentation"); // "presentation" | "full"
  const [step, setStep] = useState(0);

  // default values inspired by screenshot
  const [values, setValues] = useState({
    // Kendaraan
    hargaKendaraan: 300000000,
    jarakPerTahun: 50000,

    // Harga / Umur / Nilai sisa
    umurPakai: 5,
    nilaiSisa: 200000000,

    // Fixed costs annual / monthly
    bungaKreditPct: 8,
    gajiSupirPerBulan: 3000000,
    kirPajakPerTahun: 10000000,
    asuransiPerTahun: 10000000,
    biayaGPSPerBulan: 150000,
    biayaLainPerBulan: 2000000,

    // Variable
    hargaSolarPerLiter: 5500,
    rasioKmPerLiter: 3, // km per liter
    biayaPerawatanPerTahun: 20000000,
    biayaBanPerTahun: 10000000,
  });

  const update = (name, raw) => {
    const v = parseNumber(raw);
    setValues((s) => ({ ...s, [name]: v }));
  };

  // ---------- Calculation logic ----------
  const calc = useMemo(() => {
    const v = values;
    // 1) Penyusutan per tahun = (harga - nilai sisa) / umur
    const penyusutan =
      v.umurPakai > 0 ? (v.hargaKendaraan - v.nilaiSisa) / v.umurPakai : 0;

    // 2) Bunga per tahun (jika ada kredit) = hargaKendaraan * bungaPct / 100
    const bunga = (v.hargaKendaraan * v.bungaKreditPct) / 100;

    // 3) Gaji supir, gps, biaya lain -> monthly to annual
    const gajiSupirAnnual = v.gajiSupirPerBulan * 12;
    const gpsAnnual = v.biayaGPSPerBulan * 12;
    const biayaLainAnnual = v.biayaLainPerBulan * 12;

    // 4) Fixed cost per year: penyusutan + bunga + kir/pajak + asuransi + personnel/ops (gaji/gps/lain)
    const fixedCostPerYear =
      penyusutan +
      bunga +
      v.kirPajakPerTahun +
      v.asuransiPerTahun +
      gajiSupirAnnual +
      gpsAnnual +
      biayaLainAnnual;

    // 5) Fuel consumption: liters per year = jarakPerTahun / rasioKmPerLiter
    const litersPerYear =
      v.rasioKmPerLiter > 0 ? v.jarakPerTahun / v.rasioKmPerLiter : 0;
    const fuelCostPerYear = litersPerYear * v.hargaSolarPerLiter;

    // 6) Variable cost per year
    const variableCostPerYear =
      fuelCostPerYear + v.biayaPerawatanPerTahun + v.biayaBanPerTahun;

    // 7) Totals
    const totalPerYear = fixedCostPerYear + variableCostPerYear;
    const costPerKm = v.jarakPerTahun > 0 ? totalPerYear / v.jarakPerTahun : 0;

    // 8) Breakdown percentages
    const pctFixed = totalPerYear > 0 ? (fixedCostPerYear / totalPerYear) * 100 : 0;
    const pctVariable = totalPerYear > 0 ? (variableCostPerYear / totalPerYear) * 100 : 0;

    return {
      penyusutan,
      bunga,
      gajiSupirAnnual,
      gpsAnnual,
      biayaLainAnnual,
      fixedCostPerYear,
      litersPerYear,
      fuelCostPerYear,
      variableCostPerYear,
      totalPerYear,
      costPerKm,
      pctFixed,
      pctVariable,
    };
  }, [values]);

  // Presentation steps (for client demo)
  const steps = [
    { id: 0, title: "Kendaraan & Operasional", fields: ["hargaKendaraan", "jarakPerTahun"] },
    { id: 1, title: "Harga & Umur", fields: ["umurPakai", "nilaiSisa"] },
    {
      id: 2,
      title: "Fixed Cost per Tahun",
      fields: [
        "bungaKreditPct",
        "gajiSupirPerBulan",
        "kirPajakPerTahun",
        "asuransiPerTahun",
        "biayaGPSPerBulan",
        "biayaLainPerBulan",
      ],
    },
    {
      id: 3,
      title: "Variable Cost per Tahun",
      fields: [
        "hargaSolarPerLiter",
        "rasioKmPerLiter",
        "biayaPerawatanPerTahun",
        "biayaBanPerTahun",
      ],
    },
    { id: 4, title: "Hasil & Rekomendasi", fields: [] },
  ];

  // ---------- UI ----------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Simulasi Biaya Operasional Kendaraan</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode((m) => (m === "presentation" ? "full" : "presentation"))}
            className="px-3 py-1 rounded border text-sm"
          >
            Mode: {mode === "presentation" ? "Presentation" : "Full Form"}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
          >
            Print / Export
          </button>
        </div>
      </div>

      {/* Container: Left form / Right results */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT: Form / Steps */}
        <div className="md:col-span-2 space-y-4">
          {/* Stepper bar for presentation mode */}
          {mode === "presentation" && (
            <div className="flex items-center gap-2 mb-2">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    i === step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {i + 1}. {s.title}
                </button>
              ))}
            </div>
          )}

          {/* Render fields depending on mode / step */}
          <div className="bg-white p-4 rounded shadow-sm">
            {/* If full mode, show all groups */}
            {mode === "full" ? (
              <>
                <Section
                  title="Kendaraan"
                  childrenContent={
                    <>
                      <NumberField
                        label="Harga Kendaraan (Rp)"
                        value={values.hargaKendaraan}
                        onChange={(v) => update("hargaKendaraan", v)}
                      />
                      <NumberField
                        label="Operasional Kendaraan (Km / Tahun)"
                        value={values.jarakPerTahun}
                        onChange={(v) => update("jarakPerTahun", v)}
                      />
                    </>
                  }
                />

                <Section
                  title="Harga Kendaraan"
                  childrenContent={
                    <>
                      <NumberField
                        label="Umur Pakai (Tahun)"
                        value={values.umurPakai}
                        onChange={(v) => update("umurPakai", v)}
                      />
                      <NumberField
                        label="Nilai Sisa (Rp)"
                        value={values.nilaiSisa}
                        onChange={(v) => update("nilaiSisa", v)}
                      />
                    </>
                  }
                />

                <Section
                  title="Fixed Cost per Tahun"
                  childrenContent={
                    <>
                      <NumberField
                        label="Bunga Kredit per Tahun (%)"
                        value={values.bungaKreditPct}
                        onChange={(v) => update("bungaKreditPct", v)}
                      />
                      <NumberField
                        label="Gaji Supir per Bulan (Rp)"
                        value={values.gajiSupirPerBulan}
                        onChange={(v) => update("gajiSupirPerBulan", v)}
                      />
                      <NumberField
                        label="KIR & Pajak per Tahun (Rp)"
                        value={values.kirPajakPerTahun}
                        onChange={(v) => update("kirPajakPerTahun", v)}
                      />
                      <NumberField
                        label="Asuransi per Tahun (Rp)"
                        value={values.asuransiPerTahun}
                        onChange={(v) => update("asuransiPerTahun", v)}
                      />
                      <NumberField
                        label="Biaya GPS per Bulan (Rp)"
                        value={values.biayaGPSPerBulan}
                        onChange={(v) => update("biayaGPSPerBulan", v)}
                      />
                      <NumberField
                        label="Biaya Lain per Bulan (Rp)"
                        value={values.biayaLainPerBulan}
                        onChange={(v) => update("biayaLainPerBulan", v)}
                      />
                    </>
                  }
                />

                <Section
                  title="Variable Cost per Tahun"
                  childrenContent={
                    <>
                      <NumberField
                        label="Harga Solar per Liter (Rp)"
                        value={values.hargaSolarPerLiter}
                        onChange={(v) => update("hargaSolarPerLiter", v)}
                      />
                      <NumberField
                        label="Rasio Konsumsi (Km per Liter)"
                        value={values.rasioKmPerLiter}
                        onChange={(v) => update("rasioKmPerLiter", v)}
                      />
                      <NumberField
                        label="Biaya Perawatan per Tahun (Rp)"
                        value={values.biayaPerawatanPerTahun}
                        onChange={(v) => update("biayaPerawatanPerTahun", v)}
                      />
                      <NumberField
                        label="Biaya Ban per Tahun (Rp)"
                        value={values.biayaBanPerTahun}
                        onChange={(v) => update("biayaBanPerTahun", v)}
                      />
                    </>
                  }
                />
              </>
            ) : (
              // Presentation mode: show only step's fields + explanation
              <>
                <h3 className="text-lg font-semibold mb-2">{steps[step].title}</h3>
                <div className="space-y-3">
                  {/* map fields in this step */}
                  {steps[step].fields.length === 0 && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Di sini akan ditampilkan hasil ringkasan dan rekomendasi setelah semua input terisi.
                      </p>
                    </div>
                  )}
                  {steps[step].fields.map((f) => (
                    <div key={f}>
                      <LabelledInput
                        name={f}
                        values={values}
                        update={update}
                      />
                    </div>
                  ))}

                  {/* navigation */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                    >
                      Prev
                    </button>
                    {step < steps.length - 1 ? (
                      <button
                        onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          // go to result "slide" or just focus
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                      >
                        Show Results
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Results summary */}
        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Hasil Perhitungan (Tahunan)</h3>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Penyusutan / Tahun</span>
                <strong>Rp {fmt(calc.penyusutan)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Bunga Kredit / Tahun</span>
                <strong>Rp {fmt(calc.bunga)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Gaji Supir (annual)</span>
                <strong>Rp {fmt(calc.gajiSupirAnnual)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Operasional Lain (GPS + Lain)</span>
                <strong>Rp {fmt(calc.gpsAnnual + calc.biayaLainAnnual)}</strong>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between">
                <span>Fixed Cost / Tahun</span>
                <strong>Rp {fmt(calc.fixedCostPerYear)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Fuel (liter / tahun)</span>
                <strong>{fmt(calc.litersPerYear)} L</strong>
              </div>
              <div className="flex justify-between">
                <span>Fuel Cost / Tahun</span>
                <strong>Rp {fmt(calc.fuelCostPerYear)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Variable Cost / Tahun</span>
                <strong>Rp {fmt(calc.variableCostPerYear)}</strong>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between">
                <span className="text-lg">Total Cost / Tahun</span>
                <strong className="text-lg">Rp {fmt(calc.totalPerYear)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Biaya per Km</span>
                <strong>Rp {fmt(calc.costPerKm)}</strong>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">Komposisi</div>
                <div className="w-full bg-gray-100 rounded h-3 overflow-hidden">
                  <div
                    className="h-3 bg-blue-600"
                    style={{ width: `${calc.pctFixed}%` }}
                    title={`Fixed: ${calc.pctFixed.toFixed(1)}%`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{calc.pctFixed.toFixed(1)}% fixed • {calc.pctVariable.toFixed(1)}% variable</div>
              </div>
            </div>
          </div>

          {/* Tips / Explanation */}
          <div className="bg-white p-4 rounded shadow-sm text-sm text-gray-700">
            <h4 className="font-semibold mb-2">Penjelasan Singkat</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Penyusutan: (Harga - Nilai Sisa) / Umur pakai.</li>
              <li>Bunga: persentase dari harga kendaraan jika ada kredit.</li>
              <li>Fixed cost = penyusutan + bunga + pajak + asuransi + gaji & biaya operasional.</li>
              <li>Variable cost: bahan bakar + perawatan + ban — tergantung jarak tempuh.</li>
              <li>Biaya per km = (total cost per tahun) / (jarak per tahun).</li>
            </ul>
          </div>

          {/* Quick actions */}
          <div className="bg-white p-4 rounded shadow-sm flex gap-2">
            <button
              onClick={() => {
                // quick recommendation example
                alert(
                  `Rekomendasi singkat:\n- Pertimbangkan efisiensi bahan bakar (rasio) untuk mengurangi biaya variable.\n- Periksa opsi pembiayaan untuk menurunkan bunga.`
                );
              }}
              className="flex-1 px-3 py-1 rounded border text-sm"
            >
              Rekomendasi
            </button>

            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  `Total Cost / Tahun: Rp ${fmt(calc.totalPerYear)} • Biaya per Km: Rp ${fmt(calc.costPerKm)}`
                )
              }
              className="px-3 py-1 rounded bg-gray-100 text-sm"
            >
              Copy Ringkasan
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Section({ title, childrenContent }) {
  return (
    <section className="mb-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="grid md:grid-cols-2 gap-3">{childrenContent}</div>
    </section>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 border rounded bg-gray-50">
      <div className="flex-1">
        <div className="text-sm text-gray-600">{label}</div>
        <input
          type="text"
          className="w-full bg-transparent outline-none text-base"
          value={fmt(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="text-sm text-gray-500">Rp</div>
    </label>
  );
}

/* Small helper to render appropriate input per field name in presentation mode */
function LabelledInput({ name, values, update }) {
  const labelMap = {
    hargaKendaraan: "Harga Kendaraan (Rp)",
    jarakPerTahun: "Operasional Kendaraan (Km / Tahun)",
    umurPakai: "Umur Pakai (Tahun)",
    nilaiSisa: "Nilai Sisa (Rp)",
    bungaKreditPct: "Bunga Kredit per Tahun (%)",
    gajiSupirPerBulan: "Gaji Supir per Bulan (Rp)",
    kirPajakPerTahun: "KIR & Pajak per Tahun (Rp)",
    asuransiPerTahun: "Asuransi per Tahun (Rp)",
    biayaGPSPerBulan: "Biaya GPS per Bulan (Rp)",
    biayaLainPerBulan: "Biaya Lain per Bulan (Rp)",
    hargaSolarPerLiter: "Harga Solar per Liter (Rp)",
    rasioKmPerLiter: "Rasio Konsumsi (Km per Liter)",
    biayaPerawatanPerTahun: "Biaya Perawatan per Tahun (Rp)",
    biayaBanPerTahun: "Biaya Ban per Tahun (Rp)",
  };
  const val = values[name];

  // percentage field shows % suffix
  const isPct = name === "bungaKreditPct";
  const suffix = isPct ? "%" : name.includes("Km") ? "" : "Rp";

  return (
    <div className="p-3 border rounded bg-gray-50">
      <div className="text-sm text-gray-600 mb-1">{labelMap[name] || name}</div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-white px-3 py-2 rounded outline-none"
          value={isPct ? String(val) : val === 0 ? "" : val.toLocaleString("id-ID")}
          onChange={(e) => update(name, e.target.value)}
        />
        <div className="text-sm text-gray-500">{isPct ? "%" : ""}</div>
      </div>
    </div>
  );
}
