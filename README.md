[Punjab Care:](https://punjabcare.org/)
#Punjab Care: A flood relief Mobile web app

A mobile-first web application built with React, Tailwind CSS,JavaScript and Firebase to help coordinate flood relief efforts in Punjab.

## Features

- **Simple Home Page**: Elderly-friendly landing page with large buttons and clear text
- **Language Toggle**: Switch between English and Punjabi
- **Request Help Form**: Submit help requests with GPS location detection
- **Helpline Numbers**: View government and NGO contact information
- **View Requests**: Browse all help requests with pagination
- **My Requests**: Track your submitted requests
- **Mobile-First Design**: Optimized for mobile devices
- **Session Management**: Anonymous requests with session tracking

## Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **Backend**: Firebase Firestore
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd punjab-care
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Firestore security rules for read/write access
4. Get your Firebase configuration

### 3. Update Firebase Config

Edit `src/firebase.js` and replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Firestore Collections Setup

Create the following collections in your Firestore database:

#### `requests` Collection
Documents with fields:
- `name` (string)
- `location` (string)
- `contactNumber` (string)
- `typeOfHelp` (string)
- `description` (string)
- `sessionId` (string)
- `timestamp` (timestamp)
- `status` (string)

#### `govt_helplines` Collection
Documents with fields:
- `name` (string)
- `phone` (string)
- `description` (string, optional)

#### `ngo_helplines` Collection
Documents with fields:
- `name` (string)
- `phone` (string)
- `description` (string, optional)

### 5. Firestore Security Rules

Set up Firestore security rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all collections
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: For production, implement proper authentication and authorization rules.

### 6. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Features in Detail

### Language Toggle
- Top-right corner buttons for English/Punjabi
- All UI text changes dynamically
- Session-based language preference

### Request Help Form
- Name, location, contact number fields
- GPS location detection with manual fallback
- Help type dropdown (Medical, Food, Shelter, Emergency Transport)
- Description textarea
- Session ID tracking for anonymous users

### Helpline Numbers
- Government helplines section
- NGO & helping groups section
- Dynamic data from Firestore
- Clean, mobile-friendly layout

### View Requests
- Paginated display (10 requests per batch)
- Load More and Load All functionality
- Expandable request details
- Timestamp and status information

### My Requests
- Shows only current session's requests
- Status indicators (Pending, Completed)
- Expandable details view

## Mobile-First Design

- Responsive design optimized for mobile devices
- Touch-friendly interface elements
- Proper viewport configuration
- No desktop expansion - strictly mobile layout

## Session Management

- Anonymous user sessions using localStorage
- Unique session IDs for request tracking
- No login required
- Session persistence across browser sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## Support

For support and questions, please create an issue in the GitHub repository.
