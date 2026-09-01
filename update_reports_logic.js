import fs from 'fs';
let code = fs.readFileSync('src/views/ReportsView.tsx', 'utf-8');

const oldLogic = `    const closedTenders = catalogItems.filter(i => i.status === 'CLOSED' || (i.winnerAmount && Number(i.winnerAmount) > 0)).length;
    const openTenders = catalogItems.filter(i => i.status === 'OPEN' && (!i.winnerAmount || Number(i.winnerAmount) === 0)).length;

    let totalBudgetHps = 0;
    let totalHpsCompleted = 0;
    let totalPoRealisasi = 0;
    
    catalogItems.forEach(item => {
      const oe = Number(item.ownerEstimate) || 0;
      totalBudgetHps += oe;
      if (item.winnerAmount && Number(item.winnerAmount) > 0) {
        const po = Number(item.winnerAmount);
        totalPoRealisasi += po;
        totalHpsCompleted += oe > 0 ? oe : po;
      }
    });`;

const newLogic = `    let closedTenders = 0;
    let openTenders = 0;

    let totalBudgetHps = 0;
    let totalHpsCompleted = 0;
    let totalPoRealisasi = 0;
    
    catalogItems.forEach(item => {
      const oe = Number(item.ownerEstimate) || 0;
      totalBudgetHps += oe;
      
      const isExpired = item.deadline ? new Date(item.deadline).getTime() < Date.now() : false;
      const isClosed = item.status === 'CLOSED' || isExpired;
      
      if (isClosed) {
        closedTenders++;
        // Cari otomatis bid terendah
        const relatedBids = bidsHistory.filter(b => b.reqId === item.id);
        if (relatedBids.length > 0) {
          const sortedBids = [...relatedBids].sort((a, b) => {
            const priceA = Number(a.amount || a.price || 0);
            const priceB = Number(b.amount || b.price || 0);
            if (priceA !== priceB) return priceA - priceB;
            return new Date(a.dateSubmitted || 0).getTime() - new Date(b.dateSubmitted || 0).getTime();
          });
          const winningBid = sortedBids[0];
          const po = Number(winningBid.amount || winningBid.price || 0);
          totalPoRealisasi += po;
          totalHpsCompleted += oe > 0 ? oe : po;
        } else if (item.winnerAmount && Number(item.winnerAmount) > 0) {
          const po = Number(item.winnerAmount);
          totalPoRealisasi += po;
          totalHpsCompleted += oe > 0 ? oe : po;
        }
      } else {
        openTenders++;
        if (item.winnerAmount && Number(item.winnerAmount) > 0) {
           const po = Number(item.winnerAmount);
           totalPoRealisasi += po;
           totalHpsCompleted += oe > 0 ? oe : po;
        }
      }
    });`;

if (code.includes('const closedTenders = catalogItems.filter(i => i.status === \'CLOSED\'')) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/views/ReportsView.tsx', code);
  console.log('Successfully updated reports logic.');
} else {
  console.log('Failed to replace reports logic');
}
