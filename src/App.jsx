import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { GuestRoute, ProtectedRoute } from './components/RouteGuards.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import ComplaintDetails from './pages/ComplaintDetails.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import NewComplaint from './pages/student/NewComplaint.jsx'
import EditComplaint from './pages/student/EditComplaint.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

function App() {
  const { pathname } = useLocation()

  // Start each page at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <Navbar />
      <main className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/new" element={<ProtectedRoute role="STUDENT"><NewComplaint /></ProtectedRoute>} />
          <Route
            path="/student/complaints/:id/edit"
            element={<ProtectedRoute role="STUDENT"><EditComplaint /></ProtectedRoute>}
          />

          <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">CampusConnect · Campus Issue &amp; Complaint Management System</div>
      </footer>
    </div>
  )
}

export default App
