export function resetAllDatabaseData() {
  try {
    localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify([]));
    localStorage.setItem('optima_bids_history', JSON.stringify([]));
    localStorage.setItem('optima_vendor_catalog', JSON.stringify([]));
    localStorage.setItem('optima_chat_conversations', JSON.stringify([]));
    localStorage.setItem('optima_chat_messages', JSON.stringify({}));
    localStorage.setItem('optima_activity_logs', JSON.stringify([]));
    localStorage.setItem('optima_vendor_issues', JSON.stringify([]));
    localStorage.setItem('optima_access_users', JSON.stringify([]));
    localStorage.setItem('optima_companies_profiles', JSON.stringify({}));
    localStorage.setItem('optima_simulated_sales_map', JSON.stringify({}));
    localStorage.setItem('optima_user_passwords', JSON.stringify({}));
    localStorage.setItem('optima_data_cleared_v3', 'true');

    // Dispatch event to trigger state refreshes across all components
    window.dispatchEvent(new CustomEvent('optima-db-updated', { detail: { key: 'all' } }));
  } catch (e) {
    console.error('Failed to reset database data:', e);
  }
}

// Automatically clear data once on load to ensure completely empty state
if (typeof window !== 'undefined') {
  try {
    const isCleared = localStorage.getItem('optima_data_cleared_v3');
    if (!isCleared) {
      resetAllDatabaseData();
    }
  } catch (e) {
    // ignore
  }
}


