-- ============================================================
-- StudentHub Database Schema
-- Database: studenthub_db
-- Tables: students, events, registrations
-- ============================================================

CREATE DATABASE IF NOT EXISTS studenthub_db;
USE studenthub_db;

-- ── Students Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    student_id   INT AUTO_INCREMENT PRIMARY KEY,
    fullname     VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    mobile       VARCHAR(15)   NOT NULL,
    gender       ENUM('Male', 'Female', 'Other') NOT NULL,
    course       VARCHAR(100)  NOT NULL,
    year         ENUM('1st Year', '2nd Year', '3rd Year', '4th Year') NOT NULL,
    password     VARCHAR(255)  NOT NULL,
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Events Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
    event_id     INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(200)  NOT NULL,
    description  TEXT,
    event_date   DATE          NOT NULL,
    event_time   TIME          NOT NULL,
    location     VARCHAR(200)  NOT NULL,
    category     VARCHAR(50)   DEFAULT 'General',
    max_seats    INT           DEFAULT 100,
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Registrations Table (Many-to-Many: Students ↔ Events) ──
CREATE TABLE IF NOT EXISTS registrations (
    reg_id       INT AUTO_INCREMENT PRIMARY KEY,
    student_id   INT NOT NULL,
    event_id     INT NOT NULL,
    reg_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status       ENUM('Registered', 'Attended', 'Cancelled') DEFAULT 'Registered',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id)   REFERENCES events(event_id)     ON DELETE CASCADE,
    UNIQUE KEY unique_registration (student_id, event_id)
) ENGINE=InnoDB;

-- ── Sample Events ───────────────────────────────────────────
INSERT INTO events (title, description, event_date, event_time, location, category, max_seats) VALUES
('Tech Fest 2026',       'Annual technology festival with coding competitions.',   '2026-11-15', '09:00:00', 'Main Auditorium',  'Technical',  200),
('Cultural Night',       'Music, dance, and drama performances by students.',      '2026-11-20', '18:00:00', 'Open Air Theatre',  'Cultural',   300),
('Career Workshop',      'Resume building and interview preparation session.',     '2026-12-01', '10:00:00', 'Seminar Hall B',    'Workshop',   100),
('Sports Day',           'Inter-department sports competitions.',                  '2026-12-10', '07:00:00', 'University Ground', 'Sports',     500),
('Hackathon 2026',       '24-hour coding hackathon with exciting prizes.',         '2026-12-20', '08:00:00', 'CS Lab Block',      'Technical',  150);
