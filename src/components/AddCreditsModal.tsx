import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { User } from '../interfaces';
import { generateUpiUrl } from '../utils';
import { useTranslation } from 'react-i18next';

interface AddCreditsModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function AddCreditsModal({ user, open, onClose }: AddCreditsModalProps) {
  const { t } = useTranslation();
  const [creditsToAdd, setCreditsToAdd] = useState<number>(10);
  const minimumCredits = 2;
  const maximumCredits = 2500;
  const amount = Number((Math.max(0, creditsToAdd) / 2).toFixed(2)); // ₹ = credits / 2
  const upiUrl = generateUpiUrl(
    'rutwik2808-1@okaxis',
    'CreatorsAI',
    amount,
    `Add ${creditsToAdd} credits | ${user.email}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 w-full">
        <DialogHeader>
          <DialogTitle>{t('addCredits.title')}</DialogTitle>
          <DialogDescription>
            {t('addCredits.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('addCredits.currentCredits')}</span>
            <span className="text-base font-medium">{user.credits ?? 0}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditsToAdd">{t('addCredits.creditsToAdd')}</Label>
            <div className="flex gap-2">
              <Input
                id="creditsToAdd"
                type="number"
                min={minimumCredits}
                max={maximumCredits}
                step={2}
                value={creditsToAdd}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  // check if the value is between minimum and maximum
                  if (v < minimumCredits) {
                    setCreditsToAdd(minimumCredits);
                  } else if (v > maximumCredits) {
                    setCreditsToAdd(maximumCredits);
                  } else {
                    setCreditsToAdd(v);
                  }
                }}
                className="h-11"
              />
              <div className="flex items-center px-3 rounded-md bg-muted text-sm whitespace-nowrap">
                ₹ {Math.max(0, creditsToAdd) / 2}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('addCredits.rate')}
            </p>
          </div>

          {creditsToAdd > 0 && (
            <div className="space-y-3">
              <Label>{t('addCredits.payViaUpi')}</Label>
              <div className="flex flex-col items-center gap-3">
                <img src={qrUrl} alt="UPI QR Code" className="w-44 h-44 rounded-md border" />
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1 h-11"
                    onClick={() => window.open(upiUrl, '_blank')}
                  >
                    {t('addCredits.openUpiApp')}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-11"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(upiUrl);
                      } catch {}
                    }}
                  >
                    {t('addCredits.copyLink')}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {t('addCredits.payingWillAdd', { amount, credits: creditsToAdd, email: user.email })}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 h-11" onClick={onClose}>
              {t('common.close')}
            </Button>
            <Button className="flex-1 h-11" onClick={onClose}>
              {t('common.done')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
