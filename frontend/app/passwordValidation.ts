export interface PasswordCheck {
  valid: boolean;
  reasons: string[];
}

export function validatePassword(pw: string): PasswordCheck {
  const reasons: string[] = [];

  if (pw.length < 8)            reasons.push('• At least 8 characters');
  if (!/[a-z]/.test(pw))        reasons.push('• One lowercase letter');
  if (!/[A-Z]/.test(pw))        reasons.push('• One uppercase letter');
  if (!/[0-9]/.test(pw))        reasons.push('• One digit');
  if (/^\s|\s$/.test(pw))       reasons.push('• No leading or trailing spaces');

  return { valid: reasons.length === 0, reasons };
}