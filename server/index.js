require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const fs         = require('fs');

const { initDatabase } = require('./database/db');
const authRoutes       = require('./routes/auth');
const adminRoutes      = require('./routes/admin');
const questionRoutes   = require('./routes/questions');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.use(['/api/admin/login'], rateLimit({ windowMs: 15*60*1000, max: 30 }));

// Ensure dirs
['uploads','exports','backup'].forEach(d => {
  const p = path.join(__dirname, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

app.use('/api',            authRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/questions',  questionRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ success: false, message: `${req.method} ${req.path} not found` }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  API →  http://localhost:${PORT}`);
    console.log(`🔑  Admin: admin / Admin@2024\n`);
  });
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });

module.exports = app;
