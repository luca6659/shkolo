begin;

-- Internal tables are inaccessible to API roles. The public RPCs expose scoped operations.
create schema school_private;
revoke all on schema school_private from public, anon, authenticated;
create table school_private.pupils (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  stratum text check (stratum in ('1','2','2Б'))
);
create table school_private.admins (
  id uuid primary key references school_private.pupils(id) on delete cascade
);
create table school_private.lessons (
  id integer primary key,
  answers text[] not null
);
create table school_private.results (
  pupil uuid not null references school_private.pupils(id) on delete cascade,
  attempt uuid not null,
  lesson integer not null references school_private.lessons(id),
  score integer not null check (score between 2 and 6),
  finished timestamptz not null default now(),
  primary key (pupil, attempt)
);
create index results_by_lesson on school_private.results(pupil,lesson,finished);
create table school_private.goods (
  id text primary key, coins integer not null, gems integer not null
);
create table school_private.purchases (
  pupil uuid not null references school_private.pupils(id) on delete cascade,
  item text not null references school_private.goods(id),
  coins integer not null, gems integer not null,
  primary key (pupil,item)
);
create table school_private.homework (
  id uuid primary key, stratum text not null check (stratum in ('1','2','2Б')),
  lesson integer not null references school_private.lessons(id),
  title text not null check (length(trim(title)) between 1 and 120),
  due date not null, created timestamptz not null default now(), archived boolean not null default false
);
alter table school_private.pupils enable row level security;
alter table school_private.admins enable row level security;
alter table school_private.lessons enable row level security;
alter table school_private.results enable row level security;
alter table school_private.goods enable row level security;
alter table school_private.purchases enable row level security;
alter table school_private.homework enable row level security;

insert into school_private.goods values
 ('fox',450,0),('owl',700,0),('mint',0,18),('night',0,24),
 ('star',180,0),('fire',180,0),('freeze',350,0),('hearts',0,12);

insert into school_private.lessons values
 (1, array['Hi! I’m Alex. Nice to meet you.', 'is', 'Верно', 'goodbye=до свидания;hello=привет;please=пожалуйста', 'Pretty good! And you?', 'What is your name?']),
 (2, array['Let’s hang out this weekend.', 'awesome', 'Верно', 'awesome=круто;grab=схватить;hang out=тусоваться', 'Sounds good! See you at six.', 'What are you up to?']),
 (3, array['Could you say that again?', 'Sorry, could you repeat that?', 'slowly', 'Верно', 'meaning=значение;repeat=повтори;slowly=медленно', 'I didn’t catch that.']),
 (4, array['How was your weekend?', 'up', 'Верно', 'hobby=хобби;weather=погода;weekend=выходные', 'I’m just going to chill at home.', 'Do you have any plans?']),
 (5, array['She doesn’t like spicy food.', 'am', 'Неверно', 'I=am;she=is;they=are', 'Did you watch the match?', 'We were at the cinema.']),
 (6, array['Can I get a latte, please?', 'cost', 'Верно', 'discount=скидка;nearest=ближайший;receipt=чек', 'No, that’s all. Thanks.', 'Could you help me, please?']),
 (7, array['I’m gonna go.', '’ve', 'Верно', 'going to=gonna;got to=gotta;want to=wanna', 'Sure! I’d love to.', 'I’ve got to run.']),
 (8, array['I love photography because it helps me notice little things.', 'opinion', 'Верно', 'because=потому что;for example=например;in my opinion=по моему мнению', 'That’s amazing! I’m so happy for you.', 'It was great talking to you.']);

create function school_private.on_confirmed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null then
    insert into school_private.pupils(id,name)
      values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data->>'name'),''),'Ученик'),80))
      on conflict (id) do nothing;
  end if;
  return new;
end $$;
create trigger shkolo_confirmed after insert or update of email_confirmed_at on auth.users
for each row execute function school_private.on_confirmed();
insert into school_private.pupils(id,name)
select id,left(coalesce(nullif(trim(raw_user_meta_data->>'name'),''),'Ученик'),80)
from auth.users where email_confirmed_at is not null on conflict do nothing;

create view school_private.totals as
select p.id,p.name,p.stratum,count(r.attempt)::int as completed,
  coalesce(sum(r.score*10),0)::int as xp,
  coalesce(sum(r.score*5),0)::int as earned_coins,
  count(*) filter (where r.score=6)::int as earned_gems,
  max(r.finished) as last_lesson
from school_private.pupils p left join school_private.results r on r.pupil=p.id
group by p.id;

create function school_private.require_admin() returns void
language plpgsql stable set search_path = '' as $$
begin
  if not exists(select from school_private.admins where id=auth.uid()) then
    raise exception 'Требуются права администратора' using errcode='42501';
  end if;
end $$;

create function public.school_snapshot() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  tier text;
  admin boolean := exists(select from school_private.admins where id=me);
