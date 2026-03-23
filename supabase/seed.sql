-- Seed data for Anthena
-- Run this in Supabase SQL Editor AFTER schema.sql

-- Insert sample products
INSERT INTO public.products (name, slug, description, short_description, price, compare_price, images, category, stock_count, weight_kg, is_active) VALUES
(
  'Vitamin C 1000mg',
  'vitamin-c-1000mg',
  'High-potency Vitamin C supplement to support immune health and antioxidant protection. Each tablet contains 1000mg of Vitamin C derived from natural sources. Supports collagen production, skin health, and iron absorption.',
  'Immune support with 1000mg Vitamin C per tablet',
  45.90, 59.90, '{}', 'Vitamins', 150, 0.30, true
),
(
  'Omega-3 Fish Oil',
  'omega-3-fish-oil',
  'Premium Omega-3 Fish Oil capsules with high EPA and DHA content. Supports heart health, brain function, and joint mobility. Molecularly distilled for purity and freshness.',
  'Heart & brain support with EPA/DHA',
  68.00, 85.00, '{}', 'Supplements', 80, 0.40, true
),
(
  'Probiotics 50 Billion CFU',
  'probiotics-50-billion',
  'Advanced probiotic formula with 50 billion CFU and 12 diverse strains. Supports digestive health, immune function, and nutrient absorption. Delayed-release capsules for maximum effectiveness.',
  'Gut health with 50 billion CFU probiotics',
  89.90, NULL, '{}', 'Gut Health', 60, 0.20, true
),
(
  'Collagen Peptides Powder',
  'collagen-peptides-powder',
  'Hydrolyzed collagen peptides for skin elasticity, hair growth, and joint support. Easily dissolves in hot or cold beverages. Sourced from grass-fed bovine collagen.',
  'Skin, hair & joint support collagen',
  120.00, 150.00, '{}', 'Beauty', 45, 0.50, true
),
(
  'Magnesium Glycinate 400mg',
  'magnesium-glycinate-400mg',
  'Highly absorbable magnesium glycinate for muscle relaxation, better sleep, and stress relief. Gentle on the stomach. Supports over 300 enzymatic reactions in the body.',
  'Better sleep & muscle relaxation',
  55.00, NULL, '{}', 'Minerals', 100, 0.30, true
),
(
  'Multivitamin Complete',
  'multivitamin-complete',
  'Comprehensive daily multivitamin with 25+ essential vitamins and minerals. Formulated for active adults. Includes B-complex for energy, Vitamin D3, Zinc, and antioxidants.',
  'Complete daily nutrition with 25+ nutrients',
  75.00, 95.00, '{}', 'Vitamins', 200, 0.35, true
);
