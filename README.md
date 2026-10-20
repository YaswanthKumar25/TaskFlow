# TaskFlow

TaskFlow is a learning project for managing personal tasks with a Django REST Framework API and a React single-page frontend built with Vite. The API supports user registration, token login, and user-scoped task operations.

## Current status

The backend API and basic frontend flows are implemented. The frontend currently provides login, task listing, task creation, and logout. User registration is available through the API but does not yet have a frontend form. Automated application tests and production deployment configuration are not yet in place.

## Features

- Register an account through the backend API.
- Log in and receive a Django REST Framework authentication token.
- Create and list tasks belonging to the authenticated user.
- Retrieve, update, or delete a task through the API.
- Set task title, description, due date, status, and priority.
- Use a React frontend with routes for login, task listing, and task creation.

## Technology stack

- Python 3.13 and Django 6.1.2
- Django REST Framework 3.18.3 with token authentication
- django-cors-headers 4.9.0
- React 19, React Router, Axios, and Vite 8
- SQLite for local development

## Repository structure

```text
TaskFlow/
├── backend/
│   ├── config/                 # Django settings and project URLs
│   ├── taskflow/               # Task API, model, serializers, and migrations
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   └── taskflow/               # React + Vite app and npm manifests
├── .env.example
├── .gitignore
└── README.md
```

The frontend stays in its existing `frontend/taskflow/` directory; no application files were moved.

## Prerequisites

- Python 3.13 (the version used by the existing backend virtual environment)
- Node.js 20.19+ or 22.12+, and npm
- Git

## Environment variable

Django reads its secret key from `DJANGO_SECRET_KEY`. `.env.example` contains a placeholder only. The project does not load `.env` files automatically, so set the variable in the terminal before starting Django. For local PowerShell use:

```powershell
$env:DJANGO_SECRET_KEY = "replace-with-your-own-local-secret"
```

Use a unique value for your local environment. Do not commit `.env` files or real credentials. If the previous development key was ever used outside a local environment, replace it separately in those environments.

## Backend setup

From the repository root, run these commands in PowerShell:

```powershell
cd backend
py -3.13 -m venv env
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DJANGO_SECRET_KEY = "replace-with-your-own-local-secret"
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`. The local SQLite database is created in `backend/db.sqlite3` and is intentionally excluded from Git.

## Frontend setup

In a second terminal, from the repository root:

```powershell
cd frontend\taskflow
npm ci
npm run dev
```

Vite prints the local frontend URL (normally `http://localhost:5173`). The frontend API client currently targets `http://127.0.0.1:8000/tasks/`; update `src/api.js` if your backend uses a different URL.

## API endpoints

The project URL configuration mounts the task API at `/tasks/`. Registration and login do not require a token; task endpoints do.

| Method | Path | Purpose | Authentication |
| --- | --- | --- | --- |
| `POST` | `/tasks/register/` | Create a user with `username` and `password` | None |
| `POST` | `/tasks/login/` | Log in with `username` and `password`; returns a token | None |
| `GET` | `/tasks/` | List the current user's tasks | Token |
| `POST` | `/tasks/` | Create a task for the current user | Token |
| `GET` | `/tasks/<id>/` | Retrieve one of the current user's tasks | Token |
| `PUT` / `PATCH` | `/tasks/<id>/` | Update one of the current user's tasks | Token |
| `DELETE` | `/tasks/<id>/` | Delete one of the current user's tasks | Token |
| `GET` | `/admin/` | Django administration site | Django admin login |

Tasks accept `title`, `description`, `due_date`, `status`, and `priority`. Status values are `pending`, `in_progress`, and `completed`; priority values are `low`, `medium`, and `high`. New task requests do not choose the owner: the API assigns the authenticated user.

### Authentication

The login endpoint returns a token in the response body:

```json
{"token": "your-token"}
```

Send that token with protected API requests in this header:

```text
Authorization: Token your-token
```

The frontend stores the token in browser `localStorage` and adds this header to API requests. Logging out removes the local token. The local CORS configuration permits `http://localhost:5173`.

## Local checks

With the backend virtual environment active and `DJANGO_SECRET_KEY` set:

```powershell
cd backend
python manage.py check
python manage.py test
```

The Django app currently contains no dedicated automated tests. For the frontend:

```powershell
cd frontend\taskflow
npm run lint
npm run build
```

For a manual end-to-end check, start both servers, register a user with an API client, log in through the frontend, and create/list tasks. API clients can call the registration endpoint directly until a registration screen is added.

## Planned work

- Add a registration screen and clearer login/task submission feedback.
- Complete task editing and deletion flows in the frontend.
- Add automated backend and frontend tests.
- Improve production configuration and document deployment.
