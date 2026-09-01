import fs from 'fs';
let code = fs.readFileSync('src/views/InternalDashboard.tsx', 'utf-8');

const oldStats = `    { 
      name: 'Total Penawaran', 
      value: totalBids.toString(), 
      detail: 'Quotation bidding masuk',
      icon: FileText, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      actionView: 'catalog'
    },
    { 
      name: 'Total Pengeluaran & PO',`;

const newStats = `    { 
      name: 'Total Penawaran', 
      value: totalBids.toString(), 
      detail: 'Quotation bidding masuk',
      icon: FileText, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      actionView: 'catalog'
    },
    { 
      name: 'Tender Menang', 
      value: wonItems.length.toString(), 
      detail: 'Status Menang PO',
      icon: Trophy, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50', 
      border: 'border-teal-100',
      actionView: 'catalog'
    },
    { 
      name: 'Total Pengeluaran & PO',`;

if (code.includes("name: 'Total Penawaran'")) {
  code = code.replace(oldStats, newStats);
  
  // Fix grid-cols
  code = code.replace('xl:grid-cols-6', 'xl:grid-cols-7');
  
  fs.writeFileSync('src/views/InternalDashboard.tsx', code);
  console.log('Successfully updated stats.');
} else {
  console.log('Failed to find Total Penawaran');
}
