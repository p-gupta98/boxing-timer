
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

--Presets
CREATE TABLE presets(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  fight_duration INT NOT NULL CHECK (fight_duration >= 1),
  rest_duration INT NOT NULL CHECK (rest_duration >= 1),
  total_rounds INT NOT NULL CHECK (total_rounds >= 1)
);

--Sessions
CREATE TABLE sessions(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preset_id UUID REFERENCES presets(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  session_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  fight_duration INT NOT NULL CHECK (fight_duration >= 1),
  rest_duration INT NOT NULL CHECK (rest_duration >= 1),
  total_rounds INT NOT NULL CHECK (total_rounds >= 1),
  rounds_completed INT NOT NULL CHECK (rounds_completed >= 0),
  session_completed BOOLEAN NOT NULL
);