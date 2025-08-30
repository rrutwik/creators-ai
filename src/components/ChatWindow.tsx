import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Menu, MoreVertical, ArrowLeft, LogOut } from 'lucide-react';
import { MessageRole, type ChatDetails, type ChatMessage, type ChatSession, type ReligiousBot } from '../interfaces';
import { MessageList } from "./MessageList";
import { getChatSession, sendMessage } from '../utils/api';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

interface ChatWindowProps {
  selectedBot: ReligiousBot;
  selectedChat: ChatDetails | null;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onMessageSent: (sessionUuid: string) => void;
  sidebarOpen: boolean;
  isMobile: boolean;
  onRequireAddCredits: () => void;
}

export function ChatWindow({ selectedBot, selectedChat, onToggleSidebar, onLogout, isMobile, sidebarOpen, onMessageSent, onRequireAddCredits }: ChatWindowProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [streamingTextIndex, setStreamingTextIndex] = useState(0);
  const lastAssistantMessage = useRef<ChatMessage>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout>(null);
  const typingInterval = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!selectedChat) {
      setIsTyping(false);
      setMessages([]);
      return;
    }
    const fetchChat = async () => {
      try {
        const response = await getChatSession(selectedChat.uuid);
        lastAssistantMessage.current = null;
        const messages = response.data.messages;
        if (response.data.can_message == false) {
          setIsTyping(true);
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.role == MessageRole.ASSISTANT) {
            setMessages(messages.slice(0, messages.length - 1));
            setStreamingTextIndex(0);
            lastAssistantMessage.current = lastMessage;
          } else {
            setMessages(messages);
          }
          startPolling(selectedChat.uuid);
        } else {
          setIsTyping(false);
          setMessages(messages);
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };
    fetchChat();
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
      setIsTyping(false);
      setMessages([]);
      setStreamingText('');
      setStreamingTextIndex(0);
      lastAssistantMessage.current = null;
    };
  }, [selectedChat]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) return;
    setMessages([]);
  }, [selectedBot]);

  const fetchNewMessages = useCallback(async (chatId: string): Promise<ChatSession | null> => {
    try {
      const response = await getChatSession(chatId);
      const data = response.data;
      const chatSession = data;
      return chatSession;
    } catch (error) {
      console.error('Error fetching new messages:', error);
      return null;
    }
  }, []);

  const startPolling = useCallback(
    async (chatUuid: string) => {
      console.log('Starting polling for chat', chatUuid);
      pollingInterval.current = setInterval(async () => {
        const chatSession = await fetchNewMessages(chatUuid);

        if (!chatSession) {
          console.error('Error fetching new messages');
          clearInterval(pollingInterval.current!);
          pollingInterval.current = null;
          return;
        }
        const lastMessage = chatSession.messages[chatSession.messages.length - 1];
        lastAssistantMessage.current = lastMessage;
        if (chatSession.can_message == true) {
          console.log('Chat session can_message', chatSession.can_message);
          clearInterval(pollingInterval.current!);
          pollingInterval.current = null;
        }
      }, 5000);
      return () => {
        if (pollingInterval.current) {
          console.log('clearing pollingInterval.current');
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      };
    },
    [fetchNewMessages]
  );

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    let updatedSession: ChatSession;
    try {
      try {
        const response = await sendMessage(inputValue, selectedChat?.uuid, selectedBot?._id);
        updatedSession = response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && (error as any).response?.status === 400 && (error as any).response?.data?.status === '1000') {
          onRequireAddCredits();
          return;
        }
        throw error;
      }

      const userMessage = updatedSession.messages.pop();
      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);
      }
      setIsTyping(true);
      setInputValue('');
      onMessageSent(updatedSession.uuid);
      startPolling(updatedSession.uuid);
    } catch (error: any) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  useEffect(() => {
    if (!lastAssistantMessage.current) return;
    setStreamingText(lastAssistantMessage.current.text.slice(0, streamingTextIndex));
  }, [streamingTextIndex]);

  useEffect(() => {
    if (!typingInterval.current && isTyping) {
      typingInterval.current = setInterval(() => {
        const lastMessage = lastAssistantMessage.current;
        if (lastMessage && lastMessage.text.length > streamingTextIndex) {
          setStreamingTextIndex((prev) => {
            const newIndex = prev + 1;
            if (newIndex >= lastMessage.text.length) {
              if (pollingInterval.current == null) {
                setIsTyping(false);
                setMessages((prev) => {
                  const newMessages = [...prev, lastMessage];
                  return newMessages;
                });
                lastAssistantMessage.current = null;
                setStreamingTextIndex(0);
                if (typingInterval.current) {
                  clearInterval(typingInterval.current);
                  typingInterval.current = null;
                }
              }
              return prev;
            }
            return newIndex;
          });
        }
      }, 50); // Reduced interval for smoother typing
    }

    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
    };
  }, [isTyping, streamingTextIndex]);

  return (
    <div className="flex flex-col h-full max-h-screen min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center justify-between min-h-[72px] flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {isMobile && <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleSidebar()}
            className="w-10 h-10 touch-manipulation flex-shrink-0"
          >
            {sidebarOpen ? <ArrowLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>}
          <span className="text-2xl flex-shrink-0" title={selectedBot.greeting}>{selectedBot.avatar}</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold truncate text-base" title={selectedBot.greeting}>{selectedBot.name}</h2>
            <p className="text-sm text-muted-foreground truncate">{selectedBot.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* <div className="hidden sm:flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Assistant
          </div> */}
          {/* <Button variant="ghost" size="icon" className="w-10 h-10 touch-manipulation">
            <MoreVertical className="w-4 h-4" />
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 touch-manipulation">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onSelect={onLogout}>
                <LogOut className="w-4 h-4" /> {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 && !isTyping && (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">{selectedBot.avatar}</div>
                <h3 className="text-xl font-semibold mb-2">{selectedBot.name}</h3>
                <p className="text-muted-foreground mb-4">{selectedBot.greeting}</p>
              </div>
            </div>
          )}

          <MessageList 
            messages={messages} 
            selectedBot={selectedBot} 
            isTyping={isTyping} 
            streamingText={streamingText} 
          />

          {isTyping && streamingText == "" && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[85%] sm:max-w-[80%]">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-lg">
                    {selectedBot.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-foreground px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}


          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="flex space-x-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder', { name: selectedBot.name })}
            className="flex-1 h-12 text-base touch-manipulation"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="h-12 px-4 touch-manipulation"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center px-2">
          {t('chat.disclaimer')}
        </p>
      </div>
    </div>
  );
}