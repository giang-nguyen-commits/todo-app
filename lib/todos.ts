import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const TODO_PRIORITIES = ["low", "medium", "high"] as const;
export type TodoPriority = (typeof TODO_PRIORITIES)[number];

export const TODO_PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const TODO_PRIORITY_RANK: Record<TodoPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const TODO_COLUMNS = "id, title, is_completed, created_at, priority" as const;

export type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  priority: TodoPriority;
};

export function isTodoPriority(value: string): value is TodoPriority {
  return (TODO_PRIORITIES as readonly string[]).includes(value);
}

export function compareTodosByPriority(
  a: Todo,
  b: Todo,
  direction: "asc" | "desc" = "desc",
): number {
  const diff = TODO_PRIORITY_RANK[a.priority] - TODO_PRIORITY_RANK[b.priority];
  if (diff !== 0) {
    return direction === "desc" ? -diff : diff;
  }
  return b.created_at.localeCompare(a.created_at);
}

function assertNoError<T>(
  data: T | null,
  error: { message: string } | null,
): T {
  if (error) {
    throw new Error(error.message);
  }
  if (data === null) {
    throw new Error("Supabase did not return data");
  }
  return data;
}

export async function getTodos(
  supabase: SupabaseClient = createClient(),
): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select(TODO_COLUMNS)
    .order("created_at", { ascending: false });

  return assertNoError(data, error);
}

export async function addTodo(
  title: string,
  priority: TodoPriority = "medium",
): Promise<Todo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .insert({ title: title.trim(), priority })
    .select(TODO_COLUMNS)
    .single();

  return assertNoError(data, error);
}

export async function toggleTodo(
  id: string,
  isCompleted: boolean,
): Promise<Todo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .update({ is_completed: isCompleted })
    .eq("id", id)
    .select(TODO_COLUMNS)
    .single();

  return assertNoError(data, error);
}

export async function updateTodo(
  id: string,
  updates: { title: string; priority: TodoPriority },
): Promise<Todo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .update({ title: updates.title.trim(), priority: updates.priority })
    .eq("id", id)
    .select(TODO_COLUMNS)
    .single();

  return assertNoError(data, error);
}

export async function deleteTodo(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
