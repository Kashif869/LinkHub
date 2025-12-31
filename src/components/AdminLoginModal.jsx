import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lock, AlertCircle } from 'lucide-react'
import {
  setAdminPassword,
  hasAdminPassword,
  login,
} from '@/utils/authUtils'

export function AdminLoginModal({ isOpen, onClose, onAuthSuccess }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isNewPassword, setIsNewPassword] = useState(!hasAdminPassword())
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isNewPassword) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }

        await setAdminPassword(password)
        onAuthSuccess()
      } else {
        await login(password)
        onAuthSuccess()
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5" />
            {isNewPassword ? 'Set Admin Password' : 'Admin Login'}
          </DialogTitle>
          <DialogDescription>
            {isNewPassword
              ? 'Create a secure password to protect your admin panel'
              : 'Enter your password to access the admin panel'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">
              {isNewPassword ? 'New Password' : 'Password'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isNewPassword ? 'Enter a secure password' : 'Enter your password'}
              autoComplete={isNewPassword ? 'new-password' : 'current-password'}
              required
              disabled={isLoading}
            />
          </div>

          {isNewPassword && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
            {isNewPassword ? (
              <p>Password must be at least 6 characters long.</p>
            ) : (
              <p>Session expires after 30 minutes of inactivity.</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? isNewPassword
                ? 'Creating password...'
                : 'Verifying...'
              : isNewPassword
                ? 'Set Password'
                : 'Login'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
