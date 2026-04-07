import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from './auth.js';
import Transaction from '../models/Transaction.js';

import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration for bill uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Correct relative path from server/routes/finance.js to server/uploads/bills/
    const uploadPath = path.join(__dirname, '../uploads/bills/');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) and PDFs are allowed'));
  }
});

// Create a new transaction
router.post('/', verifyToken, upload.single('bill'), async (req, res) => {
  try {
    const { title, description, amount, type, category, date, projectId } = req.body;
    
    const transaction = new Transaction({
      title,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date || Date.now(),
      projectId: (projectId && projectId !== 'null' && projectId !== 'undefined') ? projectId : null,
      createdBy: req.userId,
      billUrl: req.file ? `/uploads/bills/${req.file.filename}` : null
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all transactions with filters and stats
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, category, startDate, endDate, projectId } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (projectId && projectId !== 'null' && projectId !== 'undefined') query.projectId = projectId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    // Calculate Summary Stats
    const statsQuery = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      income: statsQuery.find(s => s._id === 'income')?.total || 0,
      expense: statsQuery.find(s => s._id === 'expense')?.total || 0,
      count: transactions.length
    };
    stats.profit = stats.income - stats.expense;

    res.json({
      transactions,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');
      
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
