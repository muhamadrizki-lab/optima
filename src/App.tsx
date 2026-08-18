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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('catalog-ext');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

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

  const handleAddVendorItem = (item: VendorCatalogItem) => {
    setVendorCatalogItems(prev => [item, ...prev]);
  };

  const handleUpdateVendorItem = (item: VendorCatalogItem) => {
    setVendorCatalogItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const handleDeleteVendorItem = (id: string) => {
    setVendorCatalogItems(prev => prev.filter(i => i.id !== id));
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
          />
        ) : (
          <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />
        );
      case 'catalog':
      case 'catalog-ext':
        return <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />;
      case 'access':
        return isInternal ? <ManagementAkses /> : <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />;
      case 'requirement':
        return isInternal ? <ManagementKebutuhan /> : <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />;
      case 'management-bidding':
        return isInternal ? <ManagementBidding /> : <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />;
      case 'bidding':
        return (
          <Bidding 
            user={user}
            initialReqId={selectedBiddingReqId}
            onBack={() => setCurrentView(user?.role === 'INTERNAL' ? 'catalog' : 'catalog-ext')} 
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
          />
        ) : (
          <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />
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
          />
        ) : (
          <CatalogVendor
            user={user}
            items={vendorCatalogItems}
            onAddItem={handleAddVendorItem}
            onUpdateItem={handleUpdateVendorItem}
            onDeleteItem={handleDeleteVendorItem}
          />
        );
      default:
        return <CatalogKebutuhan user={user} onBiddingClick={handleBiddingClick} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      <Header 
        user={user} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={handleLogout} 
        onChangeRole={handleChangeRole} 
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
          />
        )}
        <main className="flex-1 overflow-y-auto relative">
          <div className="w-full bg-[#0f172a] relative h-[240px] shrink-0 overflow-hidden border-b border-slate-200">
             <video 
               src="https://res.cloudinary.com/x6bejifd/video/upload/v1786613786/vidssave.com_Pancaran_Group_720P_uosct4.mp4" 
               className="w-full h-full object-cover opacity-50"
               autoPlay 
               loop 
               muted 
               playsInline
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent flex flex-col justify-end p-8 sm:px-12">
                <h1 className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-2">OPTIMA Pancaran Group</h1>
                <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-medium">Oriented Procurement, Targeted Integrated Management for Aligned Tender.</p>
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
    </div>
  );
}


