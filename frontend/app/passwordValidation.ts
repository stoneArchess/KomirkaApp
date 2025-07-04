export interface InputCheck {
  valid: boolean;
  reasons: string[];
}

export function validatePassword(pw: string): InputCheck {
  const reasons: string[] = [];

  if (pw.length < 8)            reasons.push('• At least 8 characters');
  if (!/[a-z]/.test(pw))        reasons.push('• One lowercase letter');
  if (!/[A-Z]/.test(pw))        reasons.push('• One uppercase letter');
  if (!/[0-9]/.test(pw))        reasons.push('• One digit');
  if (/^\s|\s$/.test(pw))       reasons.push('• No leading or trailing spaces');
  if (!/[\p{P}\p{S}]/u.test(pw))       reasons.push('• One non-alphanumeric character');

  return { valid: reasons.length === 0, reasons };
}
export function validateEmail(addr: string): InputCheck {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
  return { valid: ok, reasons: ok ? [] : ['Invalid e‑mail address'] };
}