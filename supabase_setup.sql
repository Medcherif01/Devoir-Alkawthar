-- ============================================================================
-- SCRIPT DE CRÉATION AUTOMATIQUE DES TABLES - SUPABASE
-- Devoirs Alkawthar - Version 3.0.0
--
-- 👉 INSTRUCTIONS :
--   1. Ouvrez votre projet Supabase → SQL Editor
--   2. Copiez-collez tout ce script
--   3. Cliquez sur "Run"
--   Les tables seront créées automatiquement !
-- ============================================================================

-- Table: plans (planning des devoirs par enseignant)
CREATE TABLE IF NOT EXISTS plans (
    id BIGSERIAL PRIMARY KEY,
    "Jour" TEXT NOT NULL,
    "Classe" TEXT NOT NULL,
    "Matière" TEXT NOT NULL,
    "Enseignant" TEXT,
    "Devoirs" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("Jour", "Classe", "Matière")
);

-- Table: evaluations (évaluations quotidiennes des élèves)
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGSERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT,
    participation INTEGER,
    behavior INTEGER,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, "studentName", class, subject)
);

-- Table: daily_stars (étoiles quotidiennes gagnées par les élèves)
CREATE TABLE IF NOT EXISTS daily_stars (
    id BIGSERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "earnedStar" NUMERIC DEFAULT 0,
    "evaluationCount" INTEGER DEFAULT 0,
    "completionRate" NUMERIC DEFAULT 0,
    "avgParticipation" NUMERIC DEFAULT 0,
    "avgBehavior" NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, "studentName", "className")
);

-- Table: students_of_the_week (élève de la semaine)
CREATE TABLE IF NOT EXISTS students_of_the_week (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    stars NUMERIC DEFAULT 0,
    "progressPercentage" NUMERIC DEFAULT 0,
    "progressComment" JSONB,
    "weekIdentifier" TEXT NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: photos_of_the_day (photo de célébration principale)
CREATE TABLE IF NOT EXISTS photos_of_the_day (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: photos_celebration_2 (deuxième photo de célébration)
CREATE TABLE IF NOT EXISTS photos_celebration_2 (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: photos_celebration_3 (troisième photo de célébration)
CREATE TABLE IF NOT EXISTS photos_celebration_3 (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: teacher_messages (messages des parents aux enseignants)
CREATE TABLE IF NOT EXISTS teacher_messages (
    id BIGSERIAL PRIMARY KEY,
    "teacherName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT DEFAULT '',
    message TEXT NOT NULL,
    date TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: teacher_replies (réponses des enseignants aux parents)
CREATE TABLE IF NOT EXISTS teacher_replies (
    id BIGSERIAL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "replyText" TEXT NOT NULL,
    "readByParent" BOOLEAN DEFAULT FALSE,
    timestamp TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: parent_accounts (comptes des parents)
CREATE TABLE IF NOT EXISTS parent_accounts (
    id BIGSERIAL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "lastLogin" TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- POLITIQUE RLS (Row Level Security) - Désactivée pour l'API côté serveur
-- L'API utilise la service_role_key qui contourne RLS automatiquement
-- ============================================================================
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stars DISABLE ROW LEVEL SECURITY;
ALTER TABLE students_of_the_week DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos_of_the_day DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos_celebration_2 DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos_celebration_3 DISABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_replies DISABLE ROW LEVEL SECURITY;
ALTER TABLE parent_accounts DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- INDEX pour améliorer les performances des requêtes fréquentes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_plans_jour_classe ON plans ("Jour", "Classe");
CREATE INDEX IF NOT EXISTS idx_evaluations_date_class ON evaluations (date, class);
CREATE INDEX IF NOT EXISTS idx_evaluations_student ON evaluations ("studentName");
CREATE INDEX IF NOT EXISTS idx_daily_stars_student_class ON daily_stars ("studentName", "className");
CREATE INDEX IF NOT EXISTS idx_daily_stars_date ON daily_stars (date);
CREATE INDEX IF NOT EXISTS idx_teacher_messages_teacher ON teacher_messages ("teacherName");
CREATE INDEX IF NOT EXISTS idx_teacher_replies_parent ON teacher_replies ("parentPhone");
CREATE INDEX IF NOT EXISTS idx_students_of_week_identifier ON students_of_the_week ("weekIdentifier");

-- ============================================================================
-- ✅ SETUP TERMINÉ ! Toutes les tables sont prêtes.
-- ============================================================================
SELECT 'Tables créées avec succès !' AS status;
