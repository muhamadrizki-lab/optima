import fs from 'fs';
let code = fs.readFileSync('src/views/InternalDashboard.tsx', 'utf-8');

code = code.replace(
  "|| selectedStat.name === 'Menang Tender') || selectedStat.name === 'Tender Menang') && (",
  "|| selectedStat.name === 'Menang Tender' || selectedStat.name === 'Tender Menang') && ("
);

fs.writeFileSync('src/views/InternalDashboard.tsx', code);
console.log('Fixed syntax error.');
