-- Enable RLS
create extension if not exists "uuid-ossp";

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

create table habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  category text check (category in ('black','blue','red')) not null,
  non_neg boolean default false,
  created_at timestamptz default now(),
  sort_order int default 0
);

create table habit_ticks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  habit_id uuid references habits(id) on delete cascade,
  tick_date date not null,
  unique(habit_id, tick_date)
);

create table daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  log_date date not null,
  mood int check (mood between 0 and 4),
  energy int check (energy between 0 and 4),
  sleep_hours numeric(4,2),
  memorable_moment text,
  intention text,
  unique(user_id, log_date)
);

create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  entry_date date not null unique,
  body text,
  gratitude_1 text,
  gratitude_2 text,
  gratitude_3 text,
  created_at timestamptz default now()
);

create table weekly_reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  review_date date not null,
  went_well text,
  drained text,
  drop_habit text,
  double_down text,
  created_at timestamptz default now()
);

create table trigger_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  habit_name text,
  trigger_text text,
  log_date date,
  created_at timestamptz default now()
);

create table wind_down (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  log_date date not null,
  item_index int not null,
  completed boolean default false,
  unique(user_id, log_date, item_index)
);

create table milestones (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  milestone_id text not null,
  unlocked_at timestamptz default now(),
  unique(user_id, milestone_id)
);

create table app_settings (
  user_id uuid references profiles(id) on delete cascade primary key,
  signal_habit_id uuid references habits(id) on delete set null,
  timer_sessions int default 0
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table habits enable row level security;
alter table habit_ticks enable row level security;
alter table daily_logs enable row level security;
alter table journal_entries enable row level security;
alter table weekly_reviews enable row level security;
alter table trigger_log enable row level security;
alter table wind_down enable row level security;
alter table milestones enable row level security;
alter table app_settings enable row level security;

-- RLS policies (users can only see their own data)
create policy "users_own_data" on profiles for all using (auth.uid() = id);
create policy "users_own_data" on habits for all using (auth.uid() = user_id);
create policy "users_own_data" on habit_ticks for all using (auth.uid() = user_id);
create policy "users_own_data" on daily_logs for all using (auth.uid() = user_id);
create policy "users_own_data" on journal_entries for all using (auth.uid() = user_id);
create policy "users_own_data" on weekly_reviews for all using (auth.uid() = user_id);
create policy "users_own_data" on trigger_log for all using (auth.uid() = user_id);
create policy "users_own_data" on wind_down for all using (auth.uid() = user_id);
create policy "users_own_data" on milestones for all using (auth.uid() = user_id);
create policy "users_own_data" on app_settings for all using (auth.uid() = user_id);
