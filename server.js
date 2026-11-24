const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'university_bi_secret_key';
// Replace with your MongoDB Atlas URI if using cloud MongoDB
const MONGO_URI = 'mongodb://127.0.0.1:27017/university_dw';

// 1. Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Data Warehouse');
    seedInitialData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Data Warehouse Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  gpa: { type: Number, required: true },
  feeStatus: { type: String, enum: ['Paid', 'Pending'], required: true },
  amount: { type: Number, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Seed sample data automatically if the database is empty
async function seedInitialData() {
  const count = await Student.countDocuments();
  if (count === 0) {
    await Student.insertMany([
      { name: 'Aman', department: 'IT', gpa: 8.5, feeStatus: 'Paid', amount: 50000 },
      { name: 'Priya', department: 'CS', gpa: 9.1, feeStatus: 'Paid', amount: 50000 },
      { name: 'Rahul', department: 'IT', gpa: 7.4, feeStatus: 'Pending', amount: 50000 },
      { name: 'Sneha', department: 'ECE', gpa: 8.8, feeStatus: 'Paid', amount: 48000 },
      { name: 'Vikram', department: 'CS', gpa: 6.9, feeStatus: 'Pending', amount: 50000 },
      { name: 'Ananya', department: 'ECE', gpa: 9.3, feeStatus: 'Paid', amount: 48000 }
    ]);
    console.log('Sample university data seeded into MongoDB!');
  }
}

// 3. Login Endpoint (Admin + Faculty)
const USERS = {
  admin: { password: 'admin123', role: 'admin' },
  faculty: { password: 'faculty123', role: 'faculty' }
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];

  if (user && user.password === password) {
    const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    return res.json({ token, role: user.role });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

// 4. Authentication & Role Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Please log in.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }
  next();
}

// 5. Protected CRUD Endpoints
// READ: Both Admin and Faculty can view
app.get('/api/warehouse-data', verifyToken, async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// CREATE: Admin only
app.post('/api/warehouse-data', verifyToken, requireAdmin, async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add student record' });
  }
});

// UPDATE: Admin only
app.put('/api/warehouse-data/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update record' });
  }
});

// DELETE: Admin only
app.delete('/api/warehouse-data/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete record' });
  }
});

// 6. Start Server
app.listen(3000, () => {
  console.log('University BI Server running at http://localhost:3000');
});