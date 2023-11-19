from flask import Flask, request, redirect
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, migrate #for migrate

app = Flask(__name__)
app.debug = True

# adding configuration for using a sqlite database (The database name is TaxDatabaseProjectFall2023)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///TaxDatabaseProjectFall2023.db'

# Creating an SQLAlchemy instance
db = SQLAlchemy(app)

# Settings for migrations
migrate = Migrate(app, db)

## PROJECT POINTS TO KEEP ON MIND
# 1/ http endpoint of post to write/insert records to table.
# 2/ view all records of tax payment of the year.
# 3/ CURD operations in UI, including insert, save, update and delete.
# 4/ Database we will use sqlite for simplicity. (SQL should be similar to MySQL or Postgresl


# Model of taxation table. Company name set to be upper case regardless of the input
class Taxation(db.Model):
    tax_id = db.Column(db.Integer, primary_key=True,index = True, autoincrement=True)
    company = db.Column(db.String(50), nullable=False) # with @property define the variable to always be uppercase
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(10), nullable=False)
    due_date = db.Column(db.Date, nullable=False)


@property #defines company to always be upper case regardless of the input
def company(self):
    return self._company

@company.setter
def company(self, value):
    self._company = value.upper()



if __name__ == '__main__':
	app.run()
