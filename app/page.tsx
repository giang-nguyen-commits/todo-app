import { TodoApp } from "@/components/todo-app";
import { createClient } from "@/lib/supabase/server";
import { getTodos, type Todo } from "@/lib/todos";

export default async function Home() {
  const supabase = await createClient();
  let initialTodos: Todo[] = [];
  let initialError: string | null = null;

  try {
    initialTodos = await getTodos(supabase);
  } catch (caught) {
    initialError =
      caught instanceof Error ? caught.message : "TODOの取得に失敗しました";
  }

  return <TodoApp initialTodos={initialTodos} initialError={initialError} />;
}
