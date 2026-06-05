-- ============================================
-- ImoPanorama - Postgres extensions bootstrap
-- Exécuté automatiquement au PREMIER démarrage du container
-- (dossier /docker-entrypoint-initdb.d/ de l'image officielle Postgres)
--
-- Relancer manuellement si besoin :
--   docker exec -it imo-postgres psql -U postgres -d imopanorama -f /docker-entrypoint-initdb.d/01-extensions.sql
-- ============================================

-- Recherche vectorielle (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Recherche textuelle fuzzy (trigrammes) + similarité
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Distance de Levenshtein, Soundex, Metaphone
-- Combiné à pg_trgm pour matcher les quartiers/rues malgré fautes de frappe
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- Normalisation des accents (Ivandry ≈ ivändry)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Distance géographique légère (alternative à PostGIS pour les requêtes "rayon X km")
-- cube est prérequis d'earthdistance
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Index GIN sur types standards (utile pour pg_trgm combiné à d'autres colonnes)
CREATE EXTENSION IF NOT EXISTS btree_gin;
