-- categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_ar TEXT,
  name_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
