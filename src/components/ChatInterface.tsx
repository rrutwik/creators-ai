import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { ProfileModal } from './ProfileModal';
import { HistoryModal } from './HistoryModal';
import { SettingsModal } from './SettingsModal';
import { AddCreditsModal } from './AddCreditsModal';
import { getAvailableBots, getPastChats, getChat } from '../api';
import type { ChatDetails, ReligiousBot, User } from '../interfaces';
import { useTranslation } from 'react-i18next';

interface ChatInterfaceProps {
  user: User | null;
  onLogout: () => void;
  religiousBots?: ReligiousBot[];
  onUserUpdated?: (user: User) => void;
}

export function ChatInterface({ user, onLogout, onUserUpdated }: ChatInterfaceProps) {
  const { t } = useTranslation();
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
  const [showAddCredits, setShowAddCredits] = useState(false);
  const scrollYRef = useRef(0);

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

  // Prevent background (chat) scrolling when mobile sidebar is open
  useEffect(() => {
    const body = document.body;
    if (isMobile && sidebarOpen) {
      // Save current scroll position and lock body
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      if (body.style.position === 'fixed') {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        body.style.overflow = '';
        window.scrollTo(0, scrollYRef.current || 0);
      }
    }

    // Cleanup on unmount
    return () => {
      if (body.style.position === 'fixed') {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        body.style.overflow = '';
        window.scrollTo(0, scrollYRef.current || 0);
      }
    };
  }, [isMobile, sidebarOpen]);

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

  const handleMessageSent = async (sessionUuid: string) => {
    try {
      // Fetch the updated chat session
      const response = await getChat(sessionUuid);
      const updatedChat = response.data;
      
      const chatDetails: ChatDetails = {
        _id: updatedChat.uuid,
        name: updatedChat.name,
        chatbot_id: updatedChat.chatbot_id,
        uuid: updatedChat.uuid,
        updatedAt: new Date().toISOString()
      };
      
      if (!selectedChat) {
        setSelectedChat(chatDetails);
        setChatHistory(prev => [chatDetails, ...prev]);
      } else {
        // Update existing chat in history
        setChatHistory(prev => 
          prev.map(chat => 
            chat.uuid === sessionUuid 
              ? { ...chat, updatedAt: new Date().toISOString() }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error updating chat session:', error);
    }
  };

  if (religiousBots.length === 0 || loadingChatHistory) {
    return (
      <div className="flex h-screen bg-background relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('chat.loadingGuides')}</p>
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
            onMessageSent={handleMessageSent}
            onRequireAddCredits={() => user && setShowAddCredits(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🙏</div>
              <h2 className="text-2xl font-semibold mb-2">{t('chat.welcomeTitle')}</h2>
              <p className="text-muted-foreground mb-4">{t('chat.welcomeBody')}</p>
              <button
                onClick={handleToggleSidebar}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {t('chat.chooseGuide')}
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
          onUserUpdated={onUserUpdated}
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

      {showAddCredits && user && (
        <AddCreditsModal
          user={user}
          open={showAddCredits}
          onClose={() => setShowAddCredits(false)}
        />
      )}
    </div>
  );
}