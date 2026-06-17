import { useState, useEffect, useCallback } from "react";
import { supabase, usernameToEmail } from "./Supabaseclient";

// ─── Hook de autenticação ───────────────────────────────────────────────────
// A pessoa só interage com "nome de usuário" + senha. Por trás, convertemos
// o usuário num e-mail fake (usuario@kanban.local) porque o Supabase Auth
// exige um e-mail. Isso é só um detalhe interno — invisível na UI.

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. loadProfile PRIMEIRO
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", authUser.id)
      .single();

    if (error) {
      console.error("Erro ao carregar perfil:", error);
      setUser(null);
      return;
    }
    setUser(data);
  }, []);

  // 2. useEffect DEPOIS
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("sessão:", data?.session, "erro:", error);
      if (data?.session?.user) {
        loadProfile(data.session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  async function login(username, password) {
    const email = usernameToEmail(username);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Usuário ou senha inválidos" };
      }
      return { error: error.message };
    }
    return { error: null };
  }

async function register(username, password) {
    const cleaned = username.trim().toLowerCase();

    if (!cleaned || cleaned.length < 3) {
      return { error: "O nome de usuário deve ter ao menos 3 caracteres" };
    }
    if (!/^[a-z0-9_]+$/.test(cleaned)) {
      return { error: "Use underline no lugar de espaço: ex. Maria_Luiza" };
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleaned)
      .maybeSingle();

    if (existing) {
      return { error: "Usuário já existe" };
    }

    const email = usernameToEmail(cleaned);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: cleaned } },
    });

    if (error) {
      return { error: error.message };
    }

    await supabase.auth.signOut();
    setUser(null); // força o estado local a limpar imediatamente
    
    return { error: null };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, login, register, logout };
}

