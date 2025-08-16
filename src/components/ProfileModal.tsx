import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Edit, Mail, Calendar, Shield } from 'lucide-react';
import type { User } from '../interfaces';

interface ProfileModalProps {
  user: User | null;
  onClose: () => void;
}

export function ProfileModal({ user, onClose }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.first_name || '');

  if (!user) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Manage your CreatorsAI account settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.first_name.charAt(10)} />
              <AvatarFallback className="text-xl">{user.first_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified User
            </Badge>
          </div>

          <Separator />

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="flex items-center gap-2">
                Display Name
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-7 px-2 touch-manipulation"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 h-11 touch-manipulation"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      // In real app, save to backend
                    }}
                    className="h-11 touch-manipulation"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <span>{user.first_name}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-sm break-all">{user.email}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-sm">January 2024</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">42</div>
              <div className="text-xs text-muted-foreground">Conversations</div>
            </div>
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-xs text-muted-foreground">Guides Met</div>
            </div>
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">128</div>
              <div className="text-xs text-muted-foreground">Questions Asked</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 h-11 touch-manipulation" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1 h-11 touch-manipulation">
              Edit Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}