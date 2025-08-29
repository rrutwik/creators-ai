export const avatarSrc = (avatar: unknown): string | undefined => {
  const a: any = avatar;
  if (!a) return undefined;
  const bytes: number[] | undefined = Array.isArray(a)
    ? (a as number[])
    : Array.isArray(a?.data)
      ? (a.data as number[])
      : undefined;
  if (!bytes || bytes.length === 0) return undefined;
  try {
    const u8 = new Uint8Array(bytes);
    let binary = '';
    for (let i = 0; i < u8.length; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    const base64 = typeof window !== 'undefined' ? window.btoa(binary) : '';
    // Default to PNG; adjust if you know the actual MIME type
    return `data:image/png;base64,${base64}`;
  } catch {
    return undefined;
  }
}

/**
 * Build a UPI deep link for payments.
 * Docs: upi://pay?pa=<payee_vpa>&pn=<name>&tn=<note>&am=<amount>&cu=INR
 */
export function generateUpiUrl(upiId: string, name: string, amount: number, note: string): string {
  const rupeesToPay = Math.max(0, Number.isFinite(amount) ? amount : 0);
  const safeNote = encodeURIComponent(note);
  const safeAmount = rupeesToPay.toFixed(2); // 100.00 format
  return `upi://pay?pa=${upiId}&pn=${name}&tn=${safeNote}&am=${safeAmount}&cu=INR`;
}