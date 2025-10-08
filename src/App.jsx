import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LinkPage from './components/LinkPage'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const [userData, setUserData] = useState({
    profile: {
      name: 'Your Name',
      bio: 'Welcome to my link in bio!',
      avatar: '',
      backgroundType: 'gradient',
      backgroundColor: '#667eea',
      backgroundImage: '',
      theme: 'modern'
    },
    links: [
      {
        id: 1,
        title: 'My Website',
        url: 'https://example.com',
        description: 'Check out my main website',
        visible: true,
        icon: 'globe'
      },
      {
        id: 2,
        title: 'Instagram',
        url: 'https://instagram.com/username',
        description: 'Follow me on Instagram',
        visible: true,
        icon: 'instagram'
      }
    ],
    ads: {
      enabled: false,
      adCode: '',
      placement: 'bottom'
    },
    analytics: {
      googleAnalyticsId: '',
      enabled: false
    }
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('linkInBioData')
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  // Save data to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('linkInBioData', JSON.stringify(userData))
  }, [userData])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route 
            path="/" 
            element={<LinkPage userData={userData} />} 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                userData={userData} 
                setUserData={setUserData} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
