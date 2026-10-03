insert into public.site_preferences (key, value)
values ('home_slider', '{"slides":[]}'::jsonb)
on conflict (key) do nothing;

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-images', 'article-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view article images" on storage.objects;
create policy "Anyone can view article images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'article-images');

drop policy if exists "ServiceAI admins upload article images" on storage.objects;
create policy "ServiceAI admins upload article images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'article-images' and public.is_serviceai_admin());

drop policy if exists "ServiceAI admins update article images" on storage.objects;
create policy "ServiceAI admins update article images"
on storage.objects for update
to authenticated
using (bucket_id = 'article-images' and public.is_serviceai_admin())
with check (bucket_id = 'article-images' and public.is_serviceai_admin());

drop policy if exists "ServiceAI admins delete article images" on storage.objects;
create policy "ServiceAI admins delete article images"
on storage.objects for delete
to authenticated
using (bucket_id = 'article-images' and public.is_serviceai_admin());

grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;
