-- TODO に優先度（低 / 中 / 高）を追加する
alter table public.todos
  add column if not exists priority text not null default 'medium';

alter table public.todos
  add constraint todos_priority_check
  check (priority in ('low', 'medium', 'high'));
