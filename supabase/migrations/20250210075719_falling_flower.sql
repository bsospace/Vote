/*
  # Voting System Schema

  1. New Tables
    - `polls`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
    
    - `poll_options`
      - `id` (uuid, primary key)
      - `poll_id` (uuid, references polls)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `votes`
      - `id` (uuid, primary key)
      - `poll_id` (uuid, references polls)
      - `option_id` (uuid, references poll_options)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Anyone can read polls and options
      - Only authenticated users can vote
      - Only admins can create/edit polls
      - Users can only vote once per poll
*/

-- Create polls table
CREATE TABLE polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create poll options table
CREATE TABLE poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls ON DELETE CASCADE NOT NULL,
  option_id uuid REFERENCES poll_options ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT one_vote_per_poll UNIQUE (poll_id, user_id)
);

-- Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for polls
CREATE POLICY "Anyone can read polls"
  ON polls FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can create polls"
  ON polls FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for poll options
CREATE POLICY "Anyone can read poll options"
  ON poll_options FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage poll options"
  ON poll_options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policies for votes
CREATE POLICY "Users can read all votes"
  ON votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can vote once"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM votes
      WHERE poll_id = NEW.poll_id
      AND user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM polls
      WHERE id = NEW.poll_id
      AND now() BETWEEN start_time AND end_time
    )
  );