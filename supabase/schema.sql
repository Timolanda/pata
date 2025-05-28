-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create tables
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  username text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.treasures (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  latitude double precision not null,
  longitude double precision not null,
  hint text not null,
  reward_type text not null,
  reward_value integer not null,
  reward_description text not null,
  rarity text not null,
  collection text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.users not null,
  location geography(Point, 4326) generated always as (st_point(longitude, latitude)) stored
);

create table public.discoveries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  treasure_id uuid references public.treasures not null,
  discovered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  claimed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reward_claimed boolean default false not null,
  unique(user_id, treasure_id)
);

create table public.collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  required_treasures integer not null,
  reward_type text not null,
  reward_value integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_locations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  latitude double precision not null,
  longitude double precision not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  location geography(Point, 4326) generated always as (st_point(longitude, latitude)) stored
);

-- Create indexes
create index treasures_location_idx on public.treasures using gist(location);
create index user_locations_location_idx on public.user_locations using gist(location);
create index discoveries_user_id_idx on public.discoveries(user_id);
create index discoveries_treasure_id_idx on public.discoveries(treasure_id);

-- Create functions
create or replace function get_nearby_treasures(
  p_latitude double precision,
  p_longitude double precision,
  p_radius double precision
) returns setof public.treasures as $$
begin
  return query
  select *
  from public.treasures
  where st_dwithin(
    location,
    st_point(p_longitude, p_latitude)::geography,
    p_radius
  );
end;
$$ language plpgsql;

create or replace function get_collection_progress(
  p_user_id uuid,
  p_collection_id uuid
) returns json as $$
declare
  v_collection public.collections;
  v_discovered_count integer;
begin
  -- Get collection details
  select * into v_collection
  from public.collections
  where id = p_collection_id;

  -- Count discovered treasures in collection
  select count(*)
  into v_discovered_count
  from public.discoveries d
  join public.treasures t on d.treasure_id = t.id
  where d.user_id = p_user_id
  and t.collection = v_collection.name;

  return json_build_object(
    'collection', v_collection,
    'discovered_count', v_discovered_count,
    'progress', (v_discovered_count::float / v_collection.required_treasures) * 100
  );
end;
$$ language plpgsql;

-- Create RLS policies
alter table public.users enable row level security;
alter table public.treasures enable row level security;
alter table public.discoveries enable row level security;
alter table public.collections enable row level security;
alter table public.user_locations enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Anyone can view treasures"
  on public.treasures for select
  to authenticated
  using (true);

create policy "Only admins can create treasures"
  on public.treasures for insert
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Users can view their own discoveries"
  on public.discoveries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own discoveries"
  on public.discoveries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Anyone can view collections"
  on public.collections for select
  to authenticated
  using (true);

create policy "Users can view their own location"
  on public.user_locations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own location"
  on public.user_locations for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create triggers
create or replace function update_last_login()
returns trigger as $$
begin
  new.last_login = now();
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

create trigger on_user_login
  before update on public.users
  for each row
  execute procedure public.update_last_login(); 