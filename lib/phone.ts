const INDIAN_MOBILE = /^[6-9]\d{9}$/

export function normalizeIndianPhone(value: string): string | null {
  const raw = value.trim()
  const digits = raw.replace(/\D/g, "")
  const local = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith("0") && digits.length === 11
      ? digits.slice(1)
      : digits

  return INDIAN_MOBILE.test(local) ? `+91${local}` : null
}

export function isEmailIdentifier(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
