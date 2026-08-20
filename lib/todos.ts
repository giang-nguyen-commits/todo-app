import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
};

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
    .select("id, title, is_completed, created_at")
    .order("created_at", { ascending: false });

  return assertNoError(data, error);
}

export async function addTodo(title: string): Promise<Todo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .insert({ title: title.trim() })
    .select("id, title, is_completed, created_at")
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
    .select("id, title, is_completed, created_at")
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
