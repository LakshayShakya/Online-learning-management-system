# Sample Login Credentials

## Student Account

**Email:** `student@example.com`  
**Password:** `student123`  
**Role:** Student  
**Student ID:** STU001  
**Department:** Computer Science

## Teacher Account

**Email:** `teacher@example.com`  
**Password:** `teacher123`  
**Role:** Teacher  
**Department:** Computer Science

---

## How to Use These Credentials

### Option 1: Register Through UI (Recommended for First Time)

1. **For Student:**
   - Go to http://localhost:3000/login/student
   - Click "Register" 
   - Fill in the registration form with:
     - Name: John Student
     - Email: student@example.com
     - Student ID: STU001
     - Department: Computer Science
     - Password: student123

2. **For Teacher:**
   - Go to http://localhost:3000/login/teacher
   - Click "Register"
   - Fill in the registration form with:
     - Name: Dr. Jane Teacher
     - Email: teacher@example.com
     - Department: Computer Science
     - Password: teacher123

### Option 2: Use Seed Script (After MySQL is Running)

Run the seed script to automatically create these accounts:

```bash
cd backend
npm run seed
```

This will create both accounts and also add a sample course for the teacher.

---

## Quick Login URLs

- **Student Login:** http://localhost:3000/login/student
- **Teacher Login:** http://localhost:3000/login/teacher

---

**Note:** Make sure MySQL is running and the `lms` database exists before running the seed script or registering users.

