"use client";

import type { Todo } from "@/lib/todos";

type TodoItemProps = {
  todo: Todo;
  pending: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, pending, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2 py-2.5 md:gap-3 md:py-3">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.is_completed}
        onChange={() => onToggle(todo)}
        disabled={pending}
        className="size-4 accent-violet-500"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 text-sm ${
          todo.is_completed ? "text-slate-400 line-through" : "text-slate-900"
        }`}
      >
        {todo.title}
      </label>
      <button
        type="button"
        aria-label={`${todo.title}を削除`}
        onClick={() => onDelete(todo.id)}
        disabled={pending}
        className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "削除中" : "削除"}
      </button>
    </li>
  );
}
