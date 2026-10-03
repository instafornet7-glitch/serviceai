create extension if not exists pgcrypto;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 180),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  excerpt text not null check (char_length(excerpt) between 20 and 300),
  content_html text not null check (char_length(content_html) > 0),
  featured_image text,
  category_id uuid not null references public.categories(id) on delete restrict,
  keywords text[] not null default '{}',
  meta_title text check (meta_title is null or char_length(meta_title) <= 180),
  meta_description text check (meta_description is null or char_length(meta_description) <= 300),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_articles_have_date check (status <> 'published' or published_at is not null)
);

create index articles_status_published_at_idx on public.articles (status, published_at desc);
create index articles_category_idx on public.articles (category_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create or replace function public.is_serviceai_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

alter table public.categories enable row level security;
alter table public.articles enable row level security;

grant select on public.categories, public.articles to anon, authenticated;
grant insert, update, delete on public.categories, public.articles to authenticated;

create policy "Anyone can read categories"
on public.categories for select
to anon, authenticated
using (true);

create policy "ServiceAI admins manage categories"
on public.categories for all
to authenticated
using (public.is_serviceai_admin())
with check (public.is_serviceai_admin());

create policy "Anyone can read currently published articles"
on public.articles for select
to anon, authenticated
using (status = 'published' and published_at <= now());

create policy "ServiceAI admins manage articles"
on public.articles for all
to authenticated
using (public.is_serviceai_admin())
with check (public.is_serviceai_admin());

insert into public.categories (name, slug) values
  ('السيرة الذاتية', 'cv'),
  ('مقابلات العمل', 'interviews'),
  ('البحث عن وظيفة', 'job-search'),
  ('رسائل التقديم', 'cover-letters'),
  ('نظام ATS', 'ats'),
  ('تطوير المسار المهني', 'career-development')
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-images', 'article-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can view article images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'article-images');

create policy "ServiceAI admins upload article images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'article-images' and public.is_serviceai_admin());

create policy "ServiceAI admins update article images"
on storage.objects for update
to authenticated
using (bucket_id = 'article-images' and public.is_serviceai_admin())
with check (bucket_id = 'article-images' and public.is_serviceai_admin());

create policy "ServiceAI admins delete article images"
on storage.objects for delete
to authenticated
using (bucket_id = 'article-images' and public.is_serviceai_admin());

grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;

insert into public.articles
  (title, slug, excerpt, content_html, category_id, keywords, meta_title, meta_description, status, published_at)
select
  seed.title, seed.slug, seed.excerpt, seed.content_html, category.id, seed.keywords,
  seed.meta_title, seed.meta_description, 'published', seed.published_at
