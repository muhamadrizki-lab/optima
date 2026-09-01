/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, VendorCatalogItem } from './types';
import { INITIAL_VENDOR_CATALOG } from './data/vendorCatalogData';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import InternalDashboard from './views/InternalDashboard';
import CatalogKebutuhan from './views/CatalogKebutuhan';
import ManagementAkses from './views/ManagementAkses';
import ManagementKebutuhan from './views/ManagementKebutuhan';
import ManagementBidding from './views/ManagementBidding';
import Bidding from './views/Bidding';
import CatalogVendor from './views/CatalogVendor';
import MyVendorCatalog from './views/MyVendorCatalog';
import ReportsView from './views/ReportsView';
import VendorChatModal from './components/VendorChatModal';
import { startFirebaseSync } from './firebase';
import { resetAllDatabaseData } from './utils/dataReset';

export default function App() {
  // Chat Modal State
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTargetVendor, setChatTargetVendor] = useState<string | null>(null);
  const [chatTargetTenderId, setChatTargetTenderId] = useState<string | null>(null);

  const handleOpenChat = (vendorName?: string, tenderId?: string) => {
    setChatTargetVendor(vendorName || null);
    setChatTargetTenderId(tenderId || null);
    setShowChatModal(true);
  };

  // Sync state trigger to propagate real-time changes
  const [syncTrigger, setSyncTrigger] = useState(0);

  useEffect(() => {
    // Start Firebase Firestore real-time sync on mount
    startFirebaseSync(() => {
      setSyncTrigger(prev => prev + 1);
    });
  }, []);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (!e.detail || e.detail.key === 'optima_vendor_catalog') {
        const saved = localStorage.getItem('optima_vendor_catalog');
        if (saved) {
          try {
            setVendorCatalogItems(JSON.parse(saved));
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    window.addEventListener('optima-db-updated', handleUpdate as EventListener);
    return () => window.removeEventListener('optima-db-updated', handleUpdate as EventListener);
  }, []);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('optima_user_session');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error loading user session:', e);
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('optima_user_session');
      const savedView = localStorage.getItem('optima_current_view');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (savedView) {
          const isInternal = parsedUser.role === 'INTERNAL' && Boolean(parsedUser.isInternalEmployee);
          if (isInternal) {
            return savedView;
          } else {
            if (['catalog-ext', 'catalog', 'bidding', 'my-vendor-catalog', 'catalog-vendor'].includes(savedView)) {
              return savedView;
            }
          }
        }
        return parsedUser.role === 'INTERNAL' ? 'dashboard' : 'catalog-ext';
      }
    } catch (e) {
      console.error('Error loading current view:', e);
    }
    return 'catalog-ext';
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [lang, setLang] = useState<'ID' | 'EN'>(() => {
    try {
      return (localStorage.getItem('optima_lang') as 'ID' | 'EN') || 'ID';
    } catch {
      return 'ID';
    }
  });

  // Vendor Catalog State (persisted in localStorage)
  const [vendorCatalogItems, setVendorCatalogItems] = useState<VendorCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('optima_vendor_catalog');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading vendor catalog:', e);
    }
    return INITIAL_VENDOR_CATALOG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('optima_vendor_catalog', JSON.stringify(vendorCatalogItems));
    } catch (e) {
      console.error('Error saving vendor catalog:', e);
    }
  }, [vendorCatalogItems]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('optima_user_session', JSON.stringify(user));
      } else {
        localStorage.removeItem('optima_user_session');
      }
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('optima_current_view', currentView);
    } catch (e) {
      console.error('Error saving current view:', e);
    }
  }, [currentView]);

  const handleAddVendorItem = (item: VendorCatalogItem) => {
    setVendorCatalogItems(prev => [item, ...prev]);
  };

  const handleUpdateVendorItem = (item: VendorCatalogItem) => {
    setVendorCatalogItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const handleDeleteVendorItem = (id: string) => {
    setVendorCatalogItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      try {
        localStorage.setItem('optima_vendor_catalog', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('optima-db-updated', { detail: { key: 'optima_vendor_catalog' } }));
      } catch (e) {
        console.error('Error deleting vendor item:', e);
      }
      return updated;
    });
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowLoginModal(false);
    if (pendingAction === 'bidding') {
      setCurrentView('bidding');
      setPendingAction(null);
    } else {
      setCurrentView(loggedInUser.role === 'INTERNAL' ? 'dashboard' : 'catalog-ext');
    }
  };

  const [selectedBiddingReqId, setSelectedBiddingReqId] = useState<string | null>(null);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('catalog-ext');
    try {
      localStorage.removeItem('optima_user_session');
      localStorage.removeItem('optima_current_view');
    } catch (e) {
      console.error('Error removing session on logout:', e);
    }
  };

  const handleChangeRole = (newRole: 'INTERNAL' | 'EXTERNAL') => {
    // Security check: Only verified internal employees can switch simulation roles
    if (user && user.isInternalEmployee && user.role !== newRole) {
      setUser({ ...user, role: newRole });
      setCurrentView(newRole === 'INTERNAL' ? 'dashboard' : 'catalog-ext');
    }
  };

  const handleBiddingClick = (reqId?: string) => {
    if (reqId) {
      setSelectedBiddingReqId(reqId);
    }
    if (!user) {
      setPendingAction('bidding');
      setShowLoginModal(true);
    } else {
      setCurrentView('bidding');
    }
  };

  // Strictly verify internal permissions
  const isInternal = user?.role === 'INTERNAL' && Boolean(user?.isInternalEmployee);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return isInternal ? (
          <InternalDashboard 
            vendorCatalogItems={vendorCatalogItems} 
            onNavigate={(v) => setCurrentView(v)}
            onOpenChat={handleOpenChat}
          />
        ) : (
          <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />
        );
      case 'catalog':
      case 'catalog-ext':
        return <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />;
      case 'access':
        return isInternal ? <ManagementAkses /> : <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />;
      case 'requirement':
        return isInternal ? <ManagementKebutuhan /> : <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />;
      case 'management-bidding':
        return isInternal ? <ManagementBidding /> : <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />;
      case 'bidding':
        return (
          <Bidding 
            user={user}
            initialReqId={selectedBiddingReqId}
            vendorCatalogItems={vendorCatalogItems}
            onBack={() => setCurrentView(user?.role === 'INTERNAL' ? 'catalog' : 'catalog-ext')}
            onOpenChat={handleOpenChat}
          />
        );
      case 'catalog-vendor':
        return isInternal ? (
          <CatalogVendor
            user={user}
            items={vendorCatalogItems}
            onAddItem={handleAddVendorItem}
            onUpdateItem={handleUpdateVendorItem}
            onDeleteItem={handleDeleteVendorItem}
            onNavigateToMyCatalog={() => setCurrentView('my-vendor-catalog')}
            onOpenChat={handleOpenChat}
          />
        ) : (
          <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />
        );
      case 'reports':
        return isInternal ? (
          <ReportsView vendorCatalogItems={vendorCatalogItems} />
        ) : (
          <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />
        );
      case 'my-vendor-catalog':
        return user ? (
          <MyVendorCatalog
            user={user}
            items={vendorCatalogItems}
            onAddItem={handleAddVendorItem}
            onUpdateItem={handleUpdateVendorItem}
            onDeleteItem={handleDeleteVendorItem}
            onBrowseAllCatalog={() => setCurrentView('catalog-vendor')}
            onOpenChat={handleOpenChat}
          />
        ) : (
          <CatalogVendor
            user={user}
            items={vendorCatalogItems}
            onAddItem={handleAddVendorItem}
            onUpdateItem={handleUpdateVendorItem}
            onDeleteItem={handleDeleteVendorItem}
            onOpenChat={handleOpenChat}
          />
        );
      default:
        return <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} onOpenChat={handleOpenChat} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      <Header 
        user={user} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={handleLogout} 
        onChangeRole={handleChangeRole} 
        lang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
        onOpenChat={() => handleOpenChat()}
      />
      <div className="flex flex-1 overflow-hidden">
        {user && (
          <Sidebar 
            user={user} 
            currentView={currentView} 
            onChangeView={(v) => {
              if (v === 'bidding') {
                setSelectedBiddingReqId(null);
              }
              setCurrentView(v);
            }} 
            onOpenChat={() => handleOpenChat()}
          />
        )}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="w-full bg-slate-900 relative h-[340px] shrink-0 overflow-hidden border-b border-slate-200">
             <video 
               src="https://res.cloudinary.com/x6bejifd/video/upload/v1786613786/vidssave.com_Pancaran_Group_720P_uosct4.mp4" 
               className="w-full h-full object-cover object-[center_50%] opacity-90 scale-105"
               autoPlay 
               loop 
               muted 
               playsInline
             />
             {/* Gradient overlay: clear video on top, subtle dark backdrop for text readability, and smooth white gradient at the bottom edge */}
             <div className="absolute inset-0 bg-gradient-to-t from-white via-slate-900/40 to-transparent flex flex-col justify-end p-10 sm:px-14 sm:pb-10">
                <h1 className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">OPTIMA Pancaran Group</h1>
                <p className="text-slate-100 text-sm sm:text-base max-w-2xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">Oriented Procurement, Targeted Integrated Management for Aligned Tender.</p>
             </div>
          </div>
          {renderView()}
        </main>
      </div>

      {showLoginModal && (
        <Login 
          onLogin={handleLogin} 
          isModal={true} 
          onClose={() => {
            setShowLoginModal(false);
            setPendingAction(null);
          }} 
        />
      )}

      {/* Global Vendor Chat Modal */}
      <VendorChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        currentUser={user}
        targetVendorName={chatTargetVendor}
        targetTenderId={chatTargetTenderId}
      />
    </div>
  );
}


