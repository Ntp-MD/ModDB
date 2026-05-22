-- Migration script to normalize person IDs to consistent pattern (person_counter)
-- This will convert ALL IDs (numeric, person_name, person_counter) to person_1, person_2, person_3, etc.
-- and update all references in the messages table

-- Step 1: Drop foreign key constraint temporarily
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_person_id_fkey;

-- Step 2: Add a temporary new_id column to people table
ALTER TABLE people ADD COLUMN IF NOT EXISTS new_id TEXT;

-- Step 3: Create a temporary table to store ID mappings
CREATE TEMP TABLE id_mapping (old_id TEXT PRIMARY KEY, new_id TEXT);

-- Step 4: First, handle IDs that are already person_counter pattern (keep them as is)
INSERT INTO id_mapping (old_id, new_id)
SELECT id, id FROM people WHERE id ~ '^person_[0-9]+$';

-- Step 5: Get the max counter from existing person_counter IDs
DO $$
DECLARE
    max_counter INT;
    next_counter INT;
    rec RECORD;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 'person_([0-9]+)$') AS INT)), 0)
    INTO max_counter
    FROM people
    WHERE id ~ '^person_[0-9]+$';
    
    next_counter := max_counter + 1;
    
    -- Step 6: Assign new person_counter IDs to non-conforming IDs
    FOR rec IN SELECT id FROM people WHERE id !~ '^person_[0-9]+$' ORDER BY id LOOP
        INSERT INTO id_mapping (old_id, new_id) VALUES (rec.id, 'person_' || next_counter);
        next_counter := next_counter + 1;
    END LOOP;
    
    -- Step 7: Update people table with new_id from mapping
    UPDATE people
    SET new_id = id_mapping.new_id
    FROM id_mapping
    WHERE people.id = id_mapping.old_id;
END $$;

-- Step 8: Update messages table to reference new_id
UPDATE messages
SET person_id = (
    SELECT new_id 
    FROM id_mapping 
    WHERE id_mapping.old_id = messages.person_id
)
WHERE person_id IN (SELECT old_id FROM id_mapping);

-- Step 9: Update people table - drop old id and rename new_id to id
ALTER TABLE people DROP CONSTRAINT people_pkey;
ALTER TABLE people DROP COLUMN id;
ALTER TABLE people RENAME COLUMN new_id TO id;
ALTER TABLE people ADD PRIMARY KEY (id);

-- Step 10: Re-create foreign key constraint with CASCADE
ALTER TABLE messages 
ADD CONSTRAINT messages_person_id_fkey 
FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE;

-- Step 11: Drop temporary table
DROP TABLE id_mapping;

-- Verification query (run this to check the migration)
SELECT id, name, email FROM people ORDER BY id;
