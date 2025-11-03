// src/data/specs.js
export const specs = {
  "traga-non-blower": {
    slug: "traga-non-blower",
    title: "TRAGA — CHASSIS NON BLOWER",
    subtitle: "Spesifikasi Teknis",
    sections: [
      {
        label: "DIMENSI / DIMENSION",
        items: [
          { name: "Overall Length", value: "4,520 mm" },
          { name: "Overall Width", value: "1,705 mm" },
          { name: "Overall Height", value: "1,985 mm" },
          { name: "Wheelbase", value: "2,250 mm" },
          { name: "Front Overhang", value: "1,005 mm" },
          { name: "Rear Overhang", value: "1,265 mm" },
          { name: "Min. Clearance", value: "200 mm" },
        ],
      },
      {
        label: "MESIN / ENGINE",
        items: [
          { name: "Model", value: "4JA1L" },
          { name: "Type", value: "4 Cylinder, Direct Injection with Turbocharger" },
          { name: "Piston Displacement", value: "2,499 cc" },
          { name: "Maximum Power", value: "80 / 3,500 PS / rpm" },
          { name: "Maximum Torque", value: "19.5 / 1,800 Kg-m / rpm" },
        ],
      },
      {
        label: "BERAT / WEIGHT",
        items: [{ name: "Gross Vehicle Weight", value: "2,950" }],
      },
      {
        label: "REM / BRAKE",
        items: [
          { name: "Brake Control", value: "Hydraulic Dual Circuit" },
          { name: "Front", value: "Ventilated Disc" },
          { name: "Rear", value: "Drum, leading & trailing" },
        ],
      },
      {
        label: "SISTEM KEMUDI / STEERING SYSTEM",
        items: [
          { name: "Type", value: "Rack and pinion" },
          { name: "Power Steering", value: "Yes" },
          { name: "Turning Radius", value: "4.5 m" },
        ],
      },
    ],
  },

  "elf-nmr-l": {
    slug: "elf-nmr-l",
    title: "ELF — NMR L",
    subtitle: "Spesifikasi Teknis",
    sections: [
      {
        label: "DIMENSI",
        items: [
          { name: "Panjang", value: "7,545 mm" },
          { name: "Lebar", value: "1,920 mm" },
          { name: "Tinggi", value: "2,345 mm" },
          { name: "Jarak Sumbu", value: "4,175 mm" },
          { name: "Cabin to End", value: "5,930 mm" },
        ],
      },
      {
        label: "MESIN",
        items: [
          { name: "Model", value: "4HL1-TCS" },
          { name: "Type", value: "Direct Injection, Commonrail, SOHC, 4 Cylinder" },
          { name: "Isi Silinder", value: "4,778 cc" },
          { name: "Tenaga Maksimum", value: "150 / 2,600 PS/rpm" },
        ],
      },
      {
        label: "RODA",
        items: [
          { name: "Ban", value: "7.50-16-14PR" },
          { name: "Velg", value: "16X6.00" },
        ],
      },
      {
        label: "LAIN-LAIN",
        items: [
          { name: "Kapasitas Tangki", value: "100 Ltr" },
          { name: "Kecepatan Maksimum", value: "106 km/h" },
        ],
      },
    ],
  },

  "elf-nlr-55b-microbus": {
    slug: "elf-nlr-55b-microbus",
    title: "ELF-NLR 55B Microbus KCB (AC)",
    subtitle: "Spesifikasi Teknis",
    sections: [
      {
        label: "DIMENSI",
        items: [
          { name: "Panjang", value: "6,170 mm" },
          { name: "Lebar", value: "1,835 mm" },
          { name: "Tinggi", value: "2,200 mm" },
          { name: "Jarak Sumbu", value: "3,360 mm" },
          { name: "Kapasitas Tempat Duduk", value: "20 orang" },
        ],
      },
      {
        label: "MESIN",
        items: [
          { name: "Model", value: "4HG1-T" },
          { name: "Diameter x Langkah", value: "115 x 110 mm" },
          { name: "Isi Silinder", value: "4,570 cc" },
          { name: "Tenaga Maksimum", value: "125 / 2,900 PS/rpm" },
        ],
      },
      {
        label: "TRANSMISI",
        items: [
          { name: "Model", value: "MYY5T" },
          { name: "Gigi 1", value: "5.979" },
          { name: "Gigi 5", value: "0.721" },
        ],
      },
      {
        label: "BERAT",
        items: [
          { name: "Berat Kosong Kendaraan", value: "1,910 kg" },
          { name: "Berat Total Kendaraan", value: "5,100 kg" },
        ],
      },
    ],
  },
};

// helper untuk fallback list of slugs
export const allSpecSlugs = Object.keys(specs);
