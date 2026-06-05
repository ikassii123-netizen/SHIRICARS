-- =============================================
-- SHIRI CARS — Script de création de la base de données
-- À exécuter dans l'éditeur SQL de Supabase
-- =============================================

-- Table des voitures
CREATE TABLE IF NOT EXISTS voitures (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marque      TEXT NOT NULL,
  modele      TEXT NOT NULL,
  annee       INTEGER NOT NULL,
  kilometrage INTEGER NOT NULL DEFAULT 0,
  carburant   TEXT NOT NULL DEFAULT 'Essence',
  transmission TEXT NOT NULL DEFAULT 'Manuelle',
  prix        DECIMAL(10,2) NOT NULL,
  prix_barre  DECIMAL(10,2),             -- Prix original avant remise (nullable)
  statut      TEXT NOT NULL DEFAULT 'disponible' CHECK (statut IN ('disponible', 'vendu')),
  description TEXT,
  photos      TEXT[] DEFAULT '{}',       -- Tableau d'URLs des photos
  date_ajout  TIMESTAMPTZ DEFAULT now()
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom      TEXT NOT NULL,
  nom         TEXT NOT NULL,
  email       TEXT NOT NULL,
  telephone   TEXT,
  message     TEXT NOT NULL,
  voiture_id  UUID REFERENCES voitures(id) ON DELETE SET NULL,
  lu          BOOLEAN DEFAULT false,
  date_envoi  TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Permissions (Row Level Security)
-- =============================================

ALTER TABLE voitures ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Lecture publique des voitures (tout le monde peut voir le catalogue)
CREATE POLICY "lecture_publique_voitures" ON voitures
  FOR SELECT USING (true);

-- Écriture des voitures réservée aux utilisateurs authentifiés (admin)
CREATE POLICY "ecriture_admin_voitures" ON voitures
  FOR ALL USING (auth.role() = 'authenticated');

-- Insertion des contacts ouverte à tous (formulaire de contact)
CREATE POLICY "insertion_contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Lecture et gestion des contacts réservée aux admins
CREATE POLICY "gestion_admin_contacts" ON contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Bucket de stockage pour les photos
-- =============================================
-- (À créer manuellement dans Storage > Buckets > New bucket)
-- Nom du bucket : voitures
-- Accès public : OUI

-- =============================================
-- Données de démonstration
-- =============================================

INSERT INTO voitures (marque, modele, annee, kilometrage, carburant, transmission, prix, prix_barre, statut, description) VALUES
  ('Peugeot',       '308 GT',     2022, 32000, 'Essence',           'Automatique', 22900, 26500, 'disponible', 'Peugeot 308 GT en excellent état. Première main, carnet d''entretien complet chez Peugeot. Toit panoramique, caméra de recul, navigation GPS.'),
  ('Renault',       'Clio V',     2023, 15000, 'Hybride',           'Automatique', 18500, NULL,  'disponible', 'Renault Clio hybride très récente, garantie constructeur active jusqu''en 2026. Faible consommation, idéale en ville.'),
  ('Citroën',       'C5 Aircross', 2021, 54000, 'Diesel',           'Automatique', 19800, 23000, 'disponible', 'Citroën C5 Aircross en très bon état. SUV confortable, suspension hydraulique unique. Parfait pour les longs trajets.'),
  ('DS Automobiles','DS 7',       2023, 8000,  'Hybride Rechargeable','Automatique',41500, 47000, 'disponible', 'DS 7 Crossback E-Tense 225. Finition Opéra, cuir Nappa, toit panoramique. La référence du luxe français.'),
  ('Peugeot',       '208',        2020, 68000, 'Essence',           'Manuelle',    12400, NULL,  'vendu',      'Peugeot 208 vendue. Bon état général, révision effectuée avant vente.'),
  ('Renault',       'Mégane IV',  2019, 92000, 'Diesel',            'Manuelle',    10900, 13500, 'vendu',      'Renault Mégane vendue. Véhicule fiable et économique.');
