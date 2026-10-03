create table if not exists public.site_preferences (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_preferences
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.site_settings') is not null
    and exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'site_settings' and column_name = 'adsense_client'
    )
    and exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'site_settings' and column_name = 'ad_slots'
    )
    and exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'site_settings' and column_name = 'social_links'
    )
  then
    execute $migration$
      insert into public.site_preferences (key, value)
      select 'adsense', jsonb_build_object(
        'client', adsense_client,
        'slots', ad_slots
      )
      from public.site_settings
      where id::text = 'global'
      on conflict (key) do update set value = excluded.value
    $migration$;

    execute $migration$
      insert into public.site_preferences (key, value)
      select 'contact', jsonb_build_object(
        'whatsapp', coalesce(social_links ->> 'whatsapp', '')
      )
      from public.site_settings
      where id::text = 'global'
      on conflict (key) do update set value = excluded.value
    $migration$;

    execute $migration$
      insert into public.site_preferences (key, value)
      select 'social', coalesce(social_links, '{}'::jsonb) - 'whatsapp'
      from public.site_settings
      where id::text = 'global'
      on conflict (key) do update set value = excluded.value
    $migration$;
  end if;
end;
$$;

insert into public.site_preferences (key, value)
values
  ('adsense', '{"client":"","slots":{}}'::jsonb),
  ('contact', '{"whatsapp":""}'::jsonb),
  ('social', '{"instagram":"","facebook":"","x":"","linkedin":"","youtube":""}'::jsonb)
on conflict (key) do nothing;

alter table public.site_preferences enable row level security;

grant select on public.site_preferences to anon, authenticated, service_role;
grant insert, update on public.site_preferences to authenticated;

drop policy if exists "Anyone can read public site preferences" on public.site_preferences;
create policy "Anyone can read public site preferences"
on public.site_preferences for select
to anon, authenticated
using (true);

drop policy if exists "ServiceAI admins insert site preferences" on public.site_preferences;
create policy "ServiceAI admins insert site preferences"
on public.site_preferences for insert
to authenticated
with check (public.is_serviceai_admin());

drop policy if exists "ServiceAI admins update site preferences" on public.site_preferences;
create policy "ServiceAI admins update site preferences"
on public.site_preferences for update
to authenticated
using (public.is_serviceai_admin())
with check (public.is_serviceai_admin());
