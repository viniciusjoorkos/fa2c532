// TODO: Substitua pelo link real do checkout PerfectPay quando disponível.
// Esse link é usado no botão "Solicitar acesso" / "Cadastre-se".
// Após a compra, o cadastro do usuário será criado MANUALMENTE no painel admin.
export const PERFECTPAY_CHECKOUT_URL = "#";

export function goToCheckout() {
  if (PERFECTPAY_CHECKOUT_URL === "#") {
    // Sem link configurado ainda — não navega.
    return false;
  }
  window.location.href = PERFECTPAY_CHECKOUT_URL;
  return true;
}
