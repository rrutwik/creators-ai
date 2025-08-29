import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Volume2, 
  Download,
  Trash2,
  Info
} from 'lucide-react';
import { type THEME_MODES } from '../utils/consts';

interface SettingsModalProps {
  onClose: () => void;
  theme: THEME_MODES;
  setTheme: (theme: THEME_MODES) => void;
}

export function SettingsModal({ onClose, theme, setTheme }: SettingsModalProps) {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [dataRetention, setDataRetention] = useState('1year');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your CreatorsAI experience
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="appearance" className="h-11 text-xs sm:text-sm">Appearance</TabsTrigger>
            {/* <TabsTrigger disabled={true} onMouseEnter={() => {}} onMouseLeave={() => {}} value="notifications" className="h-11 text-xs sm:text-sm">Notifications</TabsTrigger>
            <TabsTrigger disabled={true} value="privacy" className="h-11 text-xs sm:text-sm">Privacy</TabsTrigger>
            <TabsTrigger disabled={true} value="data" className="h-11 text-xs sm:text-sm">Data</TabsTrigger> */}
          </TabsList>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="appearance" className="space-y-6 mt-6">
              <div className="space-y-6">
                <h4 className="font-medium">Display Settings</h4>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1 flex-1">
                    <Label className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                </div>

                <Separator className='hidden'/>

                <div className="hidden flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1 flex-1">
                    <Label className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Sound Effects
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable message sounds and notifications
                    </p>
                  </div>
                  <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="space-y-6">
                <h4 className="font-medium">Notification Preferences</h4>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1 flex-1">
                    <Label className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new messages
                    </p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="space-y-4">
                  <Label>Notification Types</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">New spiritual guidance</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Daily inspiration</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Weekly wisdom digest</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">System updates</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <h4 className="font-medium">Privacy & Security</h4>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Your Privacy Matters</p>
                      <p className="text-sm text-muted-foreground">
                        CreatorsAI is designed with privacy in mind. Your conversations are encrypted 
                        and we never share personal spiritual discussions with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1 flex-1">
                    <Label>Auto-save Conversations</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save chat history for future reference
                    </p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="space-y-4">
                  <Label>Data Retention Period</Label>
                  <Select value={dataRetention} onValueChange={setDataRetention}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="forever">Keep Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-green-700">Account Status</Label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
                        Verified
                      </Badge>
                      <span className="text-sm text-muted-foreground">End-to-end encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6 mt-6">
              <div className="space-y-6">
                <h4 className="font-medium">Data Management</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">42</div>
                    <div className="text-sm text-muted-foreground">Total Conversations</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">2.3MB</div>
                    <div className="text-sm text-muted-foreground">Storage Used</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h5 className="font-medium">Export & Backup</h5>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-11 touch-manipulation">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Conversations
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-11 touch-manipulation">
                      <Download className="w-4 h-4 mr-2" />
                      Download Personal Data
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h5 className="font-medium text-destructive">Danger Zone</h5>
                  <div className="space-y-3">
                    <Button variant="destructive" className="w-full justify-start h-11 touch-manipulation">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Conversations
                    </Button>
                    <Button variant="destructive" className="w-full justify-start h-11 touch-manipulation">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="h-11 touch-manipulation">
            Close
          </Button>
          {/* <Button className="h-11 touch-manipulation">
            Save Changes
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}