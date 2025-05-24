const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Initialization tracker
console.log('[1] Starting server initialization...');
const app = express();

// Log middleware setup
console.log('[2] Configuring middleware...');
app.use(cors());
app.use(express.json());

// Firebase configuration with error handling
try {
  console.log('[3] Parsing Firebase config...');
  const firebaseConfig = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log('[4] Firebase project ID:', firebaseConfig.project_id);

  console.log('[5] Initializing Firebase Admin SDK...');
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    projectId: firebaseConfig.project_id
  });
  console.log('[6] Firebase initialization successful');
} catch (firebaseError) {
  console.error('[FIREBASE ERROR]', firebaseError);
  process.exit(1);
}

const db = admin.firestore();
console.log('[7] Firestore database instance created');

// Database middleware with logging
app.use((req, res, next) => {
  console.log('[8] Attaching DB to request');
  req.db = db;
  next();
});

// Route loading with error handling
try {
  console.log('[9] Loading contact routes...');
  const contactRoutes = require('./routes/contactRoutes');
  app.use('/api/contacts', contactRoutes);
  console.log('[10] Contact routes mounted at /api/contacts');
} catch (routeError) {
  console.error('[ROUTE LOADING ERROR]', routeError);
  process.exit(1);
}

// Static file serving with path verification
// Static file serving configuration
const staticPath = path.join(__dirname, '../dist');
console.log('[11] Static path:', staticPath);

// Verify directory exists
const fs = require('fs');
if (!fs.existsSync(staticPath)) {
  console.error('[ERROR] Static directory missing:', staticPath);
  process.exit(1);
}

app.use(express.static(staticPath));

// Catch-all route
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('[ERROR] index.html missing at:', indexPath);
    return res.status(500).send('Server configuration error');
  }
  res.sendFile(indexPath);
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[13] Server successfully started on port ${PORT}`);
  console.log('[14] Application initialization complete');
});

// Add error handlers for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT ERROR]', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION] at:', promise, 'reason:', reason);
});