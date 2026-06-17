import { createClient } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════════════════
// COLE AQUI a Project URL e a Publishable/Anon Key do seu projeto Supabase.
// Painel → Settings → API Keys.
// Essas chaves são seguras para expor no navegador (não são a secret key).
// ════════════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://kaqwwdwlvfdalbuuhvat.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcXd3ZHdsdmZkYWxidXVodmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTg3NzIsImV4cCI6MjA5NzIzNDc3Mn0.NnJsutBxnXibQVqhSvUJamjsidD539rlmA5H5EJJv8A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Domínio fake usado para transformar "nome de usuário" em e-mail,
// já que o Supabase Auth exige um e-mail por trás das contas.
// Isso é invisível para quem usa o app: a pessoa só digita um "usuário".
export const FAKE_EMAIL_DOMAIN = "gmail.com";

export function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@${FAKE_EMAIL_DOMAIN}`;
}