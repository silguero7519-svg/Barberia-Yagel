ALTER TABLE services ADD COLUMN description TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN icon TEXT NOT NULL DEFAULT 'fa-scissors';

UPDATE services SET description = 'Degradados de alta precisión, lavado, perfilado y peinado profesional.', icon = 'fa-scissors' WHERE id = 1;
UPDATE services SET description = 'Corte completo + perfilado de barba con toalla caliente y vapor.', icon = 'fa-user-ninja' WHERE id = 2;
UPDATE services SET description = 'Diseños personalizados en navaja y líneas urbanas artísticas.', icon = 'fa-wand-magic-sparkles' WHERE id = 3;
