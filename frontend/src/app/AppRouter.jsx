import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import AnalyzePage from '../pages/AnalyzePage.jsx'
import HistoryPage from '../pages/HistoryPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import ResultPage from '../pages/ResultPage.jsx'
import { ToastProvider } from '../components/ToastProvider.jsx'

export default function AppRouter() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/results/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
