import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LinkPageEnhanced from './components/LinkPageEnhanced'
import AdminPanelEnhanced from './components/AdminPanelEnhanced'
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
    categories: [
      {
        id: 1,
        name: 'Social Media',
        color: '#3b82f6',
        visible: true
      },
      {
        id: 2,
        name: 'Work & Projects',
        color: '#10b981',
        visible: true
      },
      {
        id: 3,
        name: 'Top Finds',
        color: '#f59e0b',
        visible: true,
        isTopFinds: true
      }
    ],
    links: [
      {
        id: 1,
        title: 'My Website',
        url: 'https://example.com',
        description: 'Check out my main website',
        visible: true,
        icon: 'globe',
        categoryId: 2,
        isTopFind: false,
        imageUrl: ''
      },
      {
        id: 2,
        title: 'Instagram',
        url: 'https://instagram.com/username',
        description: 'Follow me on Instagram',
        visible: true,
        icon: 'instagram',
        categoryId: 1,
        isTopFind: true,
        imageUrl: ''
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
            element={<LinkPageEnhanced userData={userData} />} 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPanelEnhanced 
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
