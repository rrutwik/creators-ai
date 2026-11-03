import ReactMarkdown, { type Components } from "react-markdown";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "../../../types/interfaces";
import { MessageRole } from "../../../types/interfaces";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";

interface MessageListProps {
    messages: ChatMessage[];
    selectedBot: { avatar: string };
    isTyping: boolean;
    streamingText: string;
    /** Called by the Retry button on the newest failed reply. */
    onRetry?: () => void;
}

// Replies from the model use Markdown (lists, bold, headings). react-markdown does not render raw HTML, so this is safe.
const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-3 last:mb-0 break-words">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-1">{children}</ol>,
    h1: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-1">{children}</h3>,
    h2: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-1">{children}</h3>,
    h3: ({ children }) => <h4 className="text-base font-semibold mb-2 mt-1">{children}</h4>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-border pl-3 italic text-muted-foreground mb-3 last:mb-0">{children}</blockquote>
    ),
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {children}
        </a>
    ),
    code: ({ children }) => <code className="rounded bg-background/60 px-1 py-0.5 text-[0.9em]">{children}</code>,
};

const FIVE_MINUTES = 5 * 60 * 1000;

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageList({
    messages,
    selectedBot,
    isTyping,
    streamingText,
    onRetry,
}: MessageListProps) {
    const { t } = useTranslation();
    const lastErrorIndex = messages.reduce((found, m, i) => (m.type === "error" ? i : found), -1);

    return (
        // role="log" + aria-live: screen readers announce new replies without re-reading the whole chat
        <div className="space-y-4" role="log" aria-live="polite" aria-relevant="additions text" aria-label={t("chat.messagesLabel", { defaultValue: "Conversation" })}>
            {messages.map((message, index) => {
                const isUser = message.role == MessageRole.USER;
                const isError = message.type === "error";
                const next = messages[index + 1];
                // Show the time only at the end of a run of messages from one sender, or after a pause,
                // instead of repeating it on every bubble.
                const showTime =
                    !next ||
                    next.role !== message.role ||
                    new Date(next.updatedAt).getTime() - new Date(message.updatedAt).getTime() > FIVE_MINUTES;

                return (
                    <div key={message._id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`flex space-x-3 max-w-[85%] sm:max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                            {!isUser && (
                                <Avatar className="w-8 h-8 flex-shrink-0" aria-hidden="true">
                                    <AvatarFallback className="text-lg">{selectedBot.avatar}</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`px-4 py-3 rounded-2xl min-w-0 ${
                                    isUser
                                        ? "bg-primary text-primary-foreground"
                                        : isError
                                          ? "bg-destructive/10 text-foreground border border-destructive/30"
                                          : "bg-muted text-foreground"
                                }`}
                            >
                                {isUser ? (
                                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                ) : (
                                    <div className="break-words">
                                        <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
                                    </div>
                                )}
                                {isError && index === lastErrorIndex && onRetry && (
                                    <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                                        {t("chat.retry", { defaultValue: "Try again" })}
                                    </Button>
                                )}
                                {showTime && (
                                    <p className={`text-xs mt-2 ${isUser ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                        {formatTime(message.updatedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            {isTyping && streamingText !== "" && (
                // Hidden from screen readers while it types out; the finished message is announced once it joins the list.
                <div className="flex justify-start" aria-hidden="true">
                    <div className="flex space-x-3 max-w-[85%] sm:max-w-[80%]">
                        <Avatar className="w-8 h-8 flex-shrink-0" aria-hidden="true">
                            <AvatarFallback className="text-lg">{selectedBot.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="px-4 py-3 rounded-2xl bg-muted text-foreground min-w-0">
                            <div className="break-words">
                                <ReactMarkdown components={markdownComponents}>{streamingText}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