begin
  select stratum into tier from school_private.pupils where id=me;
  if not found then raise exception 'Профиль школы пока недоступен'; end if;
  return jsonb_build_object(
    'isAdmin',admin,'stratum',tier,
    'roster',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'name',t.name,
      'stratum',t.stratum,'xp',t.xp,'completed',t.completed,'lastLesson',t.last_lesson)
      order by t.xp desc,t.name,t.id) from school_private.totals t
      where t.id=me or admin or t.stratum=tier),'[]'::jsonb),
    'owned',coalesce((select jsonb_agg(item) from school_private.purchases where pupil=me),'[]'::jsonb),
    'coins',(select earned_coins from school_private.totals where id=me) -
      coalesce((select sum(coins) from school_private.purchases where pupil=me),0),
    'gems',(select earned_gems from school_private.totals where id=me) -
      coalesce((select sum(gems) from school_private.purchases where pupil=me),0),
    'completedLessons',coalesce((select jsonb_agg(distinct lesson) from school_private.results where pupil=me),'[]'::jsonb),
    'days',coalesce((select jsonb_agg(to_jsonb(d) order by d.day desc) from (
      select (finished at time zone 'Europe/Moscow')::date as day,count(*) as lessons,sum(score*10) as xp
      from school_private.results where pupil=me group by 1) d),'[]'::jsonb),
    'homework',coalesce((select jsonb_agg(jsonb_build_object('id',h.id,'title',h.title,
      'stratum',h.stratum,'lesson',h.lesson,'due',h.due,'archived',h.archived,
      'done',exists(select from school_private.results r where r.pupil=me and r.lesson=h.lesson and r.finished>=h.created),
      'submitted',(select count(*) from school_private.pupils p where p.stratum=h.stratum and exists
        (select from school_private.results r where r.pupil=p.id and r.lesson=h.lesson and r.finished>=h.created)))
      order by h.archived,h.due,h.created) from school_private.homework h
      where admin or (h.stratum=tier and not h.archived)),'[]'::jsonb)
  );
end $$;

create function public.school_finish(p_attempt uuid,p_lesson integer,p_answers text[]) returns void
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  key text[];
  correct integer;
begin
  perform 1 from school_private.pupils where id=me for update;
  if not found then raise exception 'Профиль не найден'; end if;
  if exists(select from school_private.results where pupil=me and attempt=p_attempt) then return; end if;
  select answers into strict key from school_private.lessons where id=p_lesson;
  if exists(select from school_private.lessons l where l.id<p_lesson and not exists
    (select from school_private.results r where r.pupil=me and r.lesson=l.id)) then
    raise exception 'Сначала пройди предыдущие уроки'; end if;
  if cardinality(p_answers) is distinct from cardinality(key) then raise exception 'Заверши все задания'; end if;
  select count(*) into correct from generate_subscripts(key,1) i where key[i]=p_answers[i];
  if correct<2 then raise exception 'Попробуй пройти урок ещё раз'; end if;
  insert into school_private.results(pupil,attempt,lesson,score) values(me,p_attempt,p_lesson,correct);
end $$;

create function public.school_buy(p_item text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  cost school_private.goods;
  balance_coins integer;
  balance_gems integer;
begin
  perform 1 from school_private.pupils where id=me for update;
  if not found then raise exception 'Профиль не найден'; end if;
  if exists(select from school_private.purchases where pupil=me and item=p_item) then return; end if;
  select * into strict cost from school_private.goods where id=p_item;
  select earned_coins-coalesce((select sum(coins) from school_private.purchases where pupil=me),0),
         earned_gems-coalesce((select sum(gems) from school_private.purchases where pupil=me),0)
    into balance_coins,balance_gems from school_private.totals where id=me;
  if balance_coins<cost.coins or balance_gems<cost.gems then raise exception 'Не хватает валюты'; end if;
  insert into school_private.purchases values(me,p_item,cost.coins,cost.gems);
end $$;

create function public.school_move(p_pupil uuid,p_stratum text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform school_private.require_admin();
  update school_private.pupils set stratum=p_stratum where id=p_pupil;
  if not found then raise exception 'Ученик не найден'; end if;
end $$;

create function public.school_publish(p_id uuid,p_title text,p_stratum text,p_lesson integer,p_due date) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform school_private.require_admin();
  if p_due < (now() at time zone 'Europe/Moscow')::date then raise exception 'Проверь срок задания'; end if;
  insert into school_private.homework(id,title,stratum,lesson,due)
    values(p_id,trim(p_title),p_stratum,p_lesson,p_due) on conflict (id) do nothing;
end $$;

create function public.school_archive(p_id uuid,p_archived boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform school_private.require_admin();
  update school_private.homework set archived=p_archived where id=p_id;
  if not found then raise exception 'Задание не найдено'; end if;
end $$;

revoke all on all functions in schema school_private from public, anon, authenticated;
revoke all on function public.school_snapshot(),public.school_finish(uuid,integer,text[]),
  public.school_buy(text),public.school_move(uuid,text),public.school_publish(uuid,text,text,integer,date),
  public.school_archive(uuid,boolean) from public, anon, authenticated;
grant execute on function public.school_snapshot(),public.school_finish(uuid,integer,text[]),
  public.school_buy(text),public.school_move(uuid,text),public.school_publish(uuid,text,text,integer,date),
  public.school_archive(uuid,boolean) to authenticated;
commit;
