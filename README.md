# PrimeBank

PrimeBank is a Flask-based online banking demo with user registration,
authenticated account access, and basic money movement workflows. It provides
a clean banking dashboard for viewing an account balance and account number,
depositing funds, withdrawing funds, and transferring funds to another PrimeBank
account.

## Features

- User registration and login with email or username
- Password hashing with Werkzeug
- CSRF protection on submitted forms
- Automatically generated unique account numbers
- Account balance dashboard with copy-to-clipboard account number
- Deposit, withdrawal, and account-to-account transfer actions
- Validation for required fields, passwords, amounts, and available funds
- Optional JPG or PNG profile photo uploads, limited to 2 MB
- Responsive interface with modal transaction forms

## Project structure

```
primebank/
├── app.py
## Tech stack

- Python 3
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-WTF
- Werkzeug
- python-dotenv
- HTML, CSS, and vanilla JavaScript

## Getting started

### 1. Create a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS or Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=replace-with-a-long-random-secret
SQLALCHEMY_DATABASE_URI=sqlite:///primebank.db
INITIAL_BALANCE=0
UPLOAD_FOLDER=static/upload
```

`SECRET_KEY` and `SQLALCHEMY_DATABASE_URI` should be set before starting the
application. `INITIAL_BALANCE` defaults to `0` when it is missing or invalid,
and `UPLOAD_FOLDER` defaults to `static/upload`.

### 4. Start the application

```bash
python app.py
```

Open [http://localhost:5000](http://localhost:5000) in a browser. The database
tables are created automatically when the application starts.

## Application routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` or `/bank` | View the authenticated banking dashboard |
| `GET`, `POST` | `/login` | Sign in with an email or username |
| `GET`, `POST` | `/signup` | Create a new account |
| `GET` | `/logout` | Sign out of the current account |
| `POST` | `/deposit` | Add funds to the current account |
| `POST` | `/withdraw` | Withdraw available funds |
| `POST` | `/transfer` | Transfer funds to another account number |

## Project structure

```text
primebank/
├── app.py                 # Flask application, models, and routes
├── requirements.txt       # Python dependencies
├── templates/             # Jinja templates
│   ├── base.html
│   ├── bank.html
│   ├── login.html
│   └── signup.html
└── static/
    ├── css/style.css      # Application styles
    ├── js/main.js         # Dashboard and form interactions
    ├── images/            # Logo and placeholder assets
    └── upload/            # Uploaded profile photos
```

## Security and production notes

This project is intended for learning and local demonstration. Before using it
in production, configure a production-grade database, keep secrets outside
source control, disable Flask debug mode, serve uploaded files carefully, add
transaction records and audit logging, and use a real financial ledger instead
of directly changing account balances.

Do not commit `.env`, local database files, or uploaded user content to source
control.
