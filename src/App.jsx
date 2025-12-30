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
    products: [
      {
        id: 1,
        title: 'Sample Amazon Product',
        description: 'Great quality product from Amazon',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        affiliateUrl: 'https://amazon.com/dp/example',
        price: '$29.99',
        category: 'Electronics',
        featured: true,
        clicks: 0,
        visible: true
      },
      {
        id: 2,
        title: 'Another Great Product',
        description: 'Highly recommended item',
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        affiliateUrl: 'https://amazon.com/dp/example2',
        price: '$49.99',
        category: 'Home',
        featured: false,
        clicks: 0,
        visible: true
      }
    ],
    ads: {
      units: [
        {
          id: 'top',
          code: '',
          enabled: false,
          position: 'top'
        },
        {
          id: 'middle',
          code: '',
          enabled: false,
          position: 'middle'
        },
        {
          id: 'bottom',
          code: '',
          enabled: false,
          position: 'bottom'
        }
      ]
    },
    announcement: {
      text: '',
      color: '#000000',
      backgroundColor: '#fbbf24',
      enabled: false,
      link: ''
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
