# Cloud-Based Smart Healthcare Management System

A premium, modern full-stack web application designed for healthcare facilities. This platform provides an intuitive, high-quality user experience (inspired by SaaS dashboards like Stripe and Notion) to seamlessly connect Patients, Doctors, and Administrators.

## 🚀 Tech Stack

**Frontend:**
- **React.js (Vite)**
- **Tailwind CSS** (for styling)
- **Shadcn UI** (Radix UI primitives for accessible, premium components)
- **React Router Dom** (for navigation)
- **Axios** (for API communication)
- **Lucide React** (for modern iconography)

**Backend:**
- **Node.js & Express.js** (REST API)
- **Prisma ORM** (Database interaction and type safety)
- **SQLite** (Zero-setup local database)
- **JWT (JSON Web Tokens)** (Authentication and authorization)
- **Bcrypt.js** (Password hashing)
- **Multer** (File uploads for medical records)

---

## 🔄 Application Workflow

The platform handles a complete, end-to-end healthcare management lifecycle divided among three unique user roles:

### 1. Patient Workflow
* **Onboarding**: Patients sign up, providing their basic details.
* **Dashboard**: Patients are greeted with a clean overview of their total appointments and medical records.
* **Booking**: Patients select a Doctor from the system directory, pick a date and time, and submit an appointment request.
* **History**: They can track their upcoming appointments (Pending, Confirmed, Cancelled, Completed).
* **Records**: Patients have secure access to view and download medical diagnoses and prescriptions issued by their doctors.

### 2. Doctor Workflow
* **Dashboard**: Doctors manage a queue of appointments requested by patients.
* **Actionable Appointments**: Doctors can **Confirm** or **Cancel** pending appointments.
* **Post-Consultation**: Once an appointment is marked as **Completed**, doctors can easily generate a new Medical Record for that patient. 
* **Record Generation**: Doctors input a diagnosis, write a prescription, and can optionally upload a physical report (via Multer), which immediately reflects on the patient’s dashboard.

### 3. Administrator Workflow
* **Overview**: Admins have a bird's-eye view of everything happening globally within the platform.
* **Monitoring**: They track total system users, the split between patients and doctors, and the overall volume of appointments.
* **Directory**: A comprehensive, filterable user directory to audit platform access.

---

## 🛠️ Local Setup & Installation

Follow these steps to run the application locally. Because the project uses **SQLite**, there is no need to manually install or configure a database server!

### 1. Backend Setup
Open a terminal and navigate to the `server` directory:
```bash
cd server

# Install dependencies
npm install

# Initialize the SQLite database and run migrations
npx prisma db push --accept-data-loss
npx prisma generate

# Seed the database with sample data (Admin, Doctor, Patient)
npm run seed

# Start the Express server (Runs on port 5000)
npm run dev
```

### 2. Frontend Setup
Open a second terminal and navigate to the `client` directory:
```bash
cd client

# Install dependencies
npm install

# Build the project and serve it via Vite Preview (Fastest, zero-config production build)
npm run build
npm run preview
```

The frontend will run on **`http://localhost:4173/`**.

---

## 🧪 Testing Credentials 

If you ran `npm run seed` in the backend, you can log in instantly with these accounts:

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | `admin@smarthealth.com`    | password123 |
| Doctor  | `doctor@smarthealth.com`   | password123 |
| Patient | `patient@smarthealth.com`  | password123 |
