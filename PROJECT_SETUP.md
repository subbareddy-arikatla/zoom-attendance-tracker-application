# Full-Stack Attendance System - Setup Guide

## Project Structure

```
.
├── backend/                 # Django Backend
│   ├── attendance_system/   # Main Django project
│   ├── accounts/            # User authentication app
│   ├── attendance/           # Attendance management app
│   └── requirements.txt
└── src/                     # Next.js Frontend
    └── app/
        ├── register/        # Registration page
        ├── login/           # Login page
        ├── dashboard/       # Dashboard page
        └── attendance/      # Attendance form page
```

## Backend Setup (Django)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create .env file
Create a `.env` file in the `backend` directory:
```
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
```

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser (optional, for admin panel)
```bash
python manage.py createsuperuser
```

### 7. Run Django server
```bash
python manage.py runserver
```

Backend will run on `http://localhost:8000`

## Frontend Setup (Next.js)

### 1. Install dependencies (if not already installed)
```bash
npm install
```

### 2. Run Next.js development server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Features

### ✅ User Registration
- **Route**: `/register`
- **Fields**: Email, Username, First Name, Last Name, Phone, Password
- **API**: `POST /api/auth/register/`

### ✅ User Login
- **Route**: `/login`
- **Fields**: Email, Password
- **API**: `POST /api/auth/login/`

### ✅ Dashboard
- **Route**: `/dashboard`
- Shows all meetings
- Links to mark attendance
- **API**: `GET /api/attendance/meetings/`

### ✅ Mark Attendance
- **Route**: `/attendance`
- Select meeting, status (Present/Late/Absent), and notes
- **API**: `POST /api/attendance/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/profile/` - Get current user profile

### Meetings
- `GET /api/attendance/meetings/` - List all meetings
- `POST /api/attendance/meetings/` - Create new meeting
- `GET /api/attendance/meetings/<id>/` - Get meeting details
- `PUT /api/attendance/meetings/<id>/` - Update meeting
- `DELETE /api/attendance/meetings/<id>/` - Delete meeting

### Attendance
- `GET /api/attendance/` - List user's attendance records
- `POST /api/attendance/` - Mark attendance
- `GET /api/attendance/meetings/<id>/attendances/` - Get all attendance for a meeting
- `POST /api/attendance/import-csv/` - Import attendance from CSV

## Testing the Application

1. **Start Backend**: `cd backend && python manage.py runserver`
2. **Start Frontend**: `npm run dev`
3. **Register**: Go to `http://localhost:3000/register`
4. **Login**: Go to `http://localhost:3000/login`
5. **Mark Attendance**: Go to `http://localhost:3000/attendance`

## Next Steps

- Add CSV import feature for attendance
- Add meeting creation form
- Add attendance reports/export
- Add user roles (Admin, Teacher, Student)

