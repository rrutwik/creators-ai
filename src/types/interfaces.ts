import type { Buffer } from 'buffer';

export interface User {
  _id: string;
  id?: string; // For backward compatibility
  first_name: string;
  last_name: string;
  name?: string; // For backward compatibility
  email: string;
  phone?: string;
  avatar: Buffer | string; // Can be Buffer (from server) or string (URL)
  credits: number;
  language?: string; // ISO language code like 'en', 'hi', 'gu', 'mr'
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  sessionToken: string;
  refreshToken: string;
}

export interface SendOtpGenerateResponse {
  success: boolean;
  data: {
    expires_at: string;
    link: string;
    token: string;
  };
}

export interface VerifyOtpResponse {
  success: boolean;
  data: AuthResponse;
}

// Chat related interfaces
export interface ChatMessage {
  _id: string;
  role: number; // Using MessageRole enum
  text: string;
  isSpeaking?: boolean;
  updatedAt: string;
}

export interface ChatDetails {
  _id: string;
  name: string;
  chatbot_id: ReligiousBot;
  uuid: string;
  updatedAt: string;
}

export interface ChatSession {
  _id: string;
  uuid: string;
  name: string;
  user_id: string;
  chatbot_id: ReligiousBot;
  can_message: boolean;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ReligiousBot {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  religion?: string;
  description: string;
  avatar: string;
  greeting?: string;
}

// UI related interfaces
export interface ChatSelectionModelProps {
  setChatSelectionId: (chatId: string) => void;
  setSelectedBot: (bot: ReligiousBot) => void;
  chatSelectionId?: string | null;
  setSidebarOpen: (close: boolean) => void;
}

export interface UserMenuProps {
  username: string;
  credits: number;
  onAddCredits: (amount: number) => void;
}

// Enums
export const MessageRole = {
  USER: 1,
  ASSISTANT: 2,
  SYSTEM: 3
} as const;

export type MessageRole = typeof MessageRole[keyof typeof MessageRole];
