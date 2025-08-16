import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { ProfileModal } from './ProfileModal';
import { HistoryModal } from './HistoryModal';
import { SettingsModal } from './SettingsModal';
import { getAvailableBots, getPastChats } from '../api';
import type { ChatDetails, ReligiousBot, User } from '../interfaces';

interface ChatInterfaceProps {
  user: User | null;
  onLogout: () => void;
  religiousBots?: ReligiousBot[];
}

export function ChatInterface({ user, onLogout }: ChatInterfaceProps) {
  const [religiousBots, setReligiousBots] = useState<ReligiousBot[]>([]);
  const [selectedBot, setSelectedBot] = useState<ReligiousBot | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatDetails | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatDetails[]>([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(true);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const bots = await getAvailableBots(); // Your API call
        setReligiousBots(bots.records);
      } catch (error) {
        console.error('Failed to fetch bots:', error);
      }
    };
    
    fetchBots();
  }, []);

  useEffect(() => {
    console.log("Selected Bot: ", selectedBot);
    console.log("Selected Chat: ", selectedChat);
  }, [selectedBot, selectedChat]);

  const handleToggleSidebar = () => {
    console.log("Sidebar Open: ", sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await getPastChats(0, 10000);
        setChatHistory(response.data);
        setLoadingChatHistory(false);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, []);

  if (religiousBots.length === 0 || loadingChatHistory) {
    return (
      <div className="flex h-screen bg-background relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading spiritual guides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed z-50' : 'relative'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        ${isMobile ? 'h-full' : 'h-screen'}
      `}>
        <Sidebar
          user={user}
          selectedBot={selectedBot}
          selectedChat={selectedChat}
          religiousBots={religiousBots}
          chatHistory={chatHistory}
          onSelectBot={(bot) => {
            setSelectedBot(bot);
            setSelectedChat(null);
            handleCloseSidebar();
          }}
          onShowProfile={() => {
            setShowProfile(true);
            handleCloseSidebar();
          }}
          onShowHistory={() => {
            setShowHistory(true);
            handleCloseSidebar();
          }}
          onShowSettings={() => {
            setShowSettings(true);
            handleCloseSidebar();
          }}
          onSelectChat={(chat) => {
            const bot = religiousBots.find((bot) => bot._id === chat.chatbot_id._id);
            setSelectedBot(bot || null);
            console.log("Selected Bot: ", bot);
            console.log("Selected Chat: ", chat);
            setSelectedChat(chat);
            handleCloseSidebar();
          }}
          onLogout={onLogout}
          collapsed={true}
          onToggleCollapse={handleCloseSidebar}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {selectedBot ? (
          <ChatWindow 
            selectedBot={selectedBot}
            selectedChat={selectedChat}
            onToggleSidebar={handleToggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🙏</div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to Spiritual Guidance</h2>
              <p className="text-muted-foreground mb-4">
                Select a spiritual guide from the sidebar to begin your journey of wisdom and enlightenment.
              </p>
              <button
                onClick={handleToggleSidebar}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Choose a Guide
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showHistory && (
        <HistoryModal
          onClose={() => setShowHistory(false)}
          chatHistory={chatHistory}
          religiousBots={religiousBots}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}