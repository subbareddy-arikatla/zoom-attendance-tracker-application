# Django Backend - Attendance System

## Setup Instructions

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create .env file:**
```bash
cp .env.example .env
# Edit .env and add your SECRET_KEY
```

4. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Run development server:**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get current user profile

### Meetings
- `GET /api/attendance/meetings/` - List all meetings
- `POST /api/attendance/meetings/` - Create a meeting
- `GET /api/attendance/meetings/<id>/` - Get meeting details
- `PUT /api/attendance/meetings/<id>/` - Update meeting
- `DELETE /api/attendance/meetings/<id>/` - Delete meeting

### Attendance
- `GET /api/attendance/` - List user's attendance records
- `POST /api/attendance/` - Mark attendance
- `GET /api/attendance/meetings/<id>/attendances/` - Get all attendance for a meeting
- `POST /api/attendance/import-csv/` - Import attendance from CSV

