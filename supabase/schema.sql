-- ============================================================
-- El Rincón Canario — Schema completo + datos demo
-- Ejecutar en: Supabase > SQL Editor > New query > Run
-- ============================================================


-- ── 1. EXTENSIONES ──────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── 2. TABLAS ───────────────────────────────────────────────

-- Configuración general del sitio (clave/valor)
create table if not exists site_config (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,
  value       text,
  created_at  timestamptz default now()
);

-- Categorías del menú
create table if not exists menu_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  sort_order  int  default 0,
  created_at  timestamptz default now()
);

-- Platos del menú
create table if not exists menu_items (
  id          uuid primary key default uuid_generate_v4(),
  category_id uuid references menu_categories(id) on delete cascade,
  name        text not null,
  description text,
  price       text not null,
  allergens   text[],
  image       text,
  available   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Galería de imágenes
create table if not exists gallery (
  id          uuid primary key default uuid_generate_v4(),
  src         text not null,
  alt         text not null,
  caption     text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Testimonios
create table if not exists testimonials (
  id          uuid primary key default uuid_generate_v4(),
  author      text not null,
  role        text,
  text        text not null,
  rating      int check (rating between 1 and 5),
  avatar      text,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- Reservas (formulario público)
create table if not exists reservations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text not null,
  date        text not null,
  time        text not null,
  guests      text not null,
  notes       text,
  status      text default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at  timestamptz default now()
);

-- Mensajes de contacto (formulario público)
create table if not exists contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);


-- ── 3. ÍNDICES ──────────────────────────────────────────────
create index if not exists idx_menu_items_category   on menu_items(category_id);
create index if not exists idx_menu_items_available  on menu_items(available);
create index if not exists idx_reservations_date     on reservations(date);
create index if not exists idx_reservations_status   on reservations(status);
create index if not exists idx_contact_messages_read on contact_messages(read);
create index if not exists idx_testimonials_pub      on testimonials(published);


-- ── 4. ROW LEVEL SECURITY ───────────────────────────────────

alter table site_config        enable row level security;
alter table menu_categories    enable row level security;
alter table menu_items         enable row level security;
alter table gallery            enable row level security;
alter table testimonials       enable row level security;
alter table reservations       enable row level security;
alter table contact_messages   enable row level security;

-- Lectura pública (anon puede leer la web)
create policy "public_read_site_config"      on site_config      for select to anon using (true);
create policy "public_read_menu_categories"  on menu_categories  for select to anon using (true);
create policy "public_read_menu_items"       on menu_items       for select to anon using (available = true);
create policy "public_read_gallery"          on gallery          for select to anon using (true);
create policy "public_read_testimonials"     on testimonials     for select to anon using (published = true);

-- Formularios públicos: inserción sin autenticación
create policy "public_insert_reservations"   on reservations     for insert to anon with check (true);
create policy "public_insert_contact"        on contact_messages for insert to anon with check (true);

-- Admin autenticado: control total sobre todo
create policy "auth_all_site_config"         on site_config        for all to authenticated using (true) with check (true);
create policy "auth_all_menu_categories"     on menu_categories    for all to authenticated using (true) with check (true);
create policy "auth_all_menu_items"          on menu_items         for all to authenticated using (true) with check (true);
create policy "auth_all_gallery"             on gallery            for all to authenticated using (true) with check (true);
create policy "auth_all_testimonials"        on testimonials       for all to authenticated using (true) with check (true);
create policy "auth_all_reservations"        on reservations       for all to authenticated using (true) with check (true);
create policy "auth_all_contact_messages"    on contact_messages   for all to authenticated using (true) with check (true);


-- ── 5. DATOS DEMO ───────────────────────────────────────────

-- Configuración del sitio
insert into site_config (key, value) values
  ('siteName',        'El Rincón Canario'),
  ('metaDescription', 'Cocina tradicional canaria en el corazón de Santa Cruz de Tenerife.'),
  ('phone',           '+34 922 123 456'),
  ('email',           'hola@elrinconcanario.com'),
  ('address',         'Calle La Noria 14, Santa Cruz de Tenerife'),
  ('whatsapp',        '+34 622 123 456'),
  ('hours',           'Lunes a domingo, de 13:00 a 16:00 y de 20:00 a 23:00');

-- Categorías del menú
insert into menu_categories (name, sort_order) values
  ('Entrantes',   1),
  ('Principales', 2),
  ('Postres',     3);

-- Platos (usando subquery para el category_id)
insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Papas arrugadas con mojo',
  'Papas canarias cocidas en sal gorda con mojo rojo y verde de la casa',
  '6,50 €',
  array['vegetariano'],
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&h=400&q=80',
  1
from menu_categories where name = 'Entrantes';

insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Queso asado con miel de palma',
  'Queso de cabra local asado a la plancha con miel de palma de La Gomera',
  '9,00 €',
  array['vegetariano', 'lácteos'],
  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a2d4?auto=format&fit=crop&w=600&h=400&q=80',
  2
from menu_categories where name = 'Entrantes';

insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Ropa vieja canaria',
  'Garbanzos, pollo y chorizo en salsa con pimientos y tomate',
  '13,50 €',
  array['gluten', 'apio'],
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&h=400&q=80',
  1
from menu_categories where name = 'Principales';

insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Vieja a la espalda',
  'Pescado local del día a la plancha con papas y mojo',
  '18,00 €',
  array['sin gluten', 'pescado'],
  'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&h=400&q=80',
  2
from menu_categories where name = 'Principales';

insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Conejo en salmorejo',
  'Receta tradicional canaria marinada en vinagre, ajo y pimentón',
  '15,00 €',
  array['sin gluten'],
  'https://images.unsplash.com/photo-1544025162-d76538b2a645?auto=format&fit=crop&w=600&h=400&q=80',
  3
from menu_categories where name = 'Principales';

insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Bienmesabe con helado',
  'Crema de almendras y miel con helado de guanábana',
  '5,50 €',
  array['vegetariano', 'frutos secos', 'lácteos'],
  'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&h=400&q=80',
  1
from menu_categories where name = 'Postres';

insert into menu_items (category_id, name, description, price, allergens, image, sort_order)
select id, 'Frangollo canario',
  'Postre tradicional de millo con pasas y almendras',
  '5,00 €',
  array['vegetariano', 'frutos secos', 'lácteos'],
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&h=400&q=80',
  2
from menu_categories where name = 'Postres';

-- Galería
insert into gallery (src, alt, sort_order) values
  ('https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80', 'Papas arrugadas con mojo', 1),
  ('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', 'Ropa vieja canaria',       2),
  ('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80', 'Terraza del restaurante', 3),
  ('https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80', 'Pescado fresco del día',   4),
  ('https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', 'Postres caseros',         5),
  ('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', 'Ambiente interior',       6);

-- Testimonios
insert into testimonials (author, role, text, rating, published) values
  ('María González', 'Visitante habitual',
   'El mejor conejo en salmorejo que he probado en mi vida. Un sitio que transmite calor de hogar.',
   5, true),
  ('James Whitfield', 'Turista, Reino Unido',
   'Authentic Canarian food in a wonderful atmosphere. The papas arrugadas were incredible!',
   5, true),
  ('Carlos Mendoza', 'Cliente desde 2010',
   'Llevo más de 15 años viniendo aquí. La calidad nunca baja y el trato siempre es familiar.',
   5, true);
