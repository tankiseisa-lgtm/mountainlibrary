import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Users from './pages/Users'
import Transactions from './pages/Transactions'

function ProtectedRoute({ children, role }) {
  const currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  )

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  if (role && currentUser.role !== role) {
    if (currentUser.role === 'member') {
      return <Navigate to="/transactions" replace />
    }

    if (currentUser.role === 'librarian') {
      return <Navigate to="/dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter basename="/mountain-library">
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Librarian pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="librarian">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute role="librarian">
              <Books />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute role="librarian">
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Member page */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute role="member">
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Unknown page */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App