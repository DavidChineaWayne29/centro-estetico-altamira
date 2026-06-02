-- Migration: add English description to menu items
-- Run in: Supabase > SQL Editor

alter table menu_items add column if not exists description_en text;

-- English descriptions for the demo data
update menu_items set description_en = 'Canarian potatoes boiled in coarse salt, served with red and green mojo sauce'
  where name = 'Papas arrugadas con mojo';

update menu_items set description_en = 'Local goat cheese grilled and drizzled with La Gomera palm honey'
  where name = 'Queso asado con miel de palma';

update menu_items set description_en = 'Chickpeas, chicken and chorizo in a rich tomato and pepper sauce'
  where name = 'Ropa vieja canaria';

update menu_items set description_en = 'Fresh local catch of the day, grilled and served with potatoes and mojo'
  where name = 'Vieja a la espalda';

update menu_items set description_en = 'Traditional Canarian recipe marinated in vinegar, garlic and paprika'
  where name = 'Conejo en salmorejo';

update menu_items set description_en = 'Almond and honey cream served with soursop ice cream'
  where name = 'Bienmesabe con helado';

update menu_items set description_en = 'Traditional Canarian cornmeal dessert with raisins and almonds'
  where name = 'Frangollo canario';
