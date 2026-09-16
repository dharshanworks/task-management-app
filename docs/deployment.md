# Deployment Guide — Railway

This guide walks through deploying **TaskFlow** to [Railway](https://railway.app) as a unified full-stack service (React frontend + Express.js backend).

---

## 🏗️ Architecture on Railway

The repository is configured for unified deployment:
- **Build Step**: Automatically builds the React Vite frontend into static production files (`frontend/dist`) and installs backend dependencies.
- **Start Step**: The Express server starts, serving API routes at `/api/*` and static frontend SPA assets at `/`, with SPA fallback for client routing.
- **Health Check**: Configured to `/api/health` in `railway.json`.

---

## 📋 Step-by-Step Deployment

### 1. Create a New Railway Project
1. Log in to [Railway](https://railway.app).
2. Click **"+ New Project"**.
3. Select **"Deploy from GitHub repo"**.
4. Choose the repository: `task-management-app` (or `dharshanworks/task-management-app`).
5. Click **"Deploy Now"**.

---

### 2. Configure Environment Variables
In your Railway dashboard:
1. Click on the deployed service card.
2. Navigate to the **"Variables"** tab.
3. Click **"RAW Editor"** (in the top-right corner of the Variables panel).
4. Paste the configuration with your project credentials:

```env
NODE_ENV=production
FIREBASE_PROJECT_ID=task-management-app-001-3f330
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
VITE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=task-management-app-001-3f330.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=task-management-app-001-3f330
VITE_FIREBASE_STORAGE_BUCKET=task-management-app-001-3f330.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=880620557199
VITE_FIREBASE_APP_ID=1:880620557199:web:26f89a56cb82d90e9371fa
```

5. Add the **Firebase Admin Service Account Key**:
   - Variable Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Value: Paste the complete JSON content of your `serviceAccountKey.json` file.

6. Click **"Update Variables"**. Railway will automatically trigger a rebuild.

---

### 3. Generate a Public Domain
1. In the Railway service dashboard, go to the **"Settings"** tab.
2. Scroll down to the **"Networking"** section.
3. Click **"Generate Domain"** (e.g., `task-management-app-production.up.railway.app`).

---

### 4. Authorize Railway Domain in Firebase Console
Google Authentication requires production domains to be in the authorized domains list:
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Go to **Authentication** → **Settings** tab → **Authorized domains**.
3. Click **"Add domain"**.
4. Enter your Railway domain (e.g., `task-management-app-production.up.railway.app` without `https://`).
5. Click **"Save"**.

---

## ✅ Verification
Once the deploy finishes:
- Open your Railway public domain in a browser.
- Verify the Google Sign-In popup opens and signs in.
- Create, drag, and update tasks on the Kanban board.
- Click **"✨ AI"** on a task card to verify Gemini suggestions in production.
- Check health status at `https://<your-railway-domain>/api/health`.
