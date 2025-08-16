import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Plus, 
  LogOut, 
  X,
  MessageCircle
} from 'lucide-react';
import type { ChatDetails, ReligiousBot, User } from '../interfaces';

interface SidebarProps {
  user: User | null;
  selectedBot: ReligiousBot | null;
  selectedChat: ChatDetails | null;
  religiousBots: ReligiousBot[];
  chatHistory: ChatDetails[];
  onSelectBot: (bot: ReligiousBot) => void;
  onSelectChat: (chat: ChatDetails) => void;
  onShowProfile: () => void;
  onShowHistory: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  user,
  selectedBot,
  selectedChat,
  onSelectBot,
  onSelectChat,
  religiousBots,
  chatHistory,
  onShowProfile,
  onShowHistory,
  onShowSettings,
  onLogout,
  onToggleCollapse,
  isMobile = false
}: SidebarProps) {
  const [activeSection, setActiveSection] = useState<'bots' | 'history'>('bots');
  const formatTime = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };
  return (
    <div className={`${isMobile ? 'w-80' : 'w-80 lg:w-80'} bg-sidebar border-r border-sidebar-border flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-sidebar-foreground">CreatorsAI</h1>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button className="w-full mt-3 bg-primary hover:bg-primary/90 h-11 touch-manipulation">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex space-x-1">
          <Button
            variant={activeSection === 'bots' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('bots')}
            className="flex-1 h-10 touch-manipulation"
          >
            Religious Guides
          </Button>
          <Button
            variant={activeSection === 'history' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('history')}
            className="flex-1 h-10 touch-manipulation"
          >
            History
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 px-4 py-4">
        {activeSection === 'bots' ? (
          <div className="space-y-3">
            {religiousBots.map((bot) => (
              <div>
              <Button
                key={bot.id}
                variant={selectedBot?.id === bot.id ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-4 touch-manipulation"
                onClick={() => onSelectBot(bot)}
              >
                { selectedChat?.chatbot_id._id === bot._id ? <Plus className="w-4 h-4" onClick={() => onSelectBot(bot)} /> : null}
                <div className="flex items-center space-x-3 w-full">
                  <span className="text-2xl flex-shrink-0">{bot.avatar}</span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm truncate">{bot.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{bot.religion}</div>
                  </div>
                </div>
              </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {chatHistory.map((chat) => {
              const bot = religiousBots.find(b => b._id === chat.chatbot_id._id);
              return (
                console.log(chat?._id, selectedChat?._id, chat?._id === selectedChat?._id),
                <Button
                  key={chat._id}
                  variant={chat?._id === selectedChat?._id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-4 touch-manipulation"
                  onClick={() => onSelectChat(chat)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <MessageCircle className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm truncate">{chat.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {bot?.name} • {formatTime(chat.updatedAt)}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        {/* <Button
          variant="ghost"
          className="w-full justify-start p-3 mb-3 h-auto touch-manipulation"
          onClick={onShowProfile}
        >
          <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
            <AvatarImage src={user?.first_name.charAt(0)} />
            <AvatarFallback>{user?.first_name?.charAt(20)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium truncate">{user?.first_name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </Button> */}
        
        <div className="grid grid-cols-3 gap-2">
          {/* <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col h-12 p-2 touch-manipulation" 
            onClick={onShowHistory}
          >
            <History className="w-4 h-4 mb-1" />
            <span className="text-xs">History</span>
          </Button> */}
          {/* <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col h-12 p-2 touch-manipulation" 
            onClick={onShowSettings}
          >
            <Settings className="w-4 h-4 mb-1" />
            <span className="text-xs">Settings</span>
          </Button> */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col h-12 p-2 touch-manipulation" 
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mb-1" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}