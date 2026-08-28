"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  addTodo,
  compareTodosByPriority,
  deleteTodo,
  isTodoPriority,
  TODO_PRIORITIES,
  TODO_PRIORITY_LABELS,
  toggleTodo,
  updateTodo,
  type Todo,
  type TodoPriority,
} from "@/lib/todos";

type Filter = "all" | "active" | "completed";
type Sort = "created" | "priority-desc" | "priority-asc";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "active", label: "未完了" },
  { id: "completed", label: "完了済み" },
];

const sorts: { id: Sort; label: string }[] = [
  { id: "created", label: "新しい順" },
  { id: "priority-desc", label: "優先度が高い順" },
  { id: "priority-asc", label: "優先度が低い順" },
];

const PRIORITY_BADGE_CLASS: Record<TodoPriority, string> = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-800",
  low: "bg-slate-100 text-slate-600",
};

type TodoAppProps = {
  initialTodos: Todo[];
  initialError?: string | null;
};

export function TodoApp({ initialTodos, initialError = null }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("created");
  const [error, setError] = useState<string | null>(initialError);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<TodoPriority>("medium");

  const visibleTodos = useMemo(() => {
    const filtered =
      filter === "active"
        ? todos.filter((todo) => !todo.is_completed)
        : filter === "completed"
          ? todos.filter((todo) => todo.is_completed)
          : todos;

    if (sort === "created") return filtered;

    return [...filtered].sort((a, b) =>
      compareTodosByPriority(a, b, sort === "priority-desc" ? "desc" : "asc"),
    );
  }, [filter, sort, todos]);

  async function onAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || isAdding) return;

    setIsAdding(true);
    setError(null);
    try {
      const created = await addTodo(nextTitle, priority);
      setTodos((current) => [created, ...current]);
      setTitle("");
      setPriority("medium");
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
      if (editingId === id) {
        setEditingId(null);
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "削除に失敗しました",
      );
    } finally {
      setPendingId(null);
    }
  }

  function startEdit(todo: Todo) {
    if (pendingId) return;
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditPriority("medium");
  }

  async function onSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || pendingId) return;

    const nextTitle = editTitle.trim();
    if (!nextTitle) return;

    setPendingId(editingId);
    setError(null);
    try {
      const updated = await updateTodo(editingId, {
        title: nextTitle,
        priority: editPriority,
      });
      setTodos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setEditingId(null);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "更新に失敗しました",
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
        <label className="sr-only" htmlFor="todo-priority">
          優先度
        </label>
        <select
          id="todo-priority"
          className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition-colors duration-200 focus:border-violet-500 focus:outline focus:outline-violet-500 disabled:opacity-40"
          value={priority}
          onChange={(event) => {
            if (isTodoPriority(event.target.value)) {
              setPriority(event.target.value);
            }
          }}
          disabled={isAdding}
        >
          {TODO_PRIORITIES.map((level) => (
            <option key={level} value={level}>
              {TODO_PRIORITY_LABELS[level]}
            </option>
          ))}
        </select>
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

      <div className="mt-4 flex flex-col gap-2 md:mt-5 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 rounded-xl bg-slate-100 p-1">
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
        <label className="flex shrink-0 items-center gap-2 text-sm text-slate-500" htmlFor="todo-sort">
          <span className="sr-only md:not-sr-only">並び順</span>
          <select
            id="todo-sort"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition-colors duration-200 focus:border-violet-500 focus:outline focus:outline-violet-500 md:w-auto"
            value={sort}
            onChange={(event) => {
              const nextSort = sorts.find((item) => item.id === event.target.value);
              if (nextSort) setSort(nextSort.id);
            }}
          >
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
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
            <li
              key={todo.id}
              className="flex items-center gap-2 py-2.5 md:gap-3 md:py-3"
            >
              <input
                id={`todo-${todo.id}`}
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => onToggle(todo)}
                disabled={pendingId === todo.id}
                className="size-4 accent-violet-500"
              />
              {editingId === todo.id ? (
                <form
                  className="flex min-w-0 flex-1 items-center gap-2"
                  onSubmit={onSaveEdit}
                >
                  <label className="sr-only" htmlFor={`edit-title-${todo.id}`}>
                    タイトルを編集
                  </label>
                  <input
                    id={`edit-title-${todo.id}`}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-900 outline-none focus:border-violet-500 focus:outline focus:outline-violet-500"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    disabled={pendingId === todo.id}
                    autoComplete="off"
                    autoFocus
                  />
                  <label className="sr-only" htmlFor={`edit-priority-${todo.id}`}>
                    優先度を編集
                  </label>
                  <select
                    id={`edit-priority-${todo.id}`}
                    className="h-9 shrink-0 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:outline focus:outline-violet-500 disabled:opacity-40"
                    value={editPriority}
                    onChange={(event) => {
                      if (isTodoPriority(event.target.value)) {
                        setEditPriority(event.target.value);
                      }
                    }}
                    disabled={pendingId === todo.id}
                  >
                    {TODO_PRIORITIES.map((level) => (
                      <option key={level} value={level}>
                        {TODO_PRIORITY_LABELS[level]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!editTitle.trim() || pendingId === todo.id}
                    className="rounded-lg px-2 py-1 text-sm font-medium text-violet-600 transition hover:bg-violet-50 disabled:opacity-40"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={pendingId === todo.id}
                    className="rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                  >
                    キャンセル
                  </button>
                </form>
              ) : (
                <>
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`min-w-0 flex-1 text-sm ${
                      todo.is_completed
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {todo.title}
                  </label>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE_CLASS[todo.priority]}`}
                  >
                    {TODO_PRIORITY_LABELS[todo.priority]}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(todo)}
                    disabled={pendingId === todo.id}
                    className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(todo.id)}
                    disabled={pendingId === todo.id}
                    className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-red-600 disabled:opacity-40"
                  >
                    削除
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
