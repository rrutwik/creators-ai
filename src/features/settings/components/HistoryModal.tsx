import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { Search, Calendar, Trash2, Download } from 'lucide-react';
import type { ChatDetails, ReligiousBot } from '../../../types/interfaces';
import { useTranslation } from 'react-i18next';

interface HistoryModalProps {
  onClose: () => void;
  chatHistory: ChatDetails[];
  religiousBots: ReligiousBot[];
}

export function HistoryModal({ onClose, religiousBots, chatHistory }: HistoryModalProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredHistory = chatHistory.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()); //||
    //  chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //  chat.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && chat.chatbot_id._id === selectedFilter;
  });

  const getBotById = (botId: string) => {
    return religiousBots.find(bot => bot._id === botId);
  };

  const formatDate = (_date: string) => {
    // Localized relative dates
    const today = t('dates.today');
    const yesterday = t('dates.yesterday');
    const now = new Date();
    const date = new Date(_date);
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return today;
    if (days === 1) return yesterday;
    if (days < 7) return t('dates.daysAgo', { count: days });
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-4 w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('historyModal.title')}</DialogTitle>
          <DialogDescription>
            {t('historyModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('historyModal.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 touch-manipulation"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className="flex-shrink-0 h-10 touch-manipulation"
              >
                {t('historyModal.all')}
              </Button>
              {religiousBots.map(bot => (
                <Button
                  key={bot._id}
                  variant={selectedFilter === bot._id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(bot._id)}
                  className="flex items-center gap-2 flex-shrink-0 h-10 touch-manipulation"
                >
                  <span className="text-sm">{bot.avatar}</span>
                  <span className="hidden sm:inline">{bot.religion}</span>
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-2">
              {filteredHistory.map((chat, index) => {
                const bot = getBotById(chat.chatbot_id._id);
                return (
                  <div key={chat._id}>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer touch-manipulation">
                      <div className="text-xl flex-shrink-0">{bot?.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate pr-2">{chat.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Calendar className="w-3 h-3" />
                            <span className="hidden sm:inline">{formatDate(chat.updatedAt)}</span>
                            <span className="sm:hidden">{formatDate(chat.updatedAt).split(' ')[0]}</span>
                          </div>
                        </div>
                        {/* <p className="text-sm text-muted-foreground truncate mb-3">
                          {chat.lastMessage}
                        </p> */}
                        {/* <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {chat.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {chat.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{chat.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageCircle className="w-3 h-3" />
                            {chat.messageCount}
                          </div>
                        </div> */}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="w-10 h-10 touch-manipulation">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-10 h-10 text-destructive touch-manipulation">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {index < filteredHistory.length - 1 && <Separator className="my-2" />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {t('historyModal.conversationsFound', { count: filteredHistory.length, suffix: filteredHistory.length !== 1 ? 's' : '' })}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none h-11 touch-manipulation">
                {t('common.close')}
              </Button>
              <Button className="flex-1 sm:flex-none h-11 touch-manipulation">
                {t('historyModal.exportAll')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}