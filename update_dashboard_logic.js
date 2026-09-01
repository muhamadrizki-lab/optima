import fs from 'fs';
let code = fs.readFileSync('src/views/InternalDashboard.tsx', 'utf-8');

const newWonItemsLogic = `  const wonItems = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      vendorName: string;
      amount: number;
      ownerEstimate: number;
      date: string;
      notes?: string;
    }> = [];

    // From kebutuhanList
    kebutuhanList.forEach((item: any) => {
      const isExpired = item.deadline ? new Date(item.deadline).getTime() < Date.now() : false;
      const isClosed = item.status === 'CLOSED' || isExpired;

      if (isClosed) {
        // Cari bid yang terkait dengan tender ini
        const relatedBids = bidsList.filter(b => b.reqId === item.id);
        
        if (relatedBids.length > 0) {
          // Sortir bid berdasarkan harga terendah, lalu waktu submit paling awal
          const sortedBids = [...relatedBids].sort((a, b) => {
            const priceA = Number(a.amount || a.price || 0);
            const priceB = Number(b.amount || b.price || 0);
            if (priceA !== priceB) {
              return priceA - priceB;
            }
            // Jika harga sama, urutkan berdasarkan waktu submit tercepat
            return new Date(a.dateSubmitted || 0).getTime() - new Date(b.dateSubmitted || 0).getTime();
          });

          const winningBid = sortedBids[0];
          const price = Number(winningBid.amount || winningBid.price || 0);

          list.push({
            id: item.id,
            title: item.title,
            vendorName: winningBid.vendorName || 'Vendor Terpilih',
            amount: price,
            ownerEstimate: Number(item.ownerEstimate) || price,
            date: item.winnerDate || item.datePosted || 'Terbaru',
            notes: item.winnerNotes || 'Auto-kalkulasi (Peringkat #1 Harga Terendah & Tercepat)'
          });
        } else if (item.winnerAmount && Number(item.winnerAmount) > 0) {
           list.push({
             id: item.id,
             title: item.title,
             vendorName: item.winnerVendorName || 'Vendor Terpilih',
             amount: Number(item.winnerAmount),
             ownerEstimate: Number(item.ownerEstimate) || Number(item.winnerAmount),
             date: item.winnerDate || item.datePosted || 'Terbaru',
             notes: item.winnerNotes || 'Tender selesai, BAST & PO telah diterbitkan.'
           });
        }
      } else if (item.winnerAmount && Number(item.winnerAmount) > 0) {
        // Fallback for manually set winners if not closed yet?
        list.push({
          id: item.id,
          title: item.title,
          vendorName: item.winnerVendorName || 'Vendor Terpilih',
          amount: Number(item.winnerAmount),
          ownerEstimate: Number(item.ownerEstimate) || Number(item.winnerAmount),
          date: item.winnerDate || item.datePosted || 'Terbaru',
          notes: item.winnerNotes || 'Tender selesai, BAST & PO telah diterbitkan.'
        });
      }
    });

    return list;
  }, [kebutuhanList, bidsList]);`;

if (code.includes('const wonItems = useMemo(() => {')) {
  const startIdx = code.indexOf('  const wonItems = useMemo(() => {');
  const endStr = '  }, [kebutuhanList, bidsList]);';
  const endIdx = code.indexOf(endStr, startIdx) + endStr.length;
  
  if (startIdx !== -1 && endIdx > startIdx) {
     code = code.substring(0, startIdx) + newWonItemsLogic + code.substring(endIdx);
     fs.writeFileSync('src/views/InternalDashboard.tsx', code);
     console.log('Successfully updated wonItems logic.');
  } else {
     console.log('Failed to find exact bounds');
  }
} else {
  console.log('Could not find wonItems useMemo block');
}
