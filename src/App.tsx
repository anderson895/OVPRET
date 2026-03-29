import React, { useState, useEffect, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubmitPage } from './pages/SubmitPage';
import { ReviewPage } from './pages/ReviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LogsPage } from './pages/LogsPage';
import { Layout, type PageId } from './components/Layout';
import type { RETDocument, TransactionLog } from './types';
import { listenDocuments, listenLogs } from './services/documents';

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: 'Document Tracking Dashboard',
  submit: 'Submit RET Document',
  review: 'Review & Process Documents',
  analytics: 'Document Analytics',
  logs: 'Transaction Logs & History',
};

const App: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [page, setPage] = useState<PageId>('dashboard');
  const [documents, setDocuments] = useState<RETDocument[]>([]);
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [docsLoaded, setDocsLoaded] = useState(false);

  // Listen to data whenever user is logged in
  useEffect(() => {
    if (!user) return;

    setDocsLoaded(false);
    const unsubDocs = listenDocuments((docs) => {
      setDocuments(docs);
      setDocsLoaded(true);
    });
    const unsubLogs = listenLogs((logs) => {
      setLogs(logs);
    });

    return () => {
      unsubDocs();
      unsubLogs();
    };
  }, [user]);

  const handleRefresh = useCallback(() => {
    // In demo mode, re-fetch from mock store
    const unsubDocs = listenDocuments((docs) => { setDocuments(docs); });
    const unsubLogs = listenLogs((logs) => { setLogs(logs); });
    // Unsubscribe immediately — one-time fetch for demo
    setTimeout(() => { unsubDocs(); unsubLogs(); }, 100);
  }, []);

  const pendingCount = documents.filter((d) => d.status === 'Pending').length;

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage />
      </ThemeProvider>
    );
  }

  const isVP = user.role === 'vp';

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage documents={documents} user={user} onRefresh={handleRefresh} />;
      case 'submit':
        return isVP
          ? <DashboardPage documents={documents} user={user} onRefresh={handleRefresh} />
          : <SubmitPage documents={documents} user={user} onRefresh={handleRefresh} />;
      case 'review':
        return <ReviewPage documents={documents} user={user} onRefresh={handleRefresh} />;
      case 'analytics':
        return <AnalyticsPage documents={documents} />;
      case 'logs':
        return <LogsPage documents={documents} logs={logs} />;
      default:
        return <DashboardPage documents={documents} user={user} onRefresh={handleRefresh} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        user={user}
        currentPage={page}
        onNavigate={setPage}
        onLogout={logout}
        pendingCount={pendingCount}
        pageTitle={PAGE_TITLES[page]}
      >
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
