import { useState, useEffect, useRef, memo } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { ChatWindow } from './ChatWindow';
import { ProfileModal } from '../../auth/components/ProfileModal';
import { HistoryModal } from '../../settings/components/HistoryModal';
import { SettingsModal } from '../../settings/components/SettingsModal';
import { AddCreditsModal } from '../../settings/components/AddCreditsModal';
import { getAvailableBots, getPastChats, getChatSession, getUserDetails, renameChat, deleteChat } from '../../../services/api';
import type { ChatDetails, ReligiousBot, User } from '../../../types/interfaces';
import { useTranslation } from 'react-i18next';
import type { THEME_MODES } from '../../../utils/consts';
import * as Sentry from "@sentry/react";
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Menu } from 'lucide-react';

// History is loaded one page at a time (it used to ask for 10,000 chats on every open).
const HISTORY_PAGE_SIZE = 30;

interface ChatInterfaceProps {
  user: User | null;
  language: string;
  theme: THEME_MODES;
  setTheme: (theme: THEME_MODES) => void;
  onLogout: () => void;
  religiousBots?: ReligiousBot[];
  onUserUpdated?: (user: User) => void;
}

const ChatInterface = memo(function ChatInterface({ user, onLogout, onUserUpdated, theme, setTheme, language }: ChatInterfaceProps) {
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

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [loadingMoreHistory, setLoadingMoreHistory] = useState(false);

  // Guides and history load together. If either fails the user gets an error with a Retry button
  // instead of an endless spinner.
  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    const loadInitialData = async () => {
      try {
        const [bots, history] = await Promise.all([
          getAvailableBots(),
          getPastChats(0, HISTORY_PAGE_SIZE),
        ]);
        if (cancelled) return;
        setReligiousBots(bots.records);
        setChatHistory(history.data);
        setHistoryTotal(history.total);
        setLoadingChatHistory(false);
      } catch (error) {
        if (cancelled) return;
        Sentry.captureException(error, { extra: { user } });
        console.error('Failed to load guides or chat history:', error);
        setLoadError(true);
      }
    };
    loadInitialData();
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  const handleLoadMoreHistory = async () => {
    setLoadingMoreHistory(true);
    try {
      const page = await getPastChats(chatHistory.length, HISTORY_PAGE_SIZE);
      setChatHistory((prev) => [...prev, ...page.data.filter((c) => !prev.some((p) => p.uuid === c.uuid))]);
      setHistoryTotal(page.total);
    } catch (error) {
      Sentry.captureException(error, { extra: { user } });
      toast.error(t('chat.historyLoadFailed', { defaultValue: "Couldn't load more chats. Please try again." }));
    } finally {
      setLoadingMoreHistory(false);
    }
  };

  // Re-read the user's credits (they drop when a message is sent and come back if the reply fails).
  const refreshCredits = async () => {
    try {
      const fresh = await getUserDetails(true);
      onUserUpdated?.(fresh);
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setSidebarOpen(false);
  };

  const handleRenameChat = async (chat: ChatDetails, name: string) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === chat.name) return;
    try {
      await renameChat(chat.uuid, trimmed);
      setChatHistory((prev) => prev.map((c) => (c.uuid === chat.uuid ? { ...c, name: trimmed } : c)));
      setSelectedChat((prev) => (prev?.uuid === chat.uuid ? { ...prev, name: trimmed } : prev));
    } catch (error) {
      Sentry.captureException(error, { extra: { user } });
      toast.error(t('chat.renameFailed', { defaultValue: "Couldn't rename the chat. Please try again." }));
    }
  };

  const handleDeleteChat = async (chat: ChatDetails) => {
    try {
      await deleteChat(chat.uuid);
      setChatHistory((prev) => prev.filter((c) => c.uuid !== chat.uuid));
      setHistoryTotal((total) => Math.max(0, total - 1));
      if (selectedChat?.uuid === chat.uuid) setSelectedChat(null);
    } catch (error) {
      Sentry.captureException(error, { extra: { user } });
      toast.error(t('chat.deleteFailed', { defaultValue: "Couldn't delete the chat. Please try again." }));
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleBotSelect = (bot: ReligiousBot) => {
    setSelectedBot(bot);
    setSelectedChat(null);
    setSidebarOpen(false);
  };

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

  const handleMessageSent = async (sessionUuid: string) => {
    try {
      // Fetch the updated chat session
      const response = await getChatSession(sessionUuid);
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
        setChatHistory(prev =>
          prev.map(chat =>
            chat.uuid === sessionUuid
              ? { ...chat, updatedAt: new Date().toISOString() }
              : chat
          )
        );
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          user,
        },
      });
      console.error('Error updating chat session:', error);
    }
  };

  if (loadError) {
    return (
      <div className="flex h-dvh bg-background relative">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm" role="alert">
            <div className="text-5xl mb-4" aria-hidden="true">🙏</div>
            <h2 className="text-xl font-semibold mb-2">{t('chat.loadFailedTitle', { defaultValue: "We couldn't load your guides" })}</h2>
            <p className="text-muted-foreground mb-6">
              {t('chat.loadFailedBody', { defaultValue: 'Please check your connection and try again.' })}
            </p>
            <Button onClick={() => { setLoadingChatHistory(true); setLoadAttempt((n) => n + 1); }}>
              {t('chat.retry', { defaultValue: 'Try again' })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (religiousBots.length === 0 || loadingChatHistory) {
    return (
      <div className="flex h-dvh bg-background relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" role="status">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('chat.loadingGuides')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh bg-background relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed z-50' : 'relative'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        ${isMobile ? 'h-full' : 'h-dvh'}
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
            setSelectedChat(chat);
            handleCloseSidebar();
          }}
          onShowAddCredits={() => {
            setShowAddCredits(true);
            handleCloseSidebar();
          }}
          onLogout={onLogout}
          collapsed={true}
          onToggleCollapse={handleCloseSidebar}
          isMobile={isMobile}
          onNewChat={handleNewChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          hasMoreHistory={chatHistory.length < historyTotal}
          loadingMoreHistory={loadingMoreHistory}
          onLoadMoreHistory={handleLoadMoreHistory}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-dvh">
        {selectedBot ? (
          <ChatWindow
            credits={user?.credits}
            onCreditsChanged={refreshCredits}
            selectedBot={selectedBot}
            selectedChat={selectedChat}
            onToggleSidebar={handleToggleSidebar}
            onLogout={onLogout}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            onMessageSent={handleMessageSent}
            onRequireAddCredits={() => user && setShowAddCredits(true)}
          />
        ) : (
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 md:p-8 relative">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 w-10 h-10 touch-manipulation"
                onClick={handleToggleSidebar}
                aria-label={t('chat.openMenu', { defaultValue: 'Open menu' })}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="text-center w-full max-w-2xl">
              <div className="text-6xl mb-4" aria-hidden="true">🙏</div>
              <h2 className="text-2xl font-semibold mb-2">{t('chat.welcomeTitle')}</h2>
              <p className="text-muted-foreground mb-6">{t('chat.welcomeBody')}</p>
              {/* Guides as cards: one tap to start, instead of "choose a guide from the left" */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {religiousBots.map((bot) => (
                  <li key={bot._id}>
                    <button
                      onClick={() => handleBotSelect(bot)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring transition-colors touch-manipulation"
                    >
                      <span className="text-3xl flex-shrink-0" aria-hidden="true">{bot.avatar}</span>
                      <span className="min-w-0">
                        <span className="block font-medium truncate">{bot.name}</span>
                        <span className="block text-sm text-muted-foreground line-clamp-2">{bot.description}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProfile && (
        <ProfileModal
          user={user}
          language={language}
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
          theme={theme}
          setTheme={setTheme}
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
});

export default ChatInterface;