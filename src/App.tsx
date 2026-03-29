import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { StaffDashboardPage } from './pages/StaffDashboardPage'
import { VPDashboardPage } from './pages/VPDashboardPage'
import { ReviewPage } from './pages/ReviewPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { LogsPage } from './pages/LogsPage'
import { AdminStaffPage } from './pages/AdminStaffPage'
import { SubmitPage } from './pages/SubmitPage'
import { MyDocumentsPage } from './pages/MyDocumentsPage'
import { ProfilePage } from './pages/ProfilePage'
import { VPDecisionsPage } from './pages/VPDecisionsPage'
import { Layout, type PageId, PAGE_TITLES } from './components/Layout'
import type { RETDocument, TransactionLog } from './types'
import { listenDocuments, listenLogs } from './services/documents'

const App: React.FC = () => {
  const { user, logout } = useAuth()
  const [page, setPage]           = useState<PageId>('dashboard')
  const [documents, setDocuments] = useState<RETDocument[]>([])
  const [logs, setLogs]           = useState<TransactionLog[]>([])

  useEffect(() => {
    if (!user) return
    const unsubDocs = listenDocuments((docs) => setDocuments(docs), { role: user.role, uid: user.uid })
    const unsubLogs = (user.role === 'admin' || user.role === 'vp')
      ? listenLogs((l) => setLogs(l))
      : () => {}
    return () => { unsubDocs(); unsubLogs() }
  }, [user])

  useEffect(() => {
    if (!user) setPage('dashboard')
  }, [user])

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage />
      </ThemeProvider>
    )
  }

  const pendingCount = documents.filter((d) => d.status === 'Pending').length

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        if (user.role === 'staff') return <StaffDashboardPage documents={documents} user={user} onNavigate={setPage} />
        if (user.role === 'vp')    return <VPDashboardPage    documents={documents} user={user} onNavigate={setPage} />
        return <DashboardPage documents={documents} user={user} />

      case 'submit':
        return <SubmitPage documents={documents} user={user} />

      case 'my-documents':
        return <MyDocumentsPage documents={documents} user={user} />

      case 'review':
        return <ReviewPage documents={documents} user={user} />

      case 'vp-decisions':
        return <VPDecisionsPage documents={documents} user={user} />

      case 'analytics':
        return <AnalyticsPage documents={documents} />

      case 'logs':
        return <LogsPage documents={documents} logs={logs} />

      case 'staff':
        return <AdminStaffPage user={user} />

      case 'profile':
        return <ProfilePage user={user} />

      default:
        return <DashboardPage documents={documents} user={user} />
    }
  }

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
  )
}

export default App
