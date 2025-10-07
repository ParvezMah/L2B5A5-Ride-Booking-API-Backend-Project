
# 🚗 Ride Booking API

A full-featured **Ride Booking REST API** built using **Node.js, Express, TypeScript, and MongoDB** — inspired by real-world ride-sharing platforms like Uber, Bolt, and Pathao.


## Tech Stack

| Layer | Technology |
|--------|-------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Passport.js (Local + Google OAuth 2.0) |
| Validation | Zod |
| Password Hashing | bcryptjs |
| Environment | dotenv |
| Architecture | Modular + MVC Pattern |
| Deployment | Vercel (Serverless) |

## 📂 Project Structure

```
ride-booking-api/
├── src/
│ ├── app/
│ │ ├── config/
│ │ │ ├── env.ts
│ │ │ ├── passport.ts
│ │ │
│ │ ├── errorHelper/
│ │ │ ├── appError.ts
│ │ │
│ │ ├── middleware/
│ │ │ ├── checkAuth.ts
│ │ │ ├── globalErrorHandler.ts
│ │ │ ├── notFound.ts
│ │ │ ├── validateRequest.ts
│ │ │
│ │ ├── module/
│ │ │ ├── user/
│ │ │ │ ├── user.interface.ts
│ │ │ │ ├── user.model.ts
│ │ │ │ ├── user.controller.ts
│ │ │ │ ├── user.route.ts
│ │ │ │ ├── user.service.ts
│ │ │ │ ├── user.validation.ts
│ │ │ │
│ │ │ ├── auth/
│ │ │ │ ├── auth.interface.ts
│ │ │ │ ├── auth.model.ts
│ │ │ │ ├── auth.controller.ts
│ │ │ │ ├── auth.route.ts
│ │ │ │ ├── auth.service.ts
│ │ │ │ ├── auth.validation.ts
│ │ │ │
│ │ │ ├── driver/
│ │ │ │ ├── driver.interface.ts
│ │ │ │ ├── driver.model.ts
│ │ │ │ ├── driver.controller.ts
│ │ │ │ ├── driver.route.ts
│ │ │ │ ├── driver.service.ts
│ │ │ │ ├── driver.validation.ts
│ │ │ │
│ │ │ ├── ride/
│ │ │ │ ├── ride.interface.ts
│ │ │ │ ├── ride.model.ts
│ │ │ │ ├── ride.controller.ts
│ │ │ │ ├── ride.route.ts
│ │ │ │ ├── ride.service.ts
│ │ │ │ ├── ride.validation.ts
│ │ │
│ │ ├── utils/
│ │ │ ├── catchAsync.ts
│ │ │ ├── haversine.ts
│ │ │ ├── jwt.ts
│ │ │ ├── QueryBuilder.ts
│ │ │ ├── seedSuperAdmin.ts
│ │ │ ├── sendResponse.ts
│ │ │ ├── setAuthCookie.ts
│ │ │ ├── userTokens.ts
│ │ │
│ │ ├── constants.ts
│ │ ├── server.ts
│ │ ├── app.ts
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
```
# Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## API Endpoints Overview



---

### 1️⃣ Authentication API

| Description | Method | Endpoint | Auth Required |
|------------|--------|----------|---------------|
| Register a new user (RIDER/DRIVER) | POST | `/api/v1/auth/register` | No |
| Logout user | POST | `/api/v1/auth/logout` | Yes |
| Login with reset password | POST | `/api/v1/auth/reset-password` | No |
| Login with Google OAuth | GET | `/api/v1/auth/google` | No |
| Google OAuth callback | GET | `/api/v1/auth/google/callback` | No |

---

### 2️⃣ User Management API

| Description | Method | Endpoint | Auth Required |
|------------|--------|----------|---------------|
| Get a specific user profile | GET | `/api/v1/user/:id` | Yes |
| Update user profile | PATCH | `/api/v1/user/:id` | Yes |
| Block or unblock a user (Admin only) | PATCH | `/api/v1/user/block/:id` | Yes |

---

### 3️⃣ Driver Management API

| Description | Method | Endpoint | Auth Required |
|------------|--------|----------|---------------|
| Apply as a driver | POST | `/api/v1/driver/apply-driver` | Yes |
| Get himself | GET | `/api/v1/driver/me` | Yes |
| Get driver profile | GET | `/api/v1/driver/:id` | Yes |

---

### 4️⃣ Ride Management API

| Description | Method | Endpoint | Auth Required |
|------------|--------|----------|---------------|
| Request a new ride (RIDER) | POST | `/api/v1/ride/request` | Yes |
| Check ride his own | POST | `/api/v1/ride/me` | Yes |
| Cancel ride | PATCH | `/api/v1/ride/:id/cancel` | Yes (Rider) |
| Accept driver to ride (Admin/Auto) | PATCH | `/api/v1/ride/:id/accept` | Yes |
| Start ride | PATCH | `/api/v1/ride/:id/start` | Yes (Driver) |
| Complete ride | PATCH | `/api/v1/ride/:id/complete` | Yes (Driver) |

### 5️⃣ Admin & Analytics API

| Description | Method | Endpoint | Auth Required |
|------------|--------|----------|---------------|
| Get all users (Admin only) | GET | `/api/v1/user/all-users` | Yes |
| Block or unblock driver | PATCH | `/api/v1/driver/block/:id` | Yes (Admin) |
| Get all drivers | GET | `/api/v1/driver` | Yes |
| Approve driver application | PATCH | `/api/v1/driver/approve/:id` | Yes (Admin) |
| Suspend driver application | PATCH | `/api/v1/driver/suspend/:id` | Yes (Admin) |
| Get all rides (Admin/Driver/Rider) | GET | `/api/v1/ride/all` | Yes |
| Total earnings per driver/rider | GET | `/api/v1/admin/earnings` | Yes (Admin) |




## Authentication System

| Strategy             | Description              |
| -------------------- | ------------------------ |
| **JWT**              | Email and Password login |
| **Local Strategy**   | Email and Password login |
| **Google OAuth 2.0** | Google sign-in for users |

## Core Features

### ✅ Authentication
- Google OAuth 2.0 and Local strategy
- JWT-based session management
- Password hashing using bcrypt
- Role-based access control (Super Admin, Admin, Rider, Driver)

### 🚘 Ride Management (Upcoming)
- Create ride requests
- Assign nearest driver based on location
- Ride tracking and updates
- Fare calculation

### 👨‍✈️ Driver Management
- Apply as a driver (`/apply-driver`)
- Approval process by admin
- Driver location and vehicle details

### ⚙️ Admin Features (Planned)

- Block/unblock users and drivers
- Manage drivers and riders
- Approve or reject driver applications
- View platform statistics (total rides, earnings, active users)
- Generate reports for rides, revenue, and performance
- Monitor driver availability and utilization



## My Submission of this Project

- **GitHub Repository**     : https://github.com/ParvezMah/L2B5A5-Ride-Booking-API-Backend-Project.git 
- **Live Deployment Link**  : https://l2-b5-a5-ride-booking-api-backend.vercel.app/
- **Video Explanation**     : https://drive.google.com/file/d/1J3wNqtsEPCwaAhZ3gAH3pvktSAvuLbVU/view?usp=sharing 


## Author

### Parvez Mahamud AA  
**Full Stack MERN Developer** | **Bangladesh**  

- 🌐 GitHub: [ParvezMah](https://github.com/ParvezMah)  
- ✉️ Email: [parvezmahmudaa100@gmail.com](parvezmahmudaa100@gmail.com)