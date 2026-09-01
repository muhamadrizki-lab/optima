import fs from 'fs';
let code = fs.readFileSync('src/views/InternalDashboard.tsx', 'utf-8');

if (code.includes("selectedStat.name === 'Total Realisasi Belanja (PO)'")) {
  code = code.replace(
    "selectedStat.name === 'Total Realisasi Belanja (PO)')",
    "selectedStat.name === 'Total Realisasi Belanja (PO)' || selectedStat.name === 'Menang Tender') || selectedStat.name === 'Tender Menang')"
  );
  fs.writeFileSync('src/views/InternalDashboard.tsx', code);
  console.log('Successfully updated modal condition.');
} else {
  console.log('Failed to find modal condition');
}
