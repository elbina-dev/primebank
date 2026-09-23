# PrimeBank

A simple, professional online-banking front end (login, sign up, and an
account dashboard for deposits, withdrawals and transfers), built on top of
your existing Flask backend.

## Project structure

```
primebank/
├── app.py
├── requirements.txt
├── .env.example
├── templates/
│   ├── base.html      # header, footer, flash messages, shared <head>
│   ├── login.html
│   ├── signup.html
│   └── bank.html
└── static/
    ├── css/style.css
    ├── js/main.js
    ├── images/
    │   ├── logo.svg               # header + auth-panel brand mark
    │   ├── favicon.svg            # browser tab icon
    │   └── avatar-placeholder.svg # shown when a user has no photo
    └── upload/                    # user-uploaded profile photos land here
```

## Running it

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then fill in SECRET_KEY, DB URI, etc.
python app.py
```

Visit `http://localhost:5000`.

## Design

- **Colors:** deep emerald (`#0E3B2E`) as the primary brand color, a muted
  gold (`#C89B3C`) as the accent, a warm off-white canvas (`#F2F4EE`), and a
  near-black ink for text (`#16231C`).
- **Type:** `Newsreader` (serif) for headings and the wordmark, `Work Sans`
  (sans-serif) for everything else. Both load from Google Fonts in
  `base.html`.
- **Layout:** login/signup use a split screen — a brand panel on the left,
  the form on the right (stacks vertically on small screens). The dashboard
  leads with a large balance card, with deposit/withdraw/transfer as three
  action cards that open a small modal form.
- All three action forms, the account number, and the flash messages are
  wired up in `static/js/main.js` (modals, password show/hide, copy-to-
  clipboard, a live avatar preview on sign up, and a confirm-password check).

### Images used

Every image referenced by the templates is already included as an SVG, so
the app works out of the box with no missing assets:

| File | Used for |
|---|---|
| `static/images/logo.svg` | Header brand mark and the auth-page brand panel |
| `static/images/favicon.svg` | Browser tab icon |
| `static/images/avatar-placeholder.svg` | Fallback profile photo before a user uploads one |

If you'd rather use real photography or a designed logo, drop replacement
files in with the same names (or update the `url_for('static', ...)` calls
in the templates), and consider adding a photo for the auth brand panel
background (e.g. `static/images/auth-hero.jpg`) if you want something less
flat than the current gradient.

## Backend fixes made while wiring up the front end

Your original `app.py` had a few bugs that would have surfaced once the
forms were connected — these are fixed:

1. **Signup silently failed to save any password.** The `User(...)` call
   used `passhword_hash=` (typo) instead of `password_hash=`, which
   `SQLAlchemy` would have rejected with a `TypeError` since it's not a
   real column.
2. **Signup's required-field checks used `and` instead of `or`.** As
   written, `if not username and not password and not email` only fired
   when *all three* were empty, so leaving out just one field slipped
   through. Same issue for `firstname`/`lastname`. Both now use `or`.
3. **`INITIAL_BALANCE` was a string.** `os.getenv()` always returns a
   string (or `None`), but it was used directly as the `balance` column's
   numeric default. It's now parsed with `float()` and falls back to `0.0`
   if unset or invalid.
4. **Deposit/withdraw/transfer amounts weren't validated.** A non-numeric
   `amount` (or a blank field) would raise an unhandled `ValueError` and
   500 the request. There's now a `parse_amount()` helper that returns
   `None` on bad input, which the routes check before touching the
   balance. Amounts are also rounded to 2 decimal places.
5. **Small typos:** "Welclome"/"succes" in the login flash, "reciever" in
   the transfer flash, and a missing `unique=True` on `account_number`
   (two users could otherwise have collided, defeating the point of
   `generate_account_number()`'s uniqueness check).
6. **No upload size limit.** `MAX_CONTENT_LENGTH` is now set to 2MB so a
   large file can't be posted to the signup form.
7. **Added CSRF protection** (`Flask-WTF`'s `CSRFProtect`) since this
   handles money — every form now includes a `csrf_token`.
8. **Added a password confirmation + minimum length (8 chars)** check on
   signup, both in the browser (`main.js`) and on the server (`app.py`),
   since the front end previously had no such field at all.

Everything else — your models, routes, and general structure — is
unchanged.
