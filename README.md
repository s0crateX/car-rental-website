# GenRide - Car Rental Management System

<div align="center">
  <img src="./public/assets/images/logo.png" alt="GenRide Logo" width="120" height="120">
  
  <h3>Modern Car Rental Management Platform</h3>
  <p>A comprehensive admin dashboard for managing car rentals, users, and fleet operations</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
  ![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange?style=flat-square&logo=firebase)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Firebase Configuration](#firebase-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Key Components](#key-components)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

GenRide is a modern, full-featured car rental management system built with Next.js 15 and Firebase. It provides a comprehensive admin dashboard for managing car rentals, user accounts, fleet operations, and document verification processes.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure Firebase Authentication
- Role-based access control
- Protected routes and middleware
- Session management

### 👥 User Management
- Complete user profile management
- Email verification status tracking
- User document verification
- Profile picture management with ImageKit integration
- Advanced user filtering and search

### 🚗 Fleet Management
- Comprehensive car inventory management
- Vehicle status tracking
- Car image management
- Fleet analytics and reporting

### 📄 Document Management
- User document verification system
- Owner document management
- Image zoom and preview functionality
- Document status tracking

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark/Light theme support
- Modern component library with Radix UI
- Mobile-first approach
- Smooth animations and transitions

### 📊 Data Management
- Advanced data tables with sorting and filtering
- Real-time data updates
- Export functionality
- Pagination and search

## 🛠 Tech Stack

### Frontend
- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library

### Backend & Database
- **Firebase 10.14.1** - Backend as a Service
  - Firestore - NoSQL database
  - Authentication - User management
  - Storage - File storage
  - Analytics - Usage tracking

### State Management & Forms
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Table** - Data table management

### Additional Libraries
- **ImageKit** - Image optimization and management
- **Date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase account** for backend services
- **ImageKit account** (optional, for image optimization)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd car-rental-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

## ⚙️ Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables**
   
   Create a `.env.local` file in the root directory and configure the required environment variables. See `.env.example` for the complete list of required variables:

   - Firebase configuration (API key, project ID, etc.)
   - ImageKit configuration (optional, for image optimization)
   - Other application-specific settings

   **Note**: Never commit your `.env.local` file to version control as it contains sensitive information.

## 🔥 Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** (Email/Password provider)
   - **Firestore Database**
   - **Storage**
   - **Analytics** (optional)

### 2. Configure Authentication
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Configure authorized domains for your deployment

### 3. Set up Firestore Database
1. Create a Firestore database
2. Set up the required collections for users, cars, bookings, and documents
3. Configure appropriate security rules for your use case

### 4. Configure Security Rules
Set up appropriate Firebase Storage and Firestore security rules based on your application's requirements. Ensure proper authentication checks and data access controls are in place.

**Important**: Review and customize security rules according to your specific needs and security requirements.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
car-rental-website/
├── public/                     # Static assets
│   ├── assets/
│   │   ├── images/            # Images and logos
│   │   ├── fonts/             # Custom fonts
│   │   └── gif/               # Animated assets
│   └── *.svg                  # SVG icons
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── fleet-management/
│   │   │   ├── user-management/
│   │   │   ├── user-documents/
│   │   │   ├── owner-documents/
│   │   │   └── settings/
│   │   ├── login/             # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components (Radix UI)
│   │   ├── layout/            # Layout components
│   │   ├── forms/             # Form components
│   │   ├── common/            # Common components
│   │   ├── providers/         # Context providers
│   │   └── hoc/               # Higher-order components
│   ├── config/                # Configuration files
│   │   └── firebase.ts        # Firebase configuration
│   ├── context/               # React contexts
│   │   └── auth-provider.tsx  # Authentication context
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
│       ├── user.ts
│       └── car.ts
├── components.json            # Shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🧩 Key Components

### Authentication
- **AuthProvider** - Manages authentication state
- **LoginForm** - User login interface
- **ProtectedRoute** - Route protection wrapper

### Dashboard
- **Navbar** - Navigation with mobile responsiveness
- **DataTable** - Advanced table with sorting/filtering
- **UserManagement** - User CRUD operations
- **FleetManagement** - Vehicle management interface

### UI Components
- **AlertDialog** - Confirmation dialogs
- **Avatar** - User profile pictures
- **Badge** - Status indicators
- **Button** - Interactive buttons
- **Card** - Content containers
- **Form** - Form components with validation

## 🔐 Authentication

The application uses Firebase Authentication with the following features:

- **Email/Password authentication**
- **Protected routes** using middleware
- **Role-based access control**
- **Session persistence**
- **Automatic token refresh**

### Authentication Flow
1. User enters credentials on login page
2. Firebase validates credentials
3. User context is updated with user data
4. Protected routes become accessible
5. User data is fetched from Firestore



## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in the deployment dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the build files to your hosting provider
3. Configure environment variables on the server
4. Start the application: `npm run start`

**Security Note**: Ensure all environment variables are properly configured and never expose sensitive credentials in your deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add proper documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by s0crateX</p>
  <p>
    <a href="#top">Back to Top</a>
  </p>
</div>