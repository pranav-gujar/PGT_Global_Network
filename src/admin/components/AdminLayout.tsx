import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminTab } from '../types';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminContacts } from '../pages/AdminContacts';
import { AdminProfiles } from '../pages/AdminProfiles';
import { AdminApplications } from '../pages/AdminApplications';
import { AdminArticles } from '../pages/AdminArticles';
import { AdminEmailStudio } from '../pages/AdminEmailStudio';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [emailStudioRecipient, setEmailStudioRecipient] = useState<{ email: string; name?: string } | null>(null);

  const handleOpenEmailStudioWithRecipient = (email: string, name?: string) => {
    setEmailStudioRecipient({ email, name });
    setActiveTab('email-studio');
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Enforce SEO stealth dynamically
  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    const prevContent = existingRobots ? existingRobots.getAttribute('content') : null;

    if (existingRobots) {
      existingRobots.setAttribute('content', 'noindex, nofollow, noarchive');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow, noarchive';
      document.head.appendChild(meta);
    }

    const prevTitle = document.title;
    document.title = 'PGT Executive Hub • Founder Portal';

    return () => {
      document.title = prevTitle;
      if (existingRobots && prevContent) {
        existingRobots.setAttribute('content', prevContent);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Top Founder Header with Refresh & Logout */}
      <AdminHeader
        currentTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
      />

      {/* Main Workspace Body with Smooth Page Transitions */}
      <main key={refreshKey} className="flex-1 mx-auto w-full max-w-7xl px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        <div key={activeTab} className="animate-admin-page w-full">
          {activeTab === 'overview' && (
            <AdminDashboard onNavigateTab={(tab) => {
              if (tab === 'email-studio') {
                setEmailStudioRecipient(null);
              }
              setActiveTab(tab);
            }} />
          )}

          {activeTab === 'contacts' && (
            <AdminContacts
              onBackToOverview={() => setActiveTab('overview')}
              onReplyEmail={handleOpenEmailStudioWithRecipient}
            />
          )}

          {activeTab === 'profiles' && (
            <AdminProfiles onBackToOverview={() => setActiveTab('overview')} />
          )}

          {activeTab === 'applications' && (
            <AdminApplications
              onBackToOverview={() => setActiveTab('overview')}
              onSendEmail={handleOpenEmailStudioWithRecipient}
            />
          )}

          {activeTab === 'articles' && (
            <AdminArticles onBackToOverview={() => setActiveTab('overview')} />
          )}

          {activeTab === 'email-studio' && (
            <AdminEmailStudio
              initialRecipient={emailStudioRecipient}
              onBackToOverview={() => setActiveTab('overview')}
            />
          )}
        </div>
      </main>

      {/* Admin Stealth Status Footer */}
      <footer className="border-t border-border/60 bg-card/30 py-5 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © 2026 PGT Global Network. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-xs">
            <span>Designed &amp; Engineered by</span>
            <a
              href="https://technologies.pgtglobalnetwork.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              PGT Technologies
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
