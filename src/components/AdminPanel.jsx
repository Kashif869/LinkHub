import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Eye, EyeOff, GripVertical, BarChart3, Settings, Palette, Link as LinkIcon } from 'lucide-react'

function AdminPanel({ userData, setUserData }) {
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    icon: 'external'
  })

  const updateProfile = (field, value) => {
    setUserData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }))
  }

  const updateAds = (field, value) => {
    setUserData(prev => ({
      ...prev,
      ads: {
        ...prev.ads,
        [field]: value
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

  const addLink = () => {
    if (newLink.title && newLink.url) {
      const link = {
        ...newLink,
        id: Date.now(),
        visible: true
      }
      setUserData(prev => ({
        ...prev,
        links: [...prev.links, link]
      }))
      setNewLink({ title: '', url: '', description: '', icon: 'external' })
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

  const getClickCounts = () => {
    const savedCounts = localStorage.getItem('linkClickCounts')
    return savedCounts ? JSON.parse(savedCounts) : {}
  }

  const clickCounts = getClickCounts()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            View Public Page
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="monetization" className="flex items-center gap-2">
              💰
              Monetization
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
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
                    {userData.links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4 flex-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{link.title}</h3>
                              {!link.visible && <Badge variant="secondary">Hidden</Badge>}
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
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
          </TabsContent>

          {/* Monetization Tab */}
          <TabsContent value="monetization">
            <Card>
              <CardHeader>
                <CardTitle>Monetization Settings</CardTitle>
                <CardDescription>
                  Configure advertising and monetization options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ads-enabled"
                    checked={userData.ads.enabled}
                    onCheckedChange={(checked) => updateAds('enabled', checked)}
                  />
                  <Label htmlFor="ads-enabled">Enable Advertisements</Label>
                </div>
                
                {userData.ads.enabled && (
                  <>
                    <div>
                      <Label htmlFor="ad-placement">Ad Placement</Label>
                      <Select
                        value={userData.ads.placement}
                        onValueChange={(value) => updateAds('placement', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top of Page</SelectItem>
                          <SelectItem value="middle">Middle of Page</SelectItem>
                          <SelectItem value="bottom">Bottom of Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="ad-code">Ad Code</Label>
                      <Textarea
                        id="ad-code"
                        value={userData.ads.adCode}
                        onChange={(e) => updateAds('adCode', e.target.value)}
                        placeholder="Paste your ad network code here (e.g., Google AdSense code)"
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste the complete ad code from your ad network (Google AdSense, Media.net, etc.)
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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
                      checked={userData.analytics.enabled}
                      onCheckedChange={(checked) => updateAnalytics('enabled', checked)}
                    />
                    <Label htmlFor="analytics-enabled">Enable Google Analytics</Label>
                  </div>
                  
                  {userData.analytics.enabled && (
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

              <Card>
                <CardHeader>
                  <CardTitle>Link Performance</CardTitle>
                  <CardDescription>
                    View click statistics for your links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.links.map((link) => (
                      <div key={link.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{link.title}</h4>
                          <p className="text-sm text-gray-500">{link.url}</p>
                        </div>
                        <Badge variant="outline">
                          {clickCounts[link.id] || 0} clicks
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPanel
