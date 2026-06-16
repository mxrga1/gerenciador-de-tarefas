import { renderHook, act } from "@testing-library/react";
import { useTasks } from "../pages/Home/useTasks";

describe("useTasks", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test("deve adicionar uma tarefa", () => {

    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.setTitle("Minha tarefa");
      result.current.setDesc("Descrição teste");
    });

    act(() => {
      result.current.addTask("pending");
    });

    expect(result.current.tasks.length).toBe(1);

    expect(result.current.tasks[0].title).toBe("Minha tarefa");

    expect(result.current.tasks[0].status).toBe("pending");
  });

  test("deve deletar uma tarefa", () => {

    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.setTitle("Task");
    });

    act(() => {
      result.current.addTask("pending");
    });

    const id = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(id);
    });

    expect(result.current.tasks.length).toBe(0);
  });

});

test("deve salvar tarefas no localStorage", () => {

  const { result } = renderHook(() => useTasks());

  act(() => {
    result.current.setTitle("Salvar tarefa");
  });

  act(() => {
    result.current.addTask("pending");
  });

  const saved = JSON.parse(
    localStorage.getItem("tasks")
  );

  expect(saved.length).toBe(1);

  expect(saved[0].title).toBe("Salvar tarefa");
});

test("deve carregar tarefas do localStorage", () => {

  localStorage.setItem(
    "tasks",
    JSON.stringify([
      {
        id: "1",
        title: "Task carregada",
        desc: "Descrição",
        status: "done"
      }
    ])
  );

  const { result } = renderHook(() => useTasks());

  expect(result.current.tasks.length).toBe(1);

  expect(result.current.tasks[0].title)
    .toBe("Task carregada");

  expect(result.current.tasks[0].status)
    .toBe("done");
});