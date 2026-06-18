
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'

function App() {


  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/auth' element={<AuthPage />} />
    </Routes>
  )
}

export default App
