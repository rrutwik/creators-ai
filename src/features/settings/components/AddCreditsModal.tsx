import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { User } from '../../../types/interfaces';
import { useTranslation } from 'react-i18next';
import { generateUpiUrl } from '../../../services';

interface AddCreditsModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function AddCreditsModal({ user, open, onClose }: AddCreditsModalProps) {
  const { t } = useTranslation();
  // User now inputs rupees; credits are derived as rupees * 2
  const [rupeesToPay, setRupeesToPay] = useState<number>(50);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [qrLoading, setQrLoading] = useState<boolean>(true);
  const minimumRupees = 5;
  const maximumRupees = 2500;
  useEffect(() => {
    if (!open) {
      setConfirmed(false);
      setRupeesToPay(50);
    }
  }, [open]);

  const creditsFromAmount = useMemo(() => rupeesToPay * 2, [rupeesToPay]);
  const upiUrl = useMemo(() => {
    const note = `Add ${creditsFromAmount} credits - ${user.email}`;
    const amount = rupeesToPay;
    return generateUpiUrl(
      'rutwik2808-1@okaxis',
      'CreatorsAI',
      amount,
      note
    );
  }, [rupeesToPay, creditsFromAmount, user.email]);
  const qrUrl = useMemo(() => (
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`
  ), [upiUrl]);

  useEffect(() => {
    setQrLoading(true);
  }, [qrUrl]);

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
            <Label htmlFor="rupeesToPay">{t('addCredits.amountLabel')}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[50, 100, 500].map((amt) => (
                <div key={amt} className="flex-1 min-w-[80px]">
                  <Button
                    variant={rupeesToPay === amt ? 'default' : 'outline'}
                    type="button"
                    onClick={() => setRupeesToPay(amt)}
                    className="w-full"
                    aria-pressed={rupeesToPay === amt}
                    disabled={confirmed}
                  >
                    ₹{amt}
                  </Button>
                  {amt === 100 && !confirmed && (
                    <div className="mt-1 text-center text-[10px] text-primary">
                      {t('addCredits.mostPopular')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="rupeesToPay"
                type="number"
                min={minimumRupees}
                max={maximumRupees}
                step={1}
                value={rupeesToPay}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    const num = value === '' ? 0 : parseInt(value, 10);
                    if (num < minimumRupees) {
                      setRupeesToPay(minimumRupees);
                    } else if (num > maximumRupees) {
                      setRupeesToPay(maximumRupees);
                    } else {
                      setRupeesToPay(num);
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '') setRupeesToPay(minimumRupees);
                }}
                className="h-11"
                disabled={confirmed}
              />
              <div className="flex items-center px-3 rounded-md bg-muted text-sm whitespace-nowrap">
                {creditsFromAmount} credits
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('addCredits.rate')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('addCredits.creditMeaning')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('addCredits.minMax', { min: minimumRupees, max: maximumRupees })}
            </p>
            {!confirmed && (
              <div className="pt-1">
                <Button
                  className="h-11 w-full"
                  onClick={() => setConfirmed(true)}
                  disabled={rupeesToPay < minimumRupees || rupeesToPay > maximumRupees}
                >
                  {t('addCredits.generateQr')}
                </Button>
              </div>
            )}
          </div>

          {confirmed && (
            <div className="space-y-3">
              <Label>{t('addCredits.payViaUpi')}</Label>
              <div className="flex flex-col items-center gap-3">
                {qrLoading && (
                  <div className="w-44 h-44 rounded-md border bg-muted animate-pulse" aria-hidden />
                )}
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className={`w-44 h-44 rounded-md border ${qrLoading ? 'hidden' : ''}`}
                  onLoad={() => setQrLoading(false)}
                  onError={() => setQrLoading(false)}
                  aria-busy={qrLoading}
                />
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
                      } catch { }
                    }}
                  >
                    {t('addCredits.copyLink')}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {t('addCredits.payingWillAdd', { amount: rupeesToPay, credits: creditsFromAmount, email: user.email })}
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
