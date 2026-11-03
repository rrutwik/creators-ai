import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import {
  LogOut,
  X,
  MessageCircle,
  Settings,
  PlusCircle,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Coins,
} from 'lucide-react';
import type { ChatDetails, ReligiousBot, User } from '../../types/interfaces';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useTranslation } from 'react-i18next';
import { avatarSrc } from '../../services';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

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
  onShowAddCredits: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onNewChat: () => void;
  onRenameChat: (chat: ChatDetails, name: string) => void | Promise<void>;
  onDeleteChat: (chat: ChatDetails) => void | Promise<void>;
  hasMoreHistory: boolean;
  loadingMoreHistory: boolean;
  onLoadMoreHistory: () => void;
}

export const SideBarText = {
  bots: 'bots',
  history: 'history',
} as const;

export type SideBarTextType = typeof SideBarText[keyof typeof SideBarText];

const LOW_CREDITS = 2;

export function Sidebar({
  user,
  selectedBot,
  selectedChat,
  onSelectBot,
  onSelectChat,
  religiousBots,
  chatHistory,
  onShowProfile,
  onShowAddCredits,
  onShowSettings,
  onLogout,
  onToggleCollapse,
  isMobile = false,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  hasMoreHistory,
  loadingMoreHistory,
  onLoadMoreHistory,
}: SidebarProps) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<SideBarTextType>(SideBarText.bots);
  const [renameTarget, setRenameTarget] = useState<ChatDetails | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ChatDetails | null>(null);

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

  useEffect(() => {
    if (selectedChat) {
      setActiveSection(SideBarText.history);
    } else {
      setActiveSection(SideBarText.bots);
    }
  }, [selectedChat]);

  const credits = user?.credits;
  const creditsLow = credits !== undefined && credits <= LOW_CREDITS;

  const openRename = (chat: ChatDetails) => {
    setRenameTarget(chat);
    setRenameValue(chat.name);
  };

  const submitRename = async () => {
    if (!renameTarget) return;
    const target = renameTarget;
    setRenameTarget(null);
    await onRenameChat(target, renameValue);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    await onDeleteChat(target);
  };

  return (
    <div
      className={`${
        isMobile ? 'w-80' : 'w-80 lg:w-80'
      } bg-sidebar border-r border-sidebar-border flex flex-col h-full max-h-dvh min-h-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-sidebar-foreground">{t('common.appName')}</h1>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-8 h-8"
              aria-label={t('common.close')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          className="w-full mt-3 h-10 touch-manipulation"
          onClick={() => {
            onNewChat();
            // With a guide already chosen a new chat starts right away; otherwise show the guides to pick one.
            setActiveSection(SideBarText.bots);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t('sidebar.newChat', { defaultValue: 'New chat' })}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 py-3 border-b border-sidebar-border flex-shrink-0">
        <div className="flex space-x-1" role="tablist">
          <Button
            role="tab"
            aria-selected={activeSection === SideBarText.bots}
            variant={activeSection === SideBarText.bots ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(SideBarText.bots)}
            className="flex-1 h-10 touch-manipulation"
          >
            {t('sidebar.religiousGuides')}
          </Button>
          <Button
            role="tab"
            aria-selected={activeSection === SideBarText.history}
            variant={activeSection === SideBarText.history ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(SideBarText.history)}
            className="flex-1 h-10 touch-manipulation"
          >
            {t('sidebar.history')}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 min-h-0 px-4 py-4">
        {activeSection === 'bots' ? (
          <div className="space-y-3">
            {religiousBots.map((bot) => (
              <div key={bot._id}>
                <Button
                  variant={selectedBot?._id === bot._id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-4 touch-manipulation"
                  onClick={() => onSelectBot(bot)}
                  aria-pressed={selectedBot?._id === bot._id}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{bot.avatar}</span>
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
            {chatHistory.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('sidebar.noChats', { defaultValue: 'No chats yet. Pick a guide to start one.' })}
              </p>
            )}
            {chatHistory.map((chat) => {
              const bot = religiousBots.find(b => b._id === chat.chatbot_id._id);
              const isSelected = chat.uuid === selectedChat?.uuid;
              return (
                <div key={chat.uuid} className="flex items-stretch gap-1">
                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    className="flex-1 min-w-0 justify-start h-auto p-4 touch-manipulation"
                    onClick={() => onSelectChat(chat)}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <MessageCircle className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm truncate">{chat.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {bot?.name} • {formatTime(chat.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-auto w-9 flex-shrink-0 touch-manipulation"
                        aria-label={t('sidebar.chatActions', { name: chat.name, defaultValue: 'Options for {{name}}' })}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openRename(chat)}>
                        <Pencil className="w-4 h-4" /> {t('sidebar.rename', { defaultValue: 'Rename' })}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(chat)}>
                        <Trash2 className="w-4 h-4" /> {t('sidebar.delete', { defaultValue: 'Delete' })}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
            {hasMoreHistory && (
              <Button
                variant="outline"
                className="w-full touch-manipulation"
                onClick={onLoadMoreHistory}
                disabled={loadingMoreHistory}
              >
                {loadingMoreHistory
                  ? t('common.loading')
                  : t('sidebar.loadMore', { defaultValue: 'Load more' })}
              </Button>
            )}
          </div>
        )}
      </ScrollArea>

      {/* User Profile & Logout (fixed at bottom) */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start p-3 mb-3 h-auto touch-manipulation"
          onClick={onShowProfile}
        >
          <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
            <AvatarImage src={avatarSrc(user?.avatar)} alt="" />
            <AvatarFallback>{user?.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium truncate">{user?.first_name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </Button>

        {credits !== undefined && (
          <div
            className={`flex items-center justify-between rounded-md border px-3 py-2 mb-3 text-sm ${
              creditsLow ? 'border-destructive/40 bg-destructive/5' : 'border-sidebar-border'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Coins className="w-4 h-4" aria-hidden="true" />
              {t('chat.creditsLeft', { count: credits, defaultValue: '{{count}} credits left' })}
            </span>
            <Button
              size="sm"
              variant={creditsLow ? 'default' : 'ghost'}
              className="h-7 px-2 text-xs touch-manipulation"
              onClick={onShowAddCredits}
            >
              {t('profile.addCredits')}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-12 p-2 touch-manipulation"
            onClick={onShowSettings}
          >
            <Settings className="w-4 h-4 mb-1" aria-hidden="true" />
            <span className="text-xs">{t('common.settings')}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-12 p-2 touch-manipulation"
            onClick={onShowAddCredits}
          >
            <PlusCircle className="w-4 h-4 mb-1" aria-hidden="true" />
            <span className="text-xs">{t('profile.addCredits')}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-12 p-2 touch-manipulation text-muted-foreground"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mb-1" aria-hidden="true" />
            <span className="text-xs">{t('common.logout')}</span>
          </Button>
        </div>
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('sidebar.renameTitle', { defaultValue: 'Rename chat' })}</DialogTitle>
            <DialogDescription>
              {t('sidebar.renameDesc', { defaultValue: 'Give this conversation a name you will recognise.' })}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            maxLength={80}
            autoFocus
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void submitRename();
              }
            }}
            aria-label={t('sidebar.renameTitle', { defaultValue: 'Rename chat' })}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => void submitRename()} disabled={!renameValue.trim()}>
              {t('common.saveChanges')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sidebar.deleteTitle', { defaultValue: 'Delete this chat?' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('sidebar.deleteDesc', { name: deleteTarget?.name, defaultValue: '"{{name}}" and all its messages will be removed. This cannot be undone.' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()}>
              {t('sidebar.delete', { defaultValue: 'Delete' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
