# Overview of Tables

## Users Table

| Column Name | Data Type   | Description        |
|-------------|-------------|--------------------|
| id          | SERIAL      | Primary Key        |
| email       | TEXT        | Unique, Not Null   |
| name        | TEXT        | User's name        |
| created_at  | TIMESTAMPTZ | Timestamp of creation |

## Accounts Table

| Column Name       | Data Type | Description              |
|-------------------|-----------|--------------------------|
| id                | SERIAL    | Primary Key              |
| user_id           | INTEGER   | Foreign Key to users(id) |
| instagram_user_id | TEXT      | Instagram user ID        |
| account_name      | TEXT      | Instagram account name   |

## Follower Metrics Table

| Column Name    | Data Type   | Description                |
|----------------|-------------|----------------------------|
| id             | SERIAL      | Primary Key                |
| account_id     | INTEGER     | Foreign Key to accounts(id) |
| follower_count | INTEGER     | Number of followers        |
| polled_at      | TIMESTAMPTZ | Timestamp of poll          |
