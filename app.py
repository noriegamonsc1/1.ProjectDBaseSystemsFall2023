from flask import Flask, request, redirect, render_template, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import os

app = Flask(__name__)
app.debug = True

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///TaxDatabaseProjectFall2023.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Taxation(db.Model):
    tax_id = db.Column(db.Integer, primary_key=True, index=True, autoincrement=True)
    _company = db.Column('company', db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(10), nullable=False)
    due_date = db.Column(db.Date, nullable=False)

    @property
    def company(self):
        return self._company

    @company.setter
    def company(self, value):
        self._company = value.upper()

@app.route('/')
def index():
    records = Taxation.query.all()
    return render_template('index.html', records=records)

@app.route('/fetchTaxRecords/<dueDate>')
def fetchTaxRecords(dueDate):
    records = Taxation.query.filter(Taxation.due_date==dueDate)
    
    json_records = []
    for record in records:
        json_record = {
            'tax_id': record.tax_id,
            '_company': record._company,
            'amount': record.amount,
            'payment_date': record.payment_date,
            'status': record.status,
            'due_date':record.due_date
        }
        json_records.append(json_record)
    
    return jsonify(json_records)

@app.route('/add-record', methods=['POST'])
def add_record():
    company = request.form.get('company')
    amount = float(request.form.get('amount'))
    # Check if payment_date is provided
    payment_date_str = request.form.get('payment_date')
    payment_date = datetime.strptime(payment_date_str, '%Y-%m-%d') if payment_date_str else None
    status = request.form.get('status')
    due_date = datetime.strptime(request.form.get('due_date'), '%Y-%m-%d')
    new_record = Taxation(company=company, amount=amount, payment_date=payment_date, status=status, due_date=due_date)
    db.session.add(new_record)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/update/<int:tax_id>', methods=['POST'])
def update_record(tax_id):
    record = Taxation.query.get_or_404(tax_id)
    record.company = request.form.get('company')
    record.amount = float(request.form.get('amount'))
    record.payment_date = datetime.strptime(request.form.get('payment_date'), '%Y-%m-%d')
    record.status = request.form.get('status')
    record.due_date = datetime.strptime(request.form.get('due_date'), '%Y-%m-%d')
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/delete/<int:tax_id>', methods=['POST'])
def delete_record(tax_id):
    record = Taxation.query.get_or_404(tax_id)
    db.session.delete(record)
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run()
