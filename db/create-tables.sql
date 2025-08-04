CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    instagram_user_id TEXT,
    account_name TEXT
);

CREATE TABLE follower_metrics (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    follower_count INTEGER,
    polled_at TIMESTAMPTZ DEFAULT NOW()
);