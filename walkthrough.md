# Backend Setup & Authentication Walkthrough

I have successfully initialized the backend, configured the MongoDB database connection, and implemented the authentication module.

## Changes Made
- Initialized Node.js/Express environment in the `backend/` directory.
- Installed required dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`.
- Set up database connection using Mongoose (`config/db.js`).
- Created Mongoose schemas for `User` and `Company` (`models/User.js`, `models/Company.js`).
- Created authentication controllers with secure password hashing (`controllers/authController.js`).
- Implemented `/api/auth/register` and `/api/auth/login` routes (`routes/authRoutes.js`).
- Created JWT protection middleware and role-based authorization middleware (`middleware/authMiddleware.js`).
- Configured the main Express server to handle JSON requests and CORS (`server.js`).

## Verification
I ran the server locally and manually verified the endpoints via PowerShell HTTP requests.

- **User Registration**: Successfully registered a new standard user (`user` role) and validated that the password was hashed before saving to MongoDB.
- **Company Registration**: Successfully registered a company (`company` role) with company-specific details, which properly generated both a `User` document and a linked `Company` document.
- **Login**: Both user types successfully logged in using their credentials and received a valid JSON Web Token (JWT).
- **Responses**: The API returns clean JSON objects with standard fields `_id`, `name`, `email`, `role`, and `token`.

The backend foundation and authentication system are fully operational.

## Phase 3: Job Module

### Changes Made
- Created `Job` Mongoose schema with `companyId` linking to the `Company` profile.
- Created fully protected `/api/jobs` REST endpoints:
  - `POST /api/jobs`: Created by authenticated companies.
  - `GET /api/jobs`: Publicly accessible with built-in query parameter filtering (by `category`, `location`, `minSalary`).
  - `PUT /api/jobs/:id` & `DELETE /api/jobs/:id`: Protected and strictly authorized so that only the company who created the job can modify or delete it.

### Verification
I wrote and executed an automated PowerShell test script (`test_jobs.ps1`) to verify the full CRUD lifecycle:
1. Registered a new company and obtained a JWT token.
2. Successfully created a job listing authenticated as the company.
3. Fetched the job listing publicly showing the populated company details.
4. Filtered the jobs successfully using `category` and `minSalary`.
5. Updated the job salary and location successfully.
6. Deleted the job successfully.

## Phase 4: Application System & Email Notification

### Changes Made
- Set up automated Ethereal Email testing credentials in `.env`.
- Created a robust `sendEmail` utility using `nodemailer`.
- Defined `Application` Mongoose schema linking `userId`, `jobId`, `resumeUrl`, and `status`.
- Integrated `Nodemailer` directly into the `applyForJob` flow:
  - Dispatches application confirmation email to the Job Seeker.
  - Dispatches application received notification email to the Company containing the candidate's resume link.
- Implemented `GET /api/applications` to allow users to correctly track all their submitted applications with populated job and company data.

### Verification
I triggered an automated PowerShell orchestration `test_applications.ps1` that performed an entire multi-user flow:
1. Registered a new company account and created an active job listing.
2. Registered a new user/job seeker account.
3. Applied to the company's new job listing with a resume URL.
4. Verified that via Nodemailer 2 distinct emails were triggered successfully.
5. Hit the GET endpoint for the user ensuring the application state was properly inserted into MongoDB and serialized back in the API response.

## Phase 5: Frontend Setup & UI (React + Tailwind)

### Changes Made
- Initiated a React boilerplate application in `frontend/` equipped with `react-router-dom`, `axios`, `formik`, and `yup`.
- Installed and configured Tailwind CSS along with PostCSS and built a global `index.css`.
- Engineered the core application routing shell (`App.jsx`).
- Constructed a global `AuthContext` to persist JWT tokens in localStorage, manage Axios interceptors, and provide `login`, `register`, and `logout` actions seamlessly across the app.
- Built reusable layout components:
  - `Navbar`: Dynamically checks `AuthContext` to display either Login/Register for guests or Dashboard/Logout (plus "Post Job" for Companies) for authenticated users.
  - `Footer`: A clean, responsive footer layout.
- Designed key UI Pages:
  - `Home`: Features an engaging Hero section with a search bar (categorization and location) and a mockup job listing layout.
  - `Login`: Secured behind a clean Formik-managed email/password layout with Yup schema validation. Error bounds gracefully catch rejected credentials.
  - `Register`: Features dynamic tabs transitioning between "Job Seeker" and "Employer". Yup validation strictly enforces `companyName` inclusion when registering as an Employer.

### Verification
I tested the React App setup by spinning up the Webpack development server locally. The UI renders smoothly with responsive Tailwind classes, `react-router` successfully navigates through the page ecosystem without refreshes, and Formik successfully shields form submission without required fields.

## Phase 6: Job Listing & Dashboards
### Backend Changes
- Added a `GET /api/jobs/company` endpoint allowing authenticated employers to fetch only their proprietary job listings.
- Added a `GET /api/applications/job/:jobId` to fetch detailed applicant metadata specific to a singular job listing for Company review.
- Built a robust `PUT /api/applications/:id/status` endpoint enabling employers to pass 'Accepted' or 'Rejected' statuses. This trigger intercepts with the `sendEmail` utility, directly firing confirmation or rejection emails back to the user applicant via Ethereal Nodemailer.

### Frontend Enhancements
- Created a `DashboardRoot` component acting as a Router Guard, distributing traffic either to a `UserDashboard` or `CompanyDashboard` immediately checking the Context JWT `role`.
- **User Dashboard**: Created a responsive Tailwind data table enumerating applied roles alongside color-coded status badges and dynamic Application date serialization.
- **Company Dashboard**: Constructed an employer suite exhibiting their active listings count alongside a jobs table.
- **Post Job Flow**: Assembled `PostJob.jsx`, shielding inputs behind a strict Formik pipeline dictating title string capacities, numerical salaries, and dynamic category dropdowns.
- **Applicants Review List**: Added `ApplicantsList.jsx` rendering detailed applicant data mapping `mailto` links to their emails, URLs to their resumes, and emitting direct `Accept/Reject` API dispatches that lock after the decision logic completes.
- Re-routed the theoretical 'Job Detail' link to a robust `JobDetails.jsx` page serving dynamic job fetching, descriptive UI renderings, and shielded 'Apply' URL inputs restricting company users from cannibalistic applying.

## Phase 6: Admin Panel & Final Polishing
### Backend Enhancements
- Expanded the `User` schema enum to strictly manage a distinct `admin` role.
- Augmented the `Job` schema with a `status` field defaulting to `'Pending'`.
- Overhauled the public `GET /api/jobs` endpoint to strictly return `status: 'Approved'` resources.
- Added a private `GET /api/jobs/admin/all` repository fetching all jobs regardless of lifecycle, bypassing the public filter.
- Added `PUT /api/jobs/:id/status` mapped exclusively to `admin` tokens allowing for Approval/Rejection hooks on pending listings.
- Bound `adminController` featuring robust document aggregations computing User statistics (Company vs Seeker distributions) and absolute Job listing states.

### Frontend Security & Dashboard
- Crafted an `AdminDashboard` component functioning as the internal system directory. It fetches total metric statistics and projects them into visually distinct data cards.
- Integrated an actionable 'Pending Jobs' datatable inside the Admin view emitting REST signals to actively approve or reject jobs dynamically rendering them available publically to the app.
- Upgraded the `DashboardRoot` resolver component to intelligently route authenticated traffic traversing `/dashboard` strictly onto either the `AdminDashboard`, `CompanyDashboard`, or `UserDashboard` depending on their `res.data` user role mapping.
- Global Error Handling: Replaced all hardcoded error alerts with modern, sleek `react-toastify` slide-in notifications globally installed in the React Node core (`App.jsx`) and executing off Context hooks natively.
- Adjusted Navbar elements handling breakpoints via Flex column direction to prevent UI clipping on mobile screens.
- Scrubbed hardcoded `http://localhost:5000` fetches, replacing them securely with `${import.meta.env.VITE_API_URL}` templates to secure prod rollouts via the updated `.env.example` records.

---

## How to Run This Project Locally

To run this application on your local machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally, or use a MongoDB Atlas URI)

### 1. Setup the Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment variables file. Copy the template and rename it:
   ```bash
   cp .env.example .env
   ```
   *Make sure your MongoDB instance is running locally at `mongodb://localhost:27017/skillspring` or replace the URI in `.env` with your remote cluster string.*
4. Start the Node.js server (runs on port 5000 by default):
   ```bash
   npm run dev
   # OR: node server.js
   ```

### 2. Setup the Frontend
1. Open a new, separate terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize environment variables. Copy the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
4. Start the React development server:
   ```bash
   npm start
   ```

### 3. Usage & Access
- **Frontend App**: Open your browser to `http://localhost:3000`
- **Backend API**: Running on `http://localhost:5000`
- **Admin Setup**: To access the Admin Panel, you must manually change the `role` of one of your users in your MongoDB database to `'admin'`.
  - Using MongoDB Compass or `mongosh`, execute: 
    ```javascript
    db.users.updateOne({ email: "your.email@example.com" }, { $set: { role: "admin" } })
    ```
  - After updating, log back into the frontend application to see the "Dashboard" switch into Admin mode.
