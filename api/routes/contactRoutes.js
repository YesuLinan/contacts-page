const express = require('express');
const router = express.Router(); 


// Create a new contact
router.post('/', async (req, res) => {
  try {
    const contactData = req.body;
    const docRef = await req.db.collection('contacts').add(contactData);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all contacts
router.get('/', async (req, res) => {
  try {
    const snapshot = await req.db.collection('contacts').get();
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await req.db.collection('contacts').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
  try {
    await req.db.collection('contacts').doc(req.params.id).update(req.body);
    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    await req.db.collection('contacts').doc(req.params.id).delete();
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ping', async (req, res) => {
  try {
    res.status(200).json("succ");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;