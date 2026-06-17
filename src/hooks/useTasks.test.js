import { renderHook, act, waitFor } from "@testing-library/react";
import { useTasks } from "../pages/Home/useTasks";

// ─── Mock do Supabase ─────────────────────────────────────────────────────────

const mockOrderFn = jest.fn().mockResolvedValue({ data: [], error: null });
const mockEqFn = jest.fn().mockReturnThis();
const mockInsertFn = jest.fn().mockResolvedValue({ data: null, error: null });
const mockUpdateFn = jest.fn().mockResolvedValue({ data: null, error: null });
const mockDeleteFn = jest.fn().mockResolvedValue({ data: null, error: null });
const mockSelectFn = jest.fn().mockReturnThis();

const mockFrom = jest.fn(() => ({
  select: mockSelectFn,
  insert: mockInsertFn,
  update: mockUpdateFn,
  delete: mockDeleteFn,
  eq: mockEqFn,
  order: mockOrderFn,
}));

jest.mock("../pages/Auth/Supabaseclient", () => ({
  supabase: {
    from: (...args) => mockFrom(...args),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  },
}));

const mockUser = { id: "user-123", username: "testuser" };
const mockBoardId = "board-123";

// ─── Testes ───────────────────────────────────────────────────────────────────

describe("useTasks — estado inicial", () => {
  beforeEach(() => jest.clearAllMocks());

  test("inicia com tasks vazias", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    await waitFor(() => expect(result.current.tasks).toEqual([]));
  });

  test("inicia com columns vazias", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    await waitFor(() => expect(result.current.columns).toEqual([]));
  });

  test("inicia com title vazio", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    expect(result.current.title).toBe("");
  });

  test("inicia com desc vazio", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    expect(result.current.desc).toBe("");
  });

  test("inicia com showForm null", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    expect(result.current.showForm).toBeNull();
  });

  test("inicia com editingId null", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    expect(result.current.editingId).toBeNull();
  });
});

describe("useTasks — boardId nulo", () => {
  beforeEach(() => jest.clearAllMocks());

  test("tasks vazia quando boardId é null", async () => {
    const { result } = renderHook(() => useTasks(null, mockUser));
    await waitFor(() => expect(result.current.tasks).toEqual([]));
  });

  test("columns vazia quando boardId é null", async () => {
    const { result } = renderHook(() => useTasks(null, mockUser));
    await waitFor(() => expect(result.current.columns).toEqual([]));
  });

  test("não faz chamada ao banco quando boardId é null", async () => {
    renderHook(() => useTasks(null, mockUser));
    await waitFor(() => expect(mockFrom).not.toHaveBeenCalled());
  });
});

describe("useTasks — setTitle e setDesc", () => {
  beforeEach(() => jest.clearAllMocks());

  test("atualiza title", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("Nova tarefa"));
    expect(result.current.title).toBe("Nova tarefa");
  });

  test("atualiza desc", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setDesc("Descrição"));
    expect(result.current.desc).toBe("Descrição");
  });

  test("atualiza title para string vazia", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("algo"));
    act(() => result.current.setTitle(""));
    expect(result.current.title).toBe("");
  });

  test("atualiza desc para string vazia", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setDesc("algo"));
    act(() => result.current.setDesc(""));
    expect(result.current.desc).toBe("");
  });
});

describe("useTasks — showForm", () => {
  beforeEach(() => jest.clearAllMocks());

  test("abre formulário para uma coluna", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setShowForm("coluna-1"));
    expect(result.current.showForm).toBe("coluna-1");
  });

  test("fecha formulário ao setar null", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setShowForm("coluna-1"));
    act(() => result.current.setShowForm(null));
    expect(result.current.showForm).toBeNull();
  });

  test("troca de coluna no formulário", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setShowForm("coluna-1"));
    act(() => result.current.setShowForm("coluna-2"));
    expect(result.current.showForm).toBe("coluna-2");
  });
});

describe("useTasks — cancelEdit", () => {
  beforeEach(() => jest.clearAllMocks());

  test("limpa title", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("Teste"));
    act(() => result.current.cancelEdit());
    expect(result.current.title).toBe("");
  });

  test("limpa desc", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setDesc("Desc"));
    act(() => result.current.cancelEdit());
    expect(result.current.desc).toBe("");
  });

  test("fecha showForm", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setShowForm("coluna-1"));
    act(() => result.current.cancelEdit());
    expect(result.current.showForm).toBeNull();
  });

  test("limpa editingId", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.cancelEdit());
    expect(result.current.editingId).toBeNull();
  });
});

describe("useTasks — addTask", () => {
  beforeEach(() => jest.clearAllMocks());

  test("não insere se title estiver vazio", async () => {
    const insertMock = jest.fn().mockResolvedValue({ data: null, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: insertMock,
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    await act(async () => await result.current.addTask("coluna-1"));
    expect(insertMock).not.toHaveBeenCalled();
  });

  test("não insere se title for só espaços", async () => {
    const insertMock = jest.fn().mockResolvedValue({ data: null, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: insertMock,
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("   "));
    await act(async () => await result.current.addTask("coluna-1"));
    expect(insertMock).not.toHaveBeenCalled();
  });

  test("limpa title após adicionar tarefa", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("Minha tarefa"));
    await act(async () => await result.current.addTask("coluna-1"));
    expect(result.current.title).toBe("");
  });

  test("limpa desc após adicionar tarefa", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("Tarefa"));
    act(() => result.current.setDesc("Descrição"));
    await act(async () => await result.current.addTask("coluna-1"));
    expect(result.current.desc).toBe("");
  });

  test("fecha showForm após adicionar tarefa", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    act(() => result.current.setTitle("Tarefa"));
    act(() => result.current.setShowForm("coluna-1"));
    await act(async () => await result.current.addTask("coluna-1"));
    expect(result.current.showForm).toBeNull();
  });
});

describe("useTasks — setTasks e setColumns", () => {
  beforeEach(() => jest.clearAllMocks());

  test("setTasks é uma função", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    expect(typeof result.current.setTasks).toBe("function");
  });

  test("setColumns é uma função", () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    expect(typeof result.current.setColumns).toBe("function");
  });

  test("setTasks aceita um array direto", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    const tarefa = { id: "t1", title: "T1", desc: "", status: "c1", position: 0 };
    await act(async () => result.current.setTasks([tarefa]));
    // não lança erro
    expect(true).toBe(true);
  });

  test("setTasks aceita função updater", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    await act(async () => result.current.setTasks((prev) => prev));
    expect(true).toBe(true);
  });

  test("setColumns aceita um array direto", async () => {
    const { result } = renderHook(() => useTasks(mockBoardId, mockUser));
    const coluna = { id: "c1", title: "Nova", color: null, fixed: false, fixedKey: null, position: 0 };
    await act(async () => result.current.setColumns([coluna]));
    expect(true).toBe(true);
  });
});