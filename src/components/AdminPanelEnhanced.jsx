import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Trash2, Plus, Eye, EyeOff, GripVertical, BarChart3, Settings,
  Palette, Link as LinkIcon, Star, Folder, ShoppingBag, DollarSign,
  Bell, Edit2, Save, X, LogOut, RefreshCw, AlertTriangle, Instagram,
  Twitter, Youtube, Linkedin, Facebook
} from 'lucide-react'
import { AdUnitPreview } from './AdUnit'
import { AdminLoginModal } from './AdminLoginModal'
import { extractASIN, isAmazonUrl, validateProduct } from '@/utils/productFetcher'
import {
  isAuthenticated as checkAuth,
  logout,
  getRemainingSessionTime,
  extendSession,
  setAdminPassword,
  getAdminPasswordHash
} from '@/utils/authUtils'

function AdminPanelEnhanced({ userData, setUserData }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSessionWarning, setShowSessionWarning] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    icon: 'external',
    categoryId: '',
    isTopFind: false,
    imageUrl: ''
  })

  const [newSocialLink, setNewSocialLink] = useState({
    platform: 'instagram',
    url: ''
  })

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3b82f6'
  })

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    imageUrl: '',
    affiliateUrl: '',
    price: '',
    category: 'General',
    featured: false
  })

  const [editingProduct, setEditingProduct] = useState(null)
  const [productErrors, setProductErrors] = useState([])

  // Authentication & Session Management
  useEffect(() => {
    const checkAuthStatus = () => {
      const authed = checkAuth()
      setIsLoggedIn(authed)
      if (!authed) {
        setShowLoginModal(true)
      }
    }
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    const timer = setInterval(() => {
      const timeLeft = getRemainingSessionTime()
      setRemainingTime(timeLeft)

      if (timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {
        setShowSessionWarning(true)
      } else if (timeLeft === 0) {
        handleLogout()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isLoggedIn])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setShowSessionWarning(false)
    navigate('/')
  }

  const handleExtendSession = () => {
    extendSession()
    setShowSessionWarning(false)
    setRemainingTime(30 * 60 * 1000)
  }

  const handleAuthActivity = () => {
    if (isLoggedIn) {
      extendSession()
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    try {
      await setAdminPassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      setShowChangePasswordModal(false)
    } catch (error) {
      setPasswordError('Failed to change password')
    }
  }

  const updateProfile = (field, value) => {
    setUserData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }))
  }

  const updateAnnouncement = (field, value) => {
    setUserData(prev => ({
      ...prev,
      announcement: {
        ...prev.announcement,
        [field]: value
      }
    }))
  }

  const updateAdUnit = (unitId, field, value) => {
    setUserData(prev => ({
      ...prev,
      ads: {
        ...prev.ads,
        units: prev.ads.units.map(unit =>
          unit.id === unitId ? { ...unit, [field]: value } : unit
        )
      }
    }))
  }

  const updateAnalytics = (field, value) => {
    setUserData(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        [field]: value
      }
    }))
  }

  // Category Management
  const addCategory = () => {
    if (newCategory.name) {
      const category = {
        ...newCategory,
        id: Date.now(),
        visible: true
      }
      setUserData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), category]
      }))
      setNewCategory({ name: '', color: '#3b82f6' })
    }
  }

  const updateCategory = (id, field, value) => {
    setUserData(prev => ({
      ...prev,
      categories: prev.categories.map(category =>
        category.id === id ? { ...category, [field]: value } : category
      )
    }))
  }

  const deleteCategory = (id) => {
    setUserData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category.id !== id),
      links: prev.links.map(link => 
        link.categoryId === id ? { ...link, categoryId: null } : link
      )
    }))
  }

  // Link Management
  const addLink = () => {
    if (newLink.title && newLink.url) {
      const link = {
        ...newLink,
        id: Date.now(),
        visible: true,
        categoryId: newLink.categoryId || null
      }
      setUserData(prev => ({
        ...prev,
        links: [...prev.links, link]
      }))
      setNewLink({ 
        title: '', 
        url: '', 
        description: '', 
        icon: 'external', 
        categoryId: '', 
        isTopFind: false,
        imageUrl: ''
      })
    }
  }

  const updateLink = (id, field, value) => {
    setUserData(prev => ({
      ...prev,
      links: prev.links.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    }))
  }

  const deleteLink = (id) => {
    setUserData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }))
  }

  const toggleLinkVisibility = (id) => {
    setUserData(prev => ({
      ...prev,
      links: prev.links.map(link =>
        link.id === id ? { ...link, visible: !link.visible } : link
      )
    }))
  }

  // Social Links Management
  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      const socialLink = {
        ...newSocialLink,
        id: Date.now()
      }
      setUserData(prev => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), socialLink]
      }))
      setNewSocialLink({ platform: 'instagram', url: '' })
    }
  }

  const deleteSocialLink = (id) => {
    setUserData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }))
  }

  // Product Management
  const addProduct = () => {
    const validation = validateProduct(newProduct)
    if (!validation.valid) {
      setProductErrors(validation.errors)
      return
    }

    const product = {
      ...newProduct,
      id: Date.now(),
      visible: true,
      clicks: 0,
      asin: extractASIN(newProduct.affiliateUrl)
    }
    
    setUserData(prev => ({
      ...prev,
      products: [...(prev.products || []), product]
    }))
    
    setNewProduct({
      title: '',
      description: '',
      imageUrl: '',
      affiliateUrl: '',
      price: '',
      category: 'General',
      featured: false
    })
    setProductErrors([])
  }

  const updateProduct = (id, field, value) => {
    setUserData(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      )
    }))
  }

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setUserData(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id)
      }))
    }
  }

  const toggleProductVisibility = (id) => {
    setUserData(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === id ? { ...product, visible: !product.visible } : product
      )
    }))
  }

  const startEditingProduct = (product) => {
    setEditingProduct({ ...product })
  }

  const saveEditingProduct = () => {
    if (editingProduct) {
      const validation = validateProduct(editingProduct)
      if (!validation.valid) {
        setProductErrors(validation.errors)
        return
      }

      setUserData(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === editingProduct.id ? editingProduct : product
        )
      }))
      setEditingProduct(null)
      setProductErrors([])
    }
  }

  const cancelEditingProduct = () => {
    setEditingProduct(null)
    setProductErrors([])
  }

  const updateEditingProduct = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Get click counts
  const getClickCounts = () => {
    const savedCounts = localStorage.getItem('linkClickCounts')
    return savedCounts ? JSON.parse(savedCounts) : {}
  }

  const getProductClickCounts = () => {
    const savedCounts = localStorage.getItem('productClickCounts')
    return savedCounts ? JSON.parse(savedCounts) : {}
  }

  const clickCounts = getClickCounts()
  const productClickCounts = getProductClickCounts()

  // Get unique product categories
  const getProductCategories = () => {
    const categories = new Set(['General', 'Electronics', 'Home', 'Fashion', 'Books', 'Sports'])
    userData.products?.forEach(product => {
      if (product.category) {
        categories.add(product.category)
      }
    })
    return Array.from(categories)
  }

  const productCategories = getProductCategories()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LinkHub Admin Panel</h1>
            {isLoggedIn && (
              <p className="text-sm text-gray-500 mt-1">
                Session expires in {Math.floor(remainingTime / 60000)}:{String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, '0')}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {isLoggedIn && (
              <>
                <Button onClick={() => setShowChangePasswordModal(true)} variant="outline" size="sm">
                  Change Password
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            <Button onClick={() => window.location.href = '/'} variant="outline">
              View Public Page
            </Button>
          </div>
        </div>

        {isLoggedIn ? (
          <Tabs defaultValue="profile" className="space-y-6" onValueChange={handleAuthActivity}>
          <TabsList className="grid w-full grid-cols-7 h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-1 text-xs">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1 text-xs">
              <Folder className="w-4 h-4" />
              <span className="hidden md:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-1 text-xs">
              <LinkIcon className="w-4 h-4" />
              <span className="hidden md:inline">Links</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 text-xs">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1 text-xs">
              <Palette className="w-4 h-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-1 text-xs">
              <DollarSign className="w-4 h-4" />
              <span className="hidden md:inline">Ads</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Customize your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={userData.profile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userData.profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    placeholder="Tell people about yourself..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={userData.profile.avatar}
                    onChange={(e) => updateProfile('avatar', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Add your social media profiles for visitors to connect
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Social Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="social-platform">Platform</Label>
                     <Select
                       value={newSocialLink.platform}
                       onValueChange={(value) => setNewSocialLink(prev => ({ ...prev, platform: value }))}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="instagram">
                           <div className="flex items-center gap-2">
                             <Instagram className="w-4 h-4 text-[#E4405F]" />
                             Instagram
                           </div>
                         </SelectItem>
                         <SelectItem value="twitter">
                           <div className="flex items-center gap-2">
                             <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                             Twitter
                           </div>
                         </SelectItem>
                         <SelectItem value="youtube">
                           <div className="flex items-center gap-2">
                             <Youtube className="w-4 h-4 text-[#FF0000]" />
                             YouTube
                           </div>
                         </SelectItem>
                         <SelectItem value="linkedin">
                           <div className="flex items-center gap-2">
                             <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                             LinkedIn
                           </div>
                         </SelectItem>
                         <SelectItem value="facebook">
                           <div className="flex items-center gap-2">
                             <Facebook className="w-4 h-4 text-[#1877F2]" />
                             Facebook
                           </div>
                         </SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label htmlFor="social-url">Profile URL</Label>
                     <Input
                       id="social-url"
                       value={newSocialLink.url}
                       onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                       placeholder="https://instagram.com/username"
                     />
                   </div>
                 </div>
                 <Button onClick={addSocialLink}>
                   <Plus className="w-4 h-4 mr-2" />
                   Add Social Link
                 </Button>

                 {/* Existing Social Links */}
                 {userData.socialLinks && userData.socialLinks.length > 0 && (
                   <div className="space-y-2 mt-4 pt-4 border-t">
                     <Label>Your Social Links</Label>
                     {userData.socialLinks.map((link) => {
                       const icons = {
                         instagram: Instagram,
                         twitter: Twitter,
                         youtube: Youtube,
                         linkedin: Linkedin,
                         facebook: Facebook,
                       }
                       const Icon = icons[link.platform] || Instagram
                       return (
                         <div
                           key={link.id}
                           className="flex items-center justify-between p-3 border rounded-lg"
                         >
                           <div className="flex items-center space-x-3">
                             <Icon className="w-5 h-5" />
                             <span className="capitalize font-medium">{link.platform}</span>
                             <a
                               href={link.url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-sm text-gray-500 hover:text-gray-700"
                             >
                               {link.url}
                             </a>
                           </div>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => deleteSocialLink(link.id)}
                           >
                             <Trash2 className="w-4 h-4 text-red-500" />
                           </Button>
                         </div>
                       )
                     })}
                   </div>
                 )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="space-y-6">
              {/* Add New Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                  <CardDescription>
                    Organize your links into categories for better presentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Social Media, Work Projects"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-color">Category Color</Label>
                      <Input
                        id="category-color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={addCategory} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Categories</CardTitle>
                  <CardDescription>
                    Manage your existing categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.categories?.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4 flex-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{category.name}</h3>
                              {category.isTopFinds && <Star className="w-4 h-4 text-yellow-500" />}
                              {!category.visible && <Badge variant="secondary">Hidden</Badge>}
                            </div>
                            <p className="text-sm text-gray-500">
                              {userData.links?.filter(link => link.categoryId === category.id).length || 0} links
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCategory(category.id, 'visible', !category.visible)}
                          >
                            {category.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          {!category.isTopFinds && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links">
            <div className="space-y-6">
              {/* Add New Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="link-title">Title</Label>
                      <Input
                        id="link-title"
                        value={newLink.title}
                        onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Link title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-url">URL</Label>
                      <Input
                        id="link-url"
                        value={newLink.url}
                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-description">Description (Optional)</Label>
                      <Input
                        id="link-description"
                        value={newLink.description}
                        onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-image">Image URL (Optional)</Label>
                      <Input
                        id="link-image"
                        value={newLink.imageUrl}
                        onChange={(e) => setNewLink(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link-category">Category</Label>
                      <Select
                        value={newLink.categoryId}
                        onValueChange={(value) => setNewLink(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Category</SelectItem>
                          {userData.categories?.filter(cat => !cat.isTopFinds).map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="link-icon">Icon</Label>
                      <Select
                        value={newLink.icon}
                        onValueChange={(value) => setNewLink(prev => ({ ...prev, icon: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="globe">Globe</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="mail">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="external">External Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="top-find"
                      checked={newLink.isTopFind}
                      onCheckedChange={(checked) => setNewLink(prev => ({ ...prev, isTopFind: checked }))}
                    />
                    <Label htmlFor="top-find">Mark as Top Find</Label>
                  </div>
                  <Button onClick={addLink} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Links</CardTitle>
                  <CardDescription>
                    Manage your existing links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.links?.map((link) => {
                      const category = userData.categories?.find(cat => cat.id === link.categoryId)
                      return (
                        <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4 flex-1">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{link.title}</h3>
                                {link.isTopFind && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                                {!link.visible && <Badge variant="secondary">Hidden</Badge>}
                                {category && (
                                  <Badge 
                                    variant="outline"
                                    style={{ borderColor: category.color, color: category.color }}
                                  >
                                    {category.name}
                                  </Badge>
                                )}
                                {clickCounts[link.id] && (
                                  <Badge variant="outline">
                                    {clickCounts[link.id]} clicks
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{link.url}</p>
                              {link.description && (
                                <p className="text-xs text-gray-400">{link.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLink(link.id, 'isTopFind', !link.isTopFind)}
                              title={link.isTopFind ? 'Remove from Top Finds' : 'Add to Top Finds'}
                            >
                              <Star className={`w-4 h-4 ${link.isTopFind ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLinkVisibility(link.id)}
                            >
                              {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              {/* Add New Product */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Amazon Affiliate Product</CardTitle>
                  <CardDescription>
                    Add products from Amazon to showcase on your page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {productErrors.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {productErrors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="product-url">Amazon Affiliate URL *</Label>
                      <Input
                        id="product-url"
                        value={newProduct.affiliateUrl}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, affiliateUrl: e.target.value }))}
                        placeholder="https://amazon.com/dp/XXXXXXXXXX"
                        className={!isAmazonUrl(newProduct.affiliateUrl) && newProduct.affiliateUrl ? 'border-red-300' : ''}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste your Amazon affiliate link here (must include your affiliate tag)
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="product-title">Product Title *</Label>
                      <Input
                        id="product-title"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Product Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="product-price">Price (Optional)</Label>
                      <Input
                        id="product-price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="$29.99"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="product-description">Description</Label>
                      <Textarea
                        id="product-description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the product"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="product-image">Product Image URL</Label>
                      <Input
                        id="product-image"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="product-category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      id="product-featured"
                      checked={newProduct.featured}
                      onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="product-featured">Mark as Featured Product</Label>
                  </div>
                  
                  <Button onClick={addProduct} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>
                    Manage your Amazon affiliate products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.products?.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        No products yet. Add your first Amazon product above!
                      </p>
                    )}
                    {userData.products?.map((product) => (
                      <div key={product.id} className="border rounded-lg overflow-hidden">
                        {editingProduct?.id === product.id ? (
                          // Edit Mode
                          <div className="p-4 bg-blue-50">
                            {productErrors.length > 0 && (
                              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
                                <ul className="text-sm text-red-600 list-disc list-inside">
                                  {productErrors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Product Title</Label>
                                <Input
                                  value={editingProduct.title}
                                  onChange={(e) => updateEditingProduct('title', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Price</Label>
                                <Input
                                  value={editingProduct.price}
                                  onChange={(e) => updateEditingProduct('price', e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Amazon URL</Label>
                                <Input
                                  value={editingProduct.affiliateUrl}
                                  onChange={(e) => updateEditingProduct('affiliateUrl', e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={editingProduct.description}
                                  onChange={(e) => updateEditingProduct('description', e.target.value)}
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label>Image URL</Label>
                                <Input
                                  value={editingProduct.imageUrl}
                                  onChange={(e) => updateEditingProduct('imageUrl', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Category</Label>
                                <Select
                                  value={editingProduct.category}
                                  onValueChange={(value) => updateEditingProduct('category', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productCategories.map(cat => (
                                      <SelectItem key={cat} value={cat}>
                                        {cat}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={editingProduct.featured}
                                  onCheckedChange={(checked) => updateEditingProduct('featured', checked)}
                                />
                                <Label>Featured</Label>
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={saveEditingProduct} size="sm">
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button onClick={cancelEditingProduct} variant="outline" size="sm">
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex items-start p-4">
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded mr-4"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-medium">{product.title}</h3>
                                    {product.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                                    {!product.visible && <Badge variant="secondary">Hidden</Badge>}
                                    <Badge variant="outline">{product.category}</Badge>
                                    {productClickCounts[product.id] > 0 && (
                                      <Badge variant="outline">
                                        {productClickCounts[product.id]} clicks
                                      </Badge>
                                    )}
                                  </div>
                                  {product.price && (
                                    <p className="text-lg font-bold text-green-600 mb-1">{product.price}</p>
                                  )}
                                  {product.description && (
                                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                  )}
                                  <p className="text-xs text-gray-400 truncate max-w-md">
                                    {product.affiliateUrl}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditingProduct(product)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateProduct(product.id, 'featured', !product.featured)}
                                    title={product.featured ? 'Remove from featured' : 'Mark as featured'}
                                  >
                                    <Star className={`w-4 h-4 ${product.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleProductVisibility(product.id)}
                                  >
                                    {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteProduct(product.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="space-y-6">
              {/* Background Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="background-type">Background Type</Label>
                    <Select
                      value={userData.profile.backgroundType}
                      onValueChange={(value) => updateProfile('backgroundType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="color">Solid Color</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {userData.profile.backgroundType !== 'image' && (
                    <div>
                      <Label htmlFor="background-color">Background Color</Label>
                      <Input
                        id="background-color"
                        type="color"
                        value={userData.profile.backgroundColor}
                        onChange={(e) => updateProfile('backgroundColor', e.target.value)}
                      />
                    </div>
                  )}
                  
                  {userData.profile.backgroundType === 'image' && (
                    <div>
                      <Label htmlFor="background-image">Background Image URL</Label>
                      <Input
                        id="background-image"
                        value={userData.profile.backgroundImage}
                        onChange={(e) => updateProfile('backgroundImage', e.target.value)}
                        placeholder="https://example.com/background.jpg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Announcement Bar */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Bell className="w-5 h-5 inline mr-2" />
                    Announcement Bar
                  </CardTitle>
                  <CardDescription>
                    Display a sticky announcement bar at the top of your page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="announcement-enabled"
                      checked={userData.announcement?.enabled || false}
                      onCheckedChange={(checked) => updateAnnouncement('enabled', checked)}
                    />
                    <Label htmlFor="announcement-enabled">Enable Announcement Bar</Label>
                  </div>
                  
                  {userData.announcement?.enabled && (
                    <>
                      <div>
                        <Label htmlFor="announcement-text">Announcement Text</Label>
                        <Input
                          id="announcement-text"
                          value={userData.announcement.text}
                          onChange={(e) => updateAnnouncement('text', e.target.value)}
                          placeholder="🎉 Check out our new products!"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="announcement-bg">Background Color</Label>
                          <Input
                            id="announcement-bg"
                            type="color"
                            value={userData.announcement.backgroundColor}
                            onChange={(e) => updateAnnouncement('backgroundColor', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="announcement-color">Text Color</Label>
                          <Input
                            id="announcement-color"
                            type="color"
                            value={userData.announcement.color}
                            onChange={(e) => updateAnnouncement('color', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="announcement-link">Link (Optional)</Label>
                        <Input
                          id="announcement-link"
                          value={userData.announcement.link}
                          onChange={(e) => updateAnnouncement('link', e.target.value)}
                          placeholder="https://example.com/promotion"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Add a link to make the announcement clickable
                        </p>
                      </div>
                      
                      {/* Preview */}
                      <div>
                        <Label>Preview</Label>
                        <div 
                          className="mt-2 p-3 rounded-lg text-center font-medium"
                          style={{
                            backgroundColor: userData.announcement.backgroundColor,
                            color: userData.announcement.color
                          }}
                        >
                          {userData.announcement.text || 'Your announcement will appear here'}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ad Settings Tab */}
          <TabsContent value="ads">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advertisement Settings</CardTitle>
                  <CardDescription>
                    Configure ad placements on your page (Google AdSense, Media.net, etc.)
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Top Ad Unit */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Ad Unit</CardTitle>
                  <CardDescription>
                    Displays at the top of your page, after the announcement bar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={userData.ads?.units?.find(u => u.id === 'top')?.enabled || false}
                      onCheckedChange={(checked) => updateAdUnit('top', 'enabled', checked)}
                    />
                    <Label>Enable Top Ad</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="ad-top-code">Ad Code</Label>
                    <Textarea
                      id="ad-top-code"
                      value={userData.ads?.units?.find(u => u.id === 'top')?.code || ''}
                      onChange={(e) => updateAdUnit('top', 'code', e.target.value)}
                      placeholder="Paste your ad network code here"
                      rows={6}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste the complete ad code from your ad network
                    </p>
                  </div>
                  
                  <AdUnitPreview code={userData.ads?.units?.find(u => u.id === 'top')?.code || ''} />
                </CardContent>
              </Card>

              {/* Middle Ad Unit */}
              <Card>
                <CardHeader>
                  <CardTitle>Middle Ad Unit</CardTitle>
                  <CardDescription>
                    Displays in the middle of your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={userData.ads?.units?.find(u => u.id === 'middle')?.enabled || false}
                      onCheckedChange={(checked) => updateAdUnit('middle', 'enabled', checked)}
                    />
                    <Label>Enable Middle Ad</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="ad-middle-code">Ad Code</Label>
                    <Textarea
                      id="ad-middle-code"
                      value={userData.ads?.units?.find(u => u.id === 'middle')?.code || ''}
                      onChange={(e) => updateAdUnit('middle', 'code', e.target.value)}
                      placeholder="Paste your ad network code here"
                      rows={6}
                      className="font-mono text-xs"
                    />
                  </div>
                  
                  <AdUnitPreview code={userData.ads?.units?.find(u => u.id === 'middle')?.code || ''} />
                </CardContent>
              </Card>

              {/* Bottom Ad Unit */}
              <Card>
                <CardHeader>
                  <CardTitle>Bottom Ad Unit</CardTitle>
                  <CardDescription>
                    Displays at the bottom of your page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={userData.ads?.units?.find(u => u.id === 'bottom')?.enabled || false}
                      onCheckedChange={(checked) => updateAdUnit('bottom', 'enabled', checked)}
                    />
                    <Label>Enable Bottom Ad</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="ad-bottom-code">Ad Code</Label>
                    <Textarea
                      id="ad-bottom-code"
                      value={userData.ads?.units?.find(u => u.id === 'bottom')?.code || ''}
                      onChange={(e) => updateAdUnit('bottom', 'code', e.target.value)}
                      placeholder="Paste your ad network code here"
                      rows={6}
                      className="font-mono text-xs"
                    />
                  </div>
                  
                  <AdUnitPreview code={userData.ads?.units?.find(u => u.id === 'bottom')?.code || ''} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Settings</CardTitle>
                  <CardDescription>
                    Configure tracking and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="analytics-enabled"
                      checked={userData.analytics?.enabled || false}
                      onCheckedChange={(checked) => updateAnalytics('enabled', checked)}
                    />
                    <Label htmlFor="analytics-enabled">Enable Google Analytics</Label>
                  </div>
                  
                  {userData.analytics?.enabled && (
                    <div>
                      <Label htmlFor="ga-id">Google Analytics ID</Label>
                      <Input
                        id="ga-id"
                        value={userData.analytics.googleAnalyticsId}
                        onChange={(e) => updateAnalytics('googleAnalyticsId', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Link Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Link Performance</CardTitle>
                  <CardDescription>
                    View click statistics for your links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.links?.map((link) => {
                      const category = userData.categories?.find(cat => cat.id === link.categoryId)
                      return (
                        <div key={link.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{link.title}</h4>
                              {link.isTopFind && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                              {category && (
                                <Badge 
                                  variant="outline"
                                  style={{ borderColor: category.color, color: category.color }}
                                >
                                  {category.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{link.url}</p>
                          </div>
                          <Badge variant="outline">
                            {clickCounts[link.id] || 0} clicks
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Product Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>
                    View click statistics for your affiliate products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.products?.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No products yet. Add products to see their performance.
                      </p>
                    ) : (
                      userData.products?.map((product) => (
                        <div key={product.id} className="flex justify-between items-center p-3 border rounded">
                          <div className="flex items-center space-x-3">
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.title}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{product.title}</h4>
                                {product.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                                <Badge variant="outline">{product.category}</Badge>
                              </div>
                              {product.price && (
                                <p className="text-sm text-green-600 font-medium">{product.price}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {productClickCounts[product.id] || 0} clicks
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : null}

        {/* Auth Modals */}
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => {}}
          onAuthSuccess={handleLoginSuccess}
        />

        {/* Session Warning Modal */}
        {showSessionWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-semibold">Session Expiring Soon</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your admin session will expire in {Math.floor(remainingTime / 60000)} minutes.
                Would you like to extend it?
              </p>
              <div className="flex gap-3">
                <Button onClick={handleLogout} variant="outline" className="flex-1">
                  Logout
                </Button>
                <Button onClick={handleExtendSession} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Extend Session
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Change Admin Password</h3>
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4">
                  {passwordError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowChangePasswordModal(false)
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordError('')
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} className="flex-1">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanelEnhanced
