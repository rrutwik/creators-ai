import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Menu, MoreVertical, Sparkles, ArrowLeft } from 'lucide-react';
import { MessageRole, type ChatDetails, type ChatMessage, type ChatSession, type ReligiousBot } from '../interfaces';
import { getChat, sendMessage } from '../api';
import axios from 'axios';

interface ChatWindowProps {
  selectedBot: ReligiousBot;
  selectedChat: ChatDetails | null;
  onToggleSidebar: () => void;
  onMessageSent: (sessionUuid: string) => void;
  sidebarOpen: boolean;
  onRequireAddCredits: () => void;
}

export function ChatWindow({ selectedBot, selectedChat, onToggleSidebar, sidebarOpen, onMessageSent, onRequireAddCredits }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);


  useEffect(() => {
    if (!selectedChat) return;
    const fetchChat = async () => {
      try {
        const response = await getChat(selectedChat.uuid);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };
    fetchChat();
  }, [selectedChat]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const fetchNewMessages = useCallback(async (chatSelectionId?: string | null) => {
    if (!chatSelectionId) return true;

    try {
      const response = await getChat(chatSelectionId);
      const data = response.data;
      const _chatSession = data;
      if (!chatSession) {
        setChatSession({ ..._chatSession });
      }

      if (data.messages.length && data.messages[data.messages.length - 1].role === 2) {
        const newMessage: ChatMessage = data.messages[data.messages.length - 1];
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching new messages:', error);
      return false;
    }
  }, [chatSession]);

  const startPolling = useCallback(
    async (chatUuid?: string) => {
      if (!chatUuid) return;
      const intervalId = setInterval(async () => {
        const stopPolling = await fetchNewMessages(chatUuid);
        if (stopPolling) {
          setIsTyping(false);
          clearInterval(intervalId!); // Stop polling when the condition is met
        }
      }, 5000); // Poll every 5 seconds
      return () => {
        return clearInterval(intervalId);
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

      const anyNewMessage = updatedSession.messages.pop();
      setIsTyping(true);
      if (anyNewMessage) {
        setMessages(prev => [...prev, anyNewMessage]);
      }
      setInputValue('');
      if (updatedSession?.uuid) {
        onMessageSent(updatedSession.uuid);
        startPolling(updatedSession.uuid);
      }
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

  return (
    <div className="flex flex-col h-full max-h-screen min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center justify-between min-h-[72px] flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleSidebar()}
            className="w-10 h-10 touch-manipulation flex-shrink-0"
          >
            {sidebarOpen ? <ArrowLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
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
          <Button variant="ghost" size="icon" className="w-10 h-10 touch-manipulation">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 && !isTyping && (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">{selectedBot.avatar}</div>
                {/* <h3 className="text-xl font-semibold mb-2">{selectedBot.name}</h3> */}
                <p className="text-muted-foreground mb-4">{selectedBot.greeting}</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.role == MessageRole.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex space-x-3 max-w-[85%] sm:max-w-[80%] ${message.role == MessageRole.USER ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
              >
                {message.role != MessageRole.USER && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-lg">
                      {selectedBot.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${message.role == MessageRole.USER
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                    }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <p className={`text-xs mt-2 opacity-70`}>
                    {new Date(message.updatedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
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
            placeholder={`Ask ${selectedBot.name} for spiritual guidance...`}
            className="flex-1 h-12 text-base touch-manipulation"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="h-12 px-4 touch-manipulation"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center px-2">
          AI responses are based on religious texts and traditions. Always consult religious authorities for important spiritual matters.
        </p>
      </div>
    </div>
  );
}