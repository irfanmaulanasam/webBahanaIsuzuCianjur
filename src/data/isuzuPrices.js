export const IsuzuPrices = {
  "Niaga Berat (HCV)": [
    { model: "FTR T", price:"841340000", type: "HCV" },
    { model: "FVR L D", price:"922760000", type: "HCV" },
    { model: "FVR P", price:"929840000", type: "HCV" },
    { model: "FVR S", price:"941640000", type: "HCV" },
    { model: "FVR Q", price:"935740000", type: "HCV" },
    { model: "FVR U", price:"952260000", type: "HCV" },
    { model: "GVR J", price:"969960000", type: "HCV" },
    { model: "GVR J HP ABS", price:"1056100000", type: "HCV" },
    { model: "FVM N", price:"1087960000", type: "HCV" },
    { model: "FVM U", price:"1102120000", type: "HCV" },
    { model: "FVM U HP", price:"1164660000", type: "HCV" },
    { model: "FVM N HP ABS", price:"1183540000", type: "HCV" },
    { model: "FVZ N HP", price:"1365260000", type: "HCV" },
    { model: "FVZ L HP MX", price:"1359360000", type: "HCV" },
    { model: "FVZ U HP", price:"1390040000", type: "HCV" },
    { model: "GVZ K HP ABS", price:"1393580000", type: "HCV" },
    { model: "GXZ K ABS", price:"1578840000", type: "HCV" },
  ],
  "Niaga Menengah (MCV)": [
    { model: "NLR", price:"419000000", type: "MCV" },
    { model: "NLR L", price:"436000000", type: "MCV" },
    { model: "NMR", price:"496000000", type: "MCV" },
    { model: "NMR L", price:"507000000", type: "MCV" },
    { model: "NMR HD 5.8", price:"507000000", type: "MCV" },
    { model: "NMR HD 6.5", price:"518000000", type: "MCV" },
    { model: "NPS", price:"896000000", type: "MCV" },
    { model: "NLR B Microbus AC", price:"596000000", type: "MCV" },
    { model: "NLR B L Microbus AC", price:"643000000", type: "MCV" },
    { model: "NLR B", price:"426000000", type: "MCV" },
    { model: "NLR B L", price:"439000000", type: "MCV" },
    { model: "NQR B", price:"512000000", type: "MCV" },
  ],
  "Niaga Ringan (LCV)": [
    { model: "Traga Pick Up (FD)", price:"289000000", type: "LCV" },
    { model: "Traga Box Semi Aluminium", price:"330000000", type: "LCV" },
    { model: "Traga Box Full Aluminium", price:"336000000", type: "LCV" },
    { model: "Traga Freezer Box", price:"409000000", type: "LCV" },
  ],
};

// Fungsi untuk dapatkan semua tipe unik
export const getUniqueTypes = () => {
  const types = new Set();
  Object.values(IsuzuPrices).forEach(group =>
    group.forEach(item => types.add(item.type))
  );
  return Array.from(types);
};
