# Salon Booking Platform

A comprehensive salon booking platform built with Next.js, Firebase, and TailwindCSS. Features role-based authentication for Users, Salon Owners, and Administrators.

## Features

- **Multi-Role Authentication**: Users, Salon Owners, and Admins
- **Role-Based Routing**: Automatic redirection based on user roles
- **Firebase Integration**: Authentication and Firestore database
- **Modern UI**: TailwindCSS with responsive design
- **Secure Routes**: Protected routes with role-based access control

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Firebase (Auth + Firestore)
- **Payments**: Razorpay (planned)
- **Deployment**: Vercel/Netlify ready

## User Roles

### 👤 Customer (User)
- **Search & Discovery**: Advanced search with filters (location, services, price, rating)
- **Booking Flow**: Multi-step booking process with service selection, staff choice, and time slots
- **Payment Integration**: Razorpay integration with multiple payment methods
- **Wallet System**: Digital wallet with transaction history and cashback
- **Offers & Loyalty**: Promo codes, loyalty points, and tier-based rewards
- **Appointment Management**: View, cancel, reschedule bookings with smart policies
- **Reviews & Ratings**: Rate services and provide feedback

### 🏪 Salon Owner
- **Profile Management**: Complete salon setup with photos, services, pricing, and staff
- **Booking Management**: Accept/reject bookings with calendar and list views
- **Earnings Dashboard**: Revenue tracking, commission breakdown, and payout management
- **Reviews & Ratings**: View customer feedback and respond professionally
- **Staff Management**: Add team members with specializations and schedules
- **Service Catalog**: Create and manage service offerings with pricing
- **Operating Hours**: Set availability and working schedules
- **Analytics**: Business insights and performance metrics

### 🔑 Administrator
- Approve salon registrations
- Manage users and salons
- View platform analytics
- Configure system settings
- Generate reports

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd salon-app
npm install
\`\`\`

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase config from Project Settings

### 3. Environment Variables

Create `.env.local` file in the root directory:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Authentication Flow

### Sign Up Process
1. User selects role (Customer or Salon Owner)
2. Fills registration form
3. Account created in Firebase Auth
4. User data stored in appropriate Firestore collection
5. Redirected to role-based dashboard

### Login Process
1. User enters email/password
2. Firebase authentication
3. User data fetched from Firestore
4. Redirected based on user role

### Role-Based Redirection
- **User**: `/dashboard`
- **Salon Owner**: `/salon-dashboard`
- **Admin**: `/admin-dashboard`

## Project Structure

\`\`\`
salon-app/
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Auth pages (login, register)
│   │   ├── (user)/                 # User dashboard pages
│   │   ├── (salon-owner)/          # Salon owner pages
│   │   ├── (admin)/                # Admin pages
│   │   ├── api/                    # API routes
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── auth/                   # Authentication components
│   │   ├── ui/                     # Reusable UI components
│   │   └── common/                 # Shared components
│   ├── context/
│   │   └── AuthContext.js          # Authentication context
│   └── lib/
│       └── firebase/               # Firebase configuration
├── public/                         # Static assets
└── package.json
\`\`\`

## Key Components

### Authentication Context
- Manages authentication state globally
- Provides user data and helper functions
- Handles role-based logic

### Protected Routes
- \`ProtectedRoute\`: Base component for route protection
- \`AdminRoute\`: Admin-only access
- \`SalonOwnerRoute\`: Salon owner access
- \`UserRoute\`: Customer access
- \`GuestRoute\`: Unauthenticated users only

### Firebase Integration
- Authentication utilities
- Firestore operations
- Role-based data storage

## Demo Accounts

For testing purposes, you can create these demo accounts:

- **Customer**: user@demo.com / password
- **Salon Owner**: salon@demo.com / password
- **Admin**: admin@demo.com / password (set role manually in Firestore)

## Admin Role Setup

Admin roles must be set manually in Firestore:

1. Create a user account normally
2. Go to Firestore console
3. Find the user document in the \`users\` collection
4. Update the \`role\` field to \`"admin"\`

## Security Rules

Implement these Firestore security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Salon owners can access their salon data
    match /salonOwners/{ownerId} {
      allow read, write: if request.auth != null && request.auth.uid == ownerId;
    }
    
    // Public read access to salons and services
    match /salons/{salonId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
  }
}
\`\`\`

## Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Adding New Features

1. Follow the existing folder structure
2. Use the AuthContext for authentication
3. Implement proper role-based access control
4. Test with different user roles

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Build the project: \`npm run build\`
2. Upload the \`out\` folder to Netlify
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Note**: This is the authentication foundation. Additional features like booking system, payment integration, and admin panels will be built on top of this structure.
