# Instagram database object for connection and operations

from pgdb import Database

class InstaDB:
    def __init__(self, db_name, db_user, db_password):
        self.db = Database(db_name, db_user, db_password)
    
    def close(self):
        self.db.close()
    
    def add_account(self, user_id, instagram_user_id, account_name):
        self.db.execute_commit(
            "INSERT INTO accounts (user_id, instagram_user_id, account_name) VALUES (%s, %s, %s)",
            (user_id, instagram_user_id, account_name)
        )
        
    def get_accounts(self):
        return self.db.execute_select("SELECT * FROM accounts")
        
    def get_account_by_id(self, account_id):
        return self.db.execute_select("SELECT * FROM accounts WHERE id = %s", (account_id,))
        
    def get_analytics_by_account_id(self, account_id):
        return self.db.execute_select("SELECT * FROM follower_metrics WHERE account_id = %s", (account_id,))
        