"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  addTodo,
  deleteTodo,
  toggleTodo,
  type Todo,
} from "@/lib/todos";
import { TodoItem } from "@/components/todo-item";

type Filter = "all" | "active" | "completed";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "active", label: "未完了" },
  { id: "completed", label: "完了済み" },
];

type TodoAppProps = {
  initialTodos: Todo[];
  initialError?: string | null;
};

export function TodoApp({ initialTodos, initialError = null }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(initialError);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.is_completed);
    if (filter === "completed") return todos.filter((todo) => todo.is_completed);
    return todos;
  }, [filter, todos]);

  async function onAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || isAdding) return;

    setIsAdding(true);
    setError(null);
    try {
      const created = await addTodo(nextTitle);
      setTodos((current) => [created, ...current]);
      setTitle("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "追加に失敗しました");
    } finally {
      setIsAdding(false);
    }
  }

  async function onToggle(todo: Todo) {
    if (pendingId) return;
    setPendingId(todo.id);
    setError(null);
    try {
      const updated = await toggleTodo(todo.id, !todo.is_completed);
      setTodos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "更新に失敗しました",
      );
    } finally {
      setPendingId(null);
    }
  }

  async function onDelete(id: string) {
    if (pendingId) return;
    setPendingId(id);
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "削除に失敗しました",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-6">
      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form className="flex items-center gap-2 overflow-visible p-0.5" onSubmit={onAdd}>
        <label className="sr-only" htmlFor="todo-title">
          新しいタスク
        </label>
        <div className="group relative min-w-0 flex-1 origin-left transition-transform duration-200 ease-out focus-within:scale-[1.03]">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-violet-500"
          >
            <path
              d="M10 4.5v11M4.5 10h11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="todo-title"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-violet-500 focus:outline focus:outline-violet-500"
            placeholder="タスクを入力"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoComplete="off"
            disabled={isAdding}
          />
        </div>
        <button
          type="submit"
          aria-label="追加"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-md active:translate-y-0 active:scale-95 focus:outline focus:outline-offset-2 focus:outline-violet-500 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-violet-500 md:h-11 md:w-auto md:px-4"
          disabled={!title.trim() || isAdding}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="size-5 md:hidden"
          >
            <path
              d="M10 4.5v11M4.5 10h11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <span className="hidden md:inline">{isAdding ? "追加中" : "追加"}</span>
        </button>
      </form>

      <div className="mt-4 flex rounded-xl bg-slate-100 p-1 md:mt-5">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`min-w-0 flex-1 rounded-lg px-2 py-2 text-xs transition md:px-3 md:text-sm ${
              filter === item.id
                ? "bg-white font-medium text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleTodos.length === 0 ? (
        <p className="px-2 py-8 text-center text-sm text-slate-400 md:py-12">
          {todos.length === 0
            ? "TODOはまだありません。上のフォームから追加してください。"
            : "このフィルターに該当するTODOはありません。"}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              pending={pendingId === todo.id}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
