import type { ChatMessage } from "../interfaces";
import { MessageRole } from "../interfaces";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface MessageListProps {
    messages: ChatMessage[];
    selectedBot: { avatar: string };
    isTyping: boolean;
    streamingText: string;
}

export function MessageList({
    messages,
    selectedBot,
    isTyping,
    streamingText,
}: MessageListProps) {
    return (
        <div className="space-y-4">
            {
            messages.map((message, index) => (
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
                            <p className="whitespace-pre-wrap break-words">
                                {message.text}
                            </p>
                            <p className={`text-xs mt-2 opacity-70`}>
                                {new Date(message.updatedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            ))
            }
            {isTyping && streamingText !== "" && (
                <div className="flex justify-start">
                    <div className="flex space-x-3 max-w-[85%] sm:max-w-[80%]">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-lg">
                                {selectedBot.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <div className="px-4 py-3 rounded-2xl bg-muted text-foreground">
                            <p className="whitespace-pre-wrap break-words">
                                {streamingText}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
