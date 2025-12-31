import { useState } from 'react'
import { User, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AVATAR_STYLES = [
  'avataaars',
  'adventurer',
  'big-smile',
  'bottts',
  'fun-emoji',
  'lorelei',
  'micah',
  'notionists',
  'open-peeps',
  'personas',
  'pixel-art',
  'shapes',
]

const getRandomSeed = () => Math.random().toString(36).substring(7)
const getRandomStyle = () => AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)]

export function Avatar({ avatarUrl, name, size = 'lg', onAvatarChange, showRandomButton = true }) {
  const [showModal, setShowModal] = useState(false)
  const [customAvatar, setCustomAvatar] = useState(avatarUrl || '')
  const [randomAvatars, setRandomAvatars] = useState([])

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  }

  const avatarStyle = avatarUrl || (name ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}` : null)

  const generateRandomAvatars = () => {
    const avatars = Array.from({ length: 8 }, () => ({
      style: getRandomStyle(),
      seed: getRandomSeed(),
      url: ''
    }))

    setRandomAvatars(avatars)
  }

  const handleSelectRandomAvatar = (avatar) => {
    const url = `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}`
    setCustomAvatar(url)
    if (onAvatarChange) {
      onAvatarChange(url)
    }
    setShowModal(false)
  }

  const handleCustomAvatar = () => {
    if (customAvatar && onAvatarChange) {
      onAvatarChange(customAvatar)
    }
    setShowModal(false)
  }

  const handleGenerateNew = () => {
    if (name) {
      const newSeed = getRandomSeed()
      const newStyle = getRandomStyle()
      const url = `https://api.dicebear.com/7.x/${newStyle}/svg?seed=${newSeed}`
      setCustomAvatar(url)
      if (onAvatarChange) {
        onAvatarChange(url)
      }
    }
  }

  const openModal = () => {
    setCustomAvatar(avatarUrl || '')
    generateRandomAvatars()
    setShowModal(true)
  }

  return (
    <>
      <div className={`${sizeClasses[size]} relative group`}>
        {avatarStyle ? (
          <img
            src={avatarStyle}
            alt={name || 'Avatar'}
            className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}

        {!avatarStyle && (
          <div className="w-full h-full rounded-full bg-gray-200 ring-4 ring-white shadow-lg flex items-center justify-center hidden">
            <User className="w-1/2 h-1/2 text-gray-400" />
          </div>
        )}

        {showRandomButton && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleGenerateNew}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
            <DialogDescription>
              Select from random options or enter a custom avatar URL
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Random Avatars Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Random Avatars</h3>
                <Button variant="outline" size="sm" onClick={generateRandomAvatars}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate More
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {randomAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectRandomAvatar(avatar)}
                    className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}`}
                      alt={`Avatar ${index + 1}`}
                      className="w-full aspect-square rounded-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Avatar URL */}
            <div>
              <Label htmlFor="custom-avatar">Custom Avatar URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="custom-avatar"
                  value={customAvatar}
                  onChange={(e) => setCustomAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                <Button onClick={handleCustomAvatar}>Save</Button>
              </div>
              {customAvatar && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={customAvatar}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/128?text=Invalid+URL'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
