-- Create waitlist table
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  usage_type VARCHAR(20) NOT NULL CHECK (usage_type IN ('personal', 'team')),
  team_members INTEGER,
  company_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Create index on created_at for analytics
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts for everyone (for public waitlist)
CREATE POLICY "Allow public waitlist inserts" ON waitlist
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (admin access)
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT 
  TO authenticated 
  USING (true);