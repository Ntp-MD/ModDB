-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  is_preset BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_labels_id ON labels(id);
CREATE INDEX IF NOT EXISTS idx_labels_is_preset ON labels(is_preset);

-- Insert default preset labels
INSERT INTO labels (id, label, color, is_preset)
VALUES 
  ('blue', 'DMS', 'blue', true),
  ('yellow', 'PlusVenture', 'yellow', true),
  ('green', 'Sales', 'green', true),
  ('red', 'HR', 'red', true),
  ('purple', 'EX', 'purple', true)
ON CONFLICT (id) DO NOTHING;
