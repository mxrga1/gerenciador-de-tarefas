import { useState, useEffect, useCallback } from "react";
import { supabase } from "../Auth/Supabaseclient";

export function useBoards(currentUser) {
  const [boards,        setBoards]        = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [invites,       setInvites]       = useState([]);
  const [loading,       setLoading]       = useState(true);

  const userId = currentUser?.id ?? null;

  const loadBoards = useCallback(async () => {
    if (!userId) { setBoards([]); return; }
    const { data, error } = await supabase
      .from("board_members")
      .select("board_id, role, boards ( id, title, owner_id )")
      .eq("user_id", userId);
    if (error) { console.error("Erro ao carregar boards:", error); return; }
    const mapped = (data ?? []).filter((row) => row.boards).map((row) => ({
      id: row.boards.id, title: row.boards.title,
      ownerId: row.boards.owner_id, role: row.role,
    }));
    setBoards(mapped);
    setActiveBoardId((prev) => {
      if (prev && mapped.some((b) => b.id === prev)) return prev;
      return mapped[0]?.id ?? null;
    });
  }, [userId]);

  const loadInvites = useCallback(async () => {
    if (!userId) { setInvites([]); return; }
    const { data, error } = await supabase
      .from("board_invites")
      .select("id, board_id, created_at, boards ( title ), inviter:invited_by ( username )")
      .eq("invited_user_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) { console.error("Erro ao carregar convites:", error); return; }
    setInvites((data ?? []).map((row) => ({
      id: row.id, boardId: row.board_id,
      boardTitle: row.boards?.title ?? "Quadro",
      inviterName: row.inviter?.username ?? "alguém",
      createdAt: row.created_at,
    })));
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadBoards(), loadInvites()]).finally(() => setLoading(false));
  }, [loadBoards, loadInvites]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`boards-sync-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "board_members", filter: `user_id=eq.${userId}` }, loadBoards)
      .on("postgres_changes", { event: "*", schema: "public", table: "boards" }, loadBoards)
      .on("postgres_changes", { event: "*", schema: "public", table: "board_invites", filter: `invited_user_id=eq.${userId}` }, loadInvites)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [userId, loadBoards, loadInvites]);

  async function addBoard(title) {
    const cleaned = title.trim();
    if (!cleaned || !userId) return;
    const { data: board, error } = await supabase
      .from("boards").insert({ title: cleaned, owner_id: userId }).select().single();
    if (error) { console.error("Erro ao criar board:", error); return; }
    await supabase.from("board_members").insert({ board_id: board.id, user_id: userId, role: "owner" });
    await loadBoards();
    setActiveBoardId(board.id);
  }

  // ─── Cria board padrão se o usuário não tiver nenhum ──────────────────
  // Fica DEPOIS de addBoard para poder chamá-la
  useEffect(() => {
    if (loading) return;
    if (boards.length === 0 && userId) {
      addBoard("Gerenciador de Tarefas");
    }
  }, [loading, boards.length, userId]);

  async function renameBoard(boardId, newTitle) {
    const cleaned = newTitle.trim();
    if (!cleaned) return;
    const { error } = await supabase.from("boards").update({ title: cleaned }).eq("id", boardId);
    if (error) console.error("Erro ao renomear board:", error);
    await loadBoards();
  }

  async function deleteBoard(boardId) {
    const { error } = await supabase.from("boards").delete().eq("id", boardId);
    if (error) console.error("Erro ao excluir board:", error);
    await loadBoards();
  }

  async function inviteUser(boardId, username) {
    const cleaned = username.trim().toLowerCase();
    if (!cleaned) return { error: "Digite um nome de usuário" };
    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("id, username").eq("username", cleaned).maybeSingle();
    if (profileError || !profile) return { error: "Usuário não encontrado" };
    if (profile.id === userId) return { error: "Você não pode convidar a si mesmo" };
    const { data: alreadyMember } = await supabase
      .from("board_members").select("id").eq("board_id", boardId).eq("user_id", profile.id).maybeSingle();
    if (alreadyMember) return { error: "Esse usuário já é membro deste quadro" };
    const { data: existingInvite } = await supabase
      .from("board_invites").select("id").eq("board_id", boardId)
      .eq("invited_user_id", profile.id).eq("status", "pending").maybeSingle();
    if (existingInvite) return { error: "Já existe um convite pendente para esse usuário" };
    const { error: insertError } = await supabase
      .from("board_invites").insert({ board_id: boardId, invited_user_id: profile.id, invited_by: userId });
    if (insertError) { console.error("Erro ao convidar:", insertError); return { error: "Não foi possível enviar o convite" }; }
    return { error: null };
  }

  async function acceptInvite(inviteId) {
    const { error } = await supabase.rpc("accept_invite", { _invite_id: inviteId });
    if (error) { console.error("Erro ao aceitar convite:", error); return { error: "Não foi possível aceitar o convite" }; }
    await Promise.all([loadBoards(), loadInvites()]);
    return { error: null };
  }

  async function declineInvite(inviteId) {
    const { error } = await supabase.from("board_invites").update({ status: "declined" }).eq("id", inviteId);
    if (error) console.error("Erro ao recusar convite:", error);
    await loadInvites();
  }

  return {
    boards, activeBoardId, setActiveBoardId,
    addBoard, deleteBoard, renameBoard,
    invites, inviteUser, acceptInvite, declineInvite,
    loading,
  };
}