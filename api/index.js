const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const contactRoutes = require('./routes/contactRoutes');
//const serviceAccount = require('./firebase-service-account.json');

const firebaseConfig = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  projectId: firebaseConfig.project_id
});

const db = admin.firestore();

// Make Firestore accessible in routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Backend API routes
app.use('/api/contacts', contactRoutes);

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
