# Unit tests for database functions and operations
import unittest
from datetime import datetime

# Database
from pgdb import Database  # type: ignore

# Environment variables
import os
from dotenv import load_dotenv
load_dotenv()

class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.db = Database(
            db_name=os.getenv("DATABASE_NAME"),
            db_user=os.getenv("DATABASE_USER"),
            db_password=os.getenv("DATABASE_PASSWORD")
        )
        with self.db.managed_cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")

            cur.execute("DROP TABLE IF EXISTS test_table;")

            cur.execute("""
                CREATE TABLE test_table (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    username VARCHAR(32) UNIQUE,
                    access_token VARCHAR(255),
                    expires_at TIMESTAMP
                );
            """)
    
    def tearDown(self):
        with self.db.managed_cursor() as cur:
            cur.execute("DROP TABLE IF EXISTS test_table;")
        self.db.close()
    
    def test_database_connection(self):
        assert self.db is not None

    def test_cursor(self):
        with self.db.managed_cursor() as cur:
            assert cur is not None

    def test_managed_cursor_insert(self):
        with self.db.managed_cursor() as cur:
            cur.execute("INSERT INTO test_table (username, access_token, expires_at) VALUES (%s, %s, %s)", ("test", "test", datetime.now()))
            assert cur.rowcount == 1

    def test_managed_cursor_select(self):
        with self.db.managed_cursor() as cur:
            cur.execute("INSERT INTO test_table (username, access_token, expires_at) VALUES (%s, %s, %s)", ("test", "test", datetime.now()))
            assert cur.rowcount == 1

        with self.db.managed_cursor() as cur:
            cur.execute("SELECT * FROM test_table")
            result = cur.fetchone()
            assert result is not None
            assert result[0] is not None
            assert result[1] == "test"
            assert result[2] == "test"
            assert result[3] is not None
    
    def test_rollback_on_error(self):
        """
        Tests that the transaction is rolled back if an error occurs
        inside the managed_cursor block.
        """
        # Act & Assert: Try to insert two rows with the same unique username.
        # This should raise a database integrity error.
        with self.assertRaises(Exception):
            with self.db.managed_cursor() as cur:
                # This first insert is valid on its own.
                cur.execute("INSERT INTO test_table (username, access_token, expires_at) VALUES (%s, %s, %s)", ("duplicate_user", "test1", datetime.now()))
                # This second insert will fail because the username must be unique.
                cur.execute("INSERT INTO test_table (username, access_token, expires_at) VALUES (%s, %s, %s)", ("duplicate_user", "test2", datetime.now()))

        # Assert: Verify that the first insert was rolled back and the table is empty.
        with self.db.managed_cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM test_table WHERE username = %s", ("duplicate_user",))
            count = cur.fetchone()[0]
            self.assertEqual(count, 0, "The rollback failed; the first record was committed.")