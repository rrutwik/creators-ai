import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Edit, Mail, Calendar, Shield, Languages } from 'lucide-react';
import type { User } from '../interfaces';
import { avatarSrc } from '../utils';
import { useTranslation } from 'react-i18next';
import { updateProfile } from '../utils/api';
import { SUPPORTED_LANGUAGES } from '../utils/consts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ProfileModalProps {
  user: User | null;
  language: string;
  onClose: () => void;
  onUserUpdated?: (user: User) => void;
}

export function ProfileModal({ user, onClose, onUserUpdated, language: selectedLanguage }: ProfileModalProps) {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.first_name || '');
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [language, setLanguage] = useState<string>(user?.language || selectedLanguage);

  if (!user) return null;

  const memberSinceMondayYearString = (date: string) => {
    const _date = new Date(date);
    const day = _date.toLocaleString('en-us', { weekday: 'long' });
    const month = _date.toLocaleString('en-us', { month: 'long' });
    const year = _date.getFullYear();
    return `${day}, ${month} ${_date.getDate()}, ${year}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('profile.title')}</DialogTitle>
          <DialogDescription className='text-xs'>
            {t('profile.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatarSrc(user?.avatar)} />
              <AvatarFallback className="text-xl">{user?.first_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-2 h-2" />
              {t('profile.verifiedUser')}
            </Badge>
          </div>

          <Separator />

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="flex items-center gap-2">
                {t('profile.displayName')}
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
                    {t('profile.save')}
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
                {t('profile.emailAddress')}
              </Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-sm break-all">{user.email}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('profile.memberSince')}
              </Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-sm">{memberSinceMondayYearString(user?.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {t('profile.language')}
              </Label>
              <Select value={language} onValueChange={async (newLang) => {
                setLanguage(newLang);
                try {
                  await updateProfile({ language: newLang });
                } catch (err) {
                  // ignore errors in UI for now
                }
                void i18n.changeLanguage(newLang);
                onUserUpdated?.({ ...user, language: newLang });
              }}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select language" defaultValue={language} />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{t(`profile.language_${lang.code}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Stats
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
          </div> */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 h-11 touch-manipulation" onClick={onClose}>
              {t('common.close')}
            </Button>
            {/* <Button className="flex-1 h-11 touch-manipulation">
              Edit Profile
            </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}