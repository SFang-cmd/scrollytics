# Database object for connection and operations

import psycopg2
from contextlib import contextmanager

class Database:
    def __init__(self, db_name, db_user, db_password):
        self.connection = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password
        )
    
    @contextmanager
    def managed_cursor(self):
        """A context manager for database cursors.

        Yields a cursor and handles committing or rolling back transactions.
        """
        cur = self.connection.cursor()

        try:
            yield cur
            self.connection.commit()

        except Exception as e:
            print(f"Transaction failed. Rolling back. Error: {e}")
            self.connection.rollback()
            raise

        finally:
            cur.close()
    
    def close(self):
        if self.connection:
            self.connection.close()

    # def add_user(self, username, access_token, expires_at):
    #     self.execute_commit(
    #         "INSERT INTO test_table (username, access_token, expires_at) VALUES (%s, %s, %s)",
    #         (username, access_token, expires_at)
    #     )