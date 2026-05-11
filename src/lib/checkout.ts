export const PERFECTPAY_PREMIUM_URL = "https://go.perfectpay.com.br/PPU38CQBJT8";
export const PERFECTPAY_PRO_URL = "https://go.perfectpay.com.br/PPU38CQBJTI";

// Legacy export for backward compat — points to Premium
export const PERFECTPAY_CHECKOUT_URL = PERFECTPAY_PREMIUM_URL;

export function goToCheckout(plan: "premium" | "pro" = "premium") {
  const url = plan === "pro" ? PERFECTPAY_PRO_URL : PERFECTPAY_PREMIUM_URL;
  window.location.href = url;
  return true;
}

