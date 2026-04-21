# Election Process Education Assistant

## Problem Understanding
Elections in India are massive and complex. Many citizens, particularly first-time voters or those in rural areas, may find the process of registering to vote, finding their polling station, and understanding their rights intimidating. This project provides a simple, intelligent, and secure assistant to guide users through the election process tailored to their demographic.

## Approach
- **Frontend (Vite + React + TS):** A fast, lightweight, accessible UI built with Vanilla CSS to provide a premium, vibrant feel without heavy frameworks. 
- **Backend (Node.js + Express + TS):** A secure API gateway that interfaces with Google Cloud services so API keys are never exposed to the client.
- **Intelligent Chat (Vertex AI / Gemini):** Uses the Gemini 2.5 Flash model to adapt responses based on user personas (e.g., explaining things differently to a student vs. a rural citizen).
- **Location Services (Google Maps):** Provides a map interface to locate nearby polling booths (mocked for demo purposes as official ECI booth locations aren't a public Google Maps layer).
- **Authentication (Firebase):** Secure Google Sign-In to protect the application and personalize the experience.

## Architecture

```text
[ Client (Browser) ] 
       │
       ├─> [ Firebase Auth ] (Google Sign-In)
       │
       ▼
[ Node.js / Express Backend ]
       │
       ├─> [ Vertex AI / Gemini API ] (Context-aware responses)
       │
       └─> [ Polling Stations API ] (Mocked Data / Google Maps integration)
```

## Assumptions
- The user has Node.js (v18+) installed.
- The user will provide their own Google Cloud and Firebase API keys in the `.env` files.
- Polling booth locations are mocked around the user's current geolocation for demonstration.

## How to Run

1. **Clone the repository.**

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   Start the backend:
   ```bash
   npm run build
   npm start
   # or for development: npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## Example User Flows

1. **First-Time Voter:**
   - User signs in via Google.
   - Selects "First-time Voter" persona.
   - Asks: "How do I register to vote?"
   - AI responds with simple, step-by-step instructions focusing on Form 6 and NVSP portal.
   - User views the map to see where their nearest booth is located based on their GPS.

2. **Rural Citizen:**
   - User signs in.
   - Selects "Rural Citizen".
   - Asks: "What do I need to bring to the booth?"
   - AI responds with simplified language emphasizing alternative ID documents (like MGNREGA job card) if Voter ID is not available.

## Test Cases

Run backend tests using:
```bash
cd backend
npm test
```

Sample test coverage includes:
- `POST /api/chat`: Validates that a message is required. Returns 400 if missing.
- `GET /api/maps/polling-stations`: Validates lat/lng parameters. Returns mocked station data if valid.
