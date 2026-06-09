import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/app/DashboardPage'
import StocksPage from '../pages/app/StocksPage'
import CryptoPage from '../pages/app/CryptoPage'
import EtfsPage from '../pages/app/EtfsPage'
import TransactionsPage from '../pages/app/TransactionsPage'
import WatchlistPage from '../pages/app/WatchlistPage'
import AlertsPage from '../pages/app/AlertsPage'
import SettingsPage from '../pages/app/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/app/dashboard', element: <DashboardPage /> },
          { path: '/app/stocks', element: <StocksPage /> },
          { path: '/app/crypto', element: <CryptoPage /> },
          { path: '/app/etfs', element: <EtfsPage /> },
          { path: '/app/transactions', element: <TransactionsPage /> },
          { path: '/app/watchlist', element: <WatchlistPage /> },
          { path: '/app/alerts', element: <AlertsPage /> },
          { path: '/app/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