from (values
  (
    'كيف تكتب سيرة ذاتية تلفت الانتباه؟',
    'how-to-write-professional-cv',
    'خطوات عملية تساعدك على عرض خبراتك بوضوح وترك انطباع أول قوي.',
    '<p>في كثير من الأحيان، تكون سيرتك الذاتية أول ما يطّلع عليه صاحب العمل عنك. لا تحتاج إلى تصميم معقد لتكون مميزة؛ الأهم هو أن تكون منظمة، سهلة القراءة، ومخصصة للدور الذي تتقدم إليه.</p><h2>ابدأ بالأساسيات</h2><p>ضع اسمك ومعلومات التواصل المهنية في أعلى الصفحة، ثم أضف ملخصًا قصيرًا يوضح خبرتك ومجالك وما تبحث عنه. احرص على أن تكون بياناتك حديثة، واستخدم عنوان بريد إلكتروني مناسبًا.</p><h2>رتّب خبراتك بوضوح</h2><p>اعرض خبراتك بترتيب زمني عكسي، بدءًا بالأحدث. لكل دور، اذكر اسم الوظيفة والجهة وفترة العمل، ثم لخّص مسؤولياتك وإنجازاتك باستخدام نقاط موجزة. اجعل الوصف يوضح ما أنجزته، لا المهام اليومية فقط.</p><h2>خصص المحتوى للوظيفة</h2><p>اقرأ وصف الوظيفة وحدد المهارات والخبرات الأكثر صلة بها. ثم أبرز ما يثبت امتلاكك لهذه المهارات باستخدام أمثلة دقيقة من تجاربك. لا تضف كلمات مفتاحية لا تعبر عن خبرتك الفعلية.</p><h2>أبرز المهارات ذات الصلة</h2><p>اجمع المهارات التقنية والعملية التي تخدم الدور المطلوب، واذكر الأدوات أو اللغات أو الشهادات المهمة. حاول إظهار المهارات ضمن خبراتك أيضًا، بدلًا من الاكتفاء بقائمة عامة.</p><h2>اجعل القراءة سهلة</h2><ul><li>استخدم عناوين واضحة وخطًا سهل القراءة.</li><li>حافظ على تنسيق موحد ومسافات مريحة بين الأقسام.</li><li>راجع الإملاء والتواريخ وتناسق أسماء الجهات والمسميات.</li><li>احفظ الملف بصيغة شائعة وسمّه باسم واضح.</li></ul><h2>راجعها قبل الإرسال</h2><p>اطلب من شخص تثق به مراجعة سيرتك، وتأكد من أن كل تفصيل فيها دقيق ومدعوم بتجربتك. السيرة الجيدة عرض مركز لما يجعلك مرشحًا مناسبًا لهذه الفرصة.</p>',
    array['سيرة ذاتية', 'بحث عن عمل', 'كتابة السيرة'],
    'كيف تكتب سيرة ذاتية احترافية تلفت الانتباه؟',
    'دليل عملي لكتابة سيرة ذاتية واضحة واحترافية وإبراز خبراتك وإنجازاتك للوظيفة المناسبة.',
    now() - interval '3 days',
    'cv'
  ),
  (
    'استعد لمقابلتك الوظيفية بثقة',
    'job-interview-preparation-tips',
    'تعرّف على طرق بسيطة تساعدك في التحضير والإجابة عن الأسئلة الشائعة.',
    '<p>قد تبدو المقابلة الوظيفية موقفًا ضاغطًا، لكن التحضير المسبق يمنحك فرصة للتعبير عن خبراتك بهدوء. ركّز على فهم الدور، وتجهيز أمثلة حقيقية، وطرح أسئلتك أنت أيضًا.</p><h2>ابحث عن الجهة والدور</h2><p>اقرأ وصف الوظيفة بعناية، وتعرّف على منتجات الجهة أو خدماتها وأولوياتها المعلنة. دوّن ما يهمك في الدور، وحدد كيف ترتبط خبراتك بمتطلباته.</p><h2>حضّر أمثلة من تجربتك</h2><p>فكر في مواقف مهنية توضح طريقة عملك وإنجازاتك. يمكنك تنظيم إجابتك عبر وصف الموقف، والمطلوب منك، والإجراء الذي اتخذته، والنتيجة. اختر أمثلة حقيقية وموجزة بدلًا من إجابات عامة.</p><h2>تدرّب على الأسئلة الشائعة</h2><ul><li>حدثنا عن نفسك ومسارك المهني.</li><li>ما الذي جذبك إلى هذه الوظيفة؟</li><li>ما المهارة التي طورتها مؤخرًا؟</li><li>حدثنا عن تحدٍّ واجهته وكيف تعاملت معه.</li><li>ما الأسئلة التي تود طرحها علينا؟</li></ul><p>لا تحفظ نصًا حرفيًا. دوّن النقاط الأساسية وتدرّب على شرحها بصوت مرتفع حتى تبدو إجابتك طبيعية.</p><h2>جهز أسئلتك واهتم بالتفاصيل</h2><p>اسأل عن طبيعة الفريق أو أولويات الدور أو خطوات الاختيار التالية. تحقق من موعد المقابلة ومكانها أو رابطها، واحرص على الوصول مبكرًا وتجهيز ما تحتاجه.</p><h2>في نهاية المقابلة</h2><p>استمع للسؤال حتى نهايته، واطلب التوضيح عند الحاجة. من الطبيعي أن تأخذ لحظة لترتيب أفكارك. بعد المقابلة، دوّن ما تعلمته وأرسل رسالة شكر موجزة إذا كان ذلك مناسبًا.</p>',
    array['مقابلات العمل', 'الاستعداد للمقابلة', 'بحث عن وظيفة'],
    'كيف تستعد لمقابلة العمل وتجيب بثقة؟',
    'خطوات عملية للتحضير لمقابلات العمل والبحث عن الشركة والتدرب على الأسئلة الشائعة.',
    now() - interval '2 days',
    'interviews'
  ),
  (
    'حسّن حضورك المهني على لينكدإن',
    'improve-linkedin-professional-profile',
    'اجعل ملفك المهني يعكس خبراتك، ويقربك من الفرص المناسبة لك.',
    '<p>سواء كنت تبحث عن وظيفة جديدة أو توسّع شبكة علاقاتك، يمكن لملفك على لينكدإن أن يكون نافذتك المهنية. الهدف ليس إضافة أكبر قدر من المعلومات، بل تسهيل فهم ما تقدمه وما تطمح إليه.</p><h2>اختر صورة وعنوانًا واضحين</h2><p>استخدم صورة حديثة مناسبة للسياق المهني، واكتب عنوانًا يعبّر عن تخصصك أو نوع القيمة التي تقدمها. لا تقتصر على المسمى الوظيفي إن كان بإمكانك توضيح مجال خبرتك أيضًا.</p><h2>اكتب ملخصًا بصوتك</h2><p>اجعل النبذة موجزة، وابدأ بما تعمل عليه أو ما يميز تجربتك. أضف أنواع المشكلات التي تحب حلها، ثم اذكر مهاراتك أو مجالات اهتمامك، وأنهِ بما تبحث عنه أو الطريقة المناسبة للتواصل.</p><h2>حدّث خبراتك وإنجازاتك</h2><p>أضف وصفًا مختصرًا لكل دور، مع التركيز على أثر عملك والمشاريع ذات الصلة. نظّم المعلومات ليسهل تصفحها، وتأكد من تطابق التواريخ والمسميات مع سيرتك الذاتية.</p><h2>أضف المهارات والمشاريع</h2><p>اختر مهارات ترتبط فعلًا بخبرتك وأهدافك. أضف المشاريع أو الشهادات أو النماذج المهنية التي تفيد من يراجع ملفك، مع وصف موجز لسياقها ودورك فيها.</p><h2>حافظ على حداثة ملفك</h2><ul><li>راجع معلومات التواصل ونطاق ظهور الملف.</li><li>احذف المهارات أو التفاصيل التي لم تعد تمثلك.</li><li>تأكد من أن رابط ملفك سهل المشاركة.</li><li>اطلب رأيًا صريحًا من شخص تثق به.</li></ul><p>ملفك المهني ليس صفحة ثابتة؛ حدّثه عندما تكتسب خبرة جديدة أو تتغير أهدافك، واجعله يعكس المرحلة التي تتطلع إليها.</p>',
    array['لينكدإن', 'الحضور المهني', 'التطوير المهني'],
    'نصائح لتحسين ملفك المهني على لينكدإن',
    'تعرف على خطوات تحديث ملف لينكدإن وإبراز خبراتك ومهاراتك وفرصك المهنية.',
    now() - interval '1 day',
    'career-development'
  )
) as seed(title, slug, excerpt, content_html, keywords, meta_title, meta_description, published_at, category_slug)
join public.categories as category on category.slug = seed.category_slug
on conflict (slug) do nothing;
