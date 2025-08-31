# Firebase Data Structure for Punjab Care App

## Collections Structure

### 1. `requests` Collection
Stores user help requests with the following structure:

```javascript
{
  name: "string",           // User's name
  location: "string",      // Location or coordinates
  contactNumber: "string",  // Contact number
  typeOfHelp: "string",    // medical, food, shelter, emergencyTransport
  description: "string",   // Detailed description
  sessionId: "string",    // Unique session identifier
  timestamp: "timestamp",  // When request was created
  status: "string",       // pending, completed
  completedAt: "timestamp" // When marked as completed (optional)
}
```

### 2. `helplines` Collection
Stores district-based helpline information with the following structure:

```javascript
{
  name: "string",              // Helpline name
  phone: "string",            // Phone number
  district: "string",         // District name (must match exactly)
  type: "string",             // government or ngo
  description: "string",      // Brief description (optional)
  address: "string",          // Physical address (optional)
  availableHours: "string",   // Operating hours (optional)
  category: "string"          // emergency, medical, food, shelter, transport (optional)
}
```

## District Names
Use these exact district names in the `district` field:

- Amritsar
- Barnala
- Bathinda
- Faridkot
- Fatehgarh Sahib
- Ferozepur
- Gurdaspur
- Hoshiarpur
- Jalandhar
- Kapurthala
- Ludhiana
- Mansa
- Moga
- Muktsar
- Pathankot
- Patiala
- Rupnagar
- S.A.S. Nagar (Mohali)
- Sangrur
- Shahid Bhagat Singh Nagar
- Tarn Taran

## Sample Helpline Data

### Government Helplines Example:
```javascript
{
  name: "District Emergency Control Room",
  phone: "0181-2222222",
  district: "Ludhiana",
  type: "government",
  description: "24/7 Emergency Control Room for Ludhiana District",
  address: "District Administrative Complex, Ludhiana",
  availableHours: "24/7",
  category: "emergency"
}
```

### NGO Helplines Example:
```javascript
{
  name: "Red Cross Society",
  phone: "0181-3333333",
  district: "Ludhiana",
  type: "ngo",
  description: "Medical assistance and relief work",
  address: "Red Cross Bhawan, Civil Lines, Ludhiana",
  availableHours: "8:00 AM - 8:00 PM",
  category: "medical"
}
```

## Firebase Security Rules

### For `requests` collection:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{document} {
      allow read, write: if true; // Allow public read/write for requests
    }
  }
}
```

### For `helplines` collection:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /helplines/{document} {
      allow read: if true; // Allow public read for helplines
      allow write: if false; // Restrict write access
    }
  }
}
```

## Environment Variables Required

Make sure your `.env` file contains:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Indexes Required

Create the following composite indexes in Firebase Console:

1. **requests collection:**
   - `sessionId` (Ascending) + `timestamp` (Descending)
   - `sessionId` (Ascending) + `status` (Ascending) + `timestamp` (Descending)

2. **helplines collection:**
   - `district` (Ascending) + `type` (Ascending)

## Performance Tips

1. **Pagination**: The app uses pagination with 10 items per page to reduce data transfer
2. **Caching**: Client-side caching is implemented for better performance
3. **Indexes**: Use the recommended indexes for faster queries
4. **Data Structure**: Keep helpline documents small and focused
5. **Batch Operations**: Use batch writes when adding multiple helplines

## Troubleshooting

### Common Issues:

1. **"Error submitting request"**: Check Firebase configuration and security rules
2. **"No helplines found"**: Verify district names match exactly and data exists
3. **Slow loading**: Ensure proper indexes are created
4. **Permission denied**: Check Firebase security rules

### Debug Steps:

1. Check browser console for detailed error messages
2. Verify Firebase project configuration
3. Test Firebase connection in Firebase Console
4. Check if collections and documents exist
5. Verify environment variables are loaded correctly
