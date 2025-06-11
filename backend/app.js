const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/user', require('./routes/auth'));

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'CRED Backend API is running!',
        endpoints: {
            signup: 'POST /api/user/signup',
            login: 'POST /api/user/login',
            profile: 'GET /api/user/profile'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: '404 - Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API available at http://localhost:${PORT}`);
    console.log(`📊 Test endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/user/signup`);
    console.log(`   POST http://localhost:${PORT}/api/user/login`);
});