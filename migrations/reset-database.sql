-- Drop existing tables
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS people;

-- Create people table
CREATE TABLE people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  company TEXT,
  label TEXT NOT NULL,
  starred BOOLEAN DEFAULT false,
  unread BOOLEAN DEFAULT false,
  lastContact TEXT,
  snippet TEXT,
  social JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  person_id TEXT REFERENCES people(id) ON DELETE CASCADE,
  msg_from TEXT NOT NULL,
  from_initials TEXT NOT NULL,
  msg_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  snippet TEXT NOT NULL,
  body TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  unread BOOLEAN DEFAULT true,
  starred BOOLEAN DEFAULT false,
  label TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_people_email ON people(email);
CREATE INDEX idx_people_label ON people(label);
CREATE INDEX idx_messages_person_id ON messages(person_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_unread ON messages(unread);
