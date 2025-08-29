import type { Buffer } from "buffer";

interface Chat {
    uuid: string;
    name: string;
    chatbot_id?: {
        name: string
    },
    updatedAt: Date;
}

interface ChatDetails {
    _id: string;
    name: string;
    chatbot_id: Bot,
    uuid: string;
    updatedAt: string;
}

// interface ChatHistory {
//   id: string;
//   title: string;
//   botId: string;
  // messageCount: number;
  // lastMessage: string;
  // timestamp: Date;
  // tags: string[];
// }

interface ChatSelectionModelProps {
    setChatSelectionId: (chatId: string) => void;
    setSelectedBot: (bot: Bot) => void;
    chatSelectionId?: string | null;
    setSidebarOpen: (close: boolean) => void
}

interface UserMenuProps {
    username: string;
    credits: number;
    onAddCredits: (amount: number) => void;
}

export const MessageRole = {
    USER: 1,
    ASSISTANT: 2,
    SYSTEM: 3
} as const;

export type MessageRole = typeof MessageRole[keyof typeof MessageRole];

export interface ReligiousBot {
    _id: string;
    id: string;
    name: string;
    religion: string;
    description: string;
    avatar: string;
    greeting: string;
}

interface ChatMessage {
    _id: string;
    role: MessageRole,
    text: string,
    isSpeaking?: boolean,
    updatedAt: string;
}

interface ChatSession {
    uuid: string;
    name: string;
    user_id: string;
    chatbot_id: Bot,
    can_message: boolean,
    messages: Array<ChatMessage>;
}

interface User {
    _id: string;
    first_name: string;
    avatar: Buffer;
    last_name: string;
    email: string;
    credits: number;
    createdAt: string;
    language?: string; // ISO language code like 'en', 'hi', 'gu', 'mr'
}

interface Bot {
    _id: string,
    name: string
}

export type { User, Chat, Bot, ChatSelectionModelProps, UserMenuProps, ChatMessage, ChatSession, ChatDetails };
