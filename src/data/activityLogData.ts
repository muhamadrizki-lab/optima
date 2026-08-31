import { UserActivityLog } from '../types';

export const INITIAL_ACTIVITY_LOGS: UserActivityLog[] = [];

export function getStoredActivityLogs(): UserActivityLog[] {
  try {
    const saved = localStorage.getItem('optima_activity_logs');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ACTIVITY_LOGS;
}

export function logUserActivity(log: Omit<UserActivityLog, 'id' | 'timestamp' | 'date'>) {
  try {
    const existing = getStoredActivityLogs();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = now.toISOString().split('T')[0];

    const newLog: UserActivityLog = {
      ...log,
      id: `LOG-${Date.now()}`,
      timestamp: `Hari ini, ${hours}:${minutes} WIB`,
      date: dateStr
    };

    const updated = [newLog, ...existing].slice(0, 100);
    localStorage.setItem('optima_activity_logs', JSON.stringify(updated));
    return newLog;
  } catch (e) {
    console.error('Failed to save activity log:', e);
    return null;
  }
}
