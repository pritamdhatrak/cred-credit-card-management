const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.json');

// Helper function to read database
const readDB = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [], cards: [], transactions: [] };
    }
};

// Helper function to write database
const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    signup: async (userData, res) => {
        try {
            const { email, password } = userData;
            const db = readDB();

            // Check if user already exists
            const existingUser = db.users.find(user => user.email === email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            db.users.push(newUser);
            writeDB(db);

            // Generate JWT token
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                process.env.SECRET || 'your_secret_key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: { id: newUser.id, email: newUser.email }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    login: async (userData, res) => {
        try {
            const { email, password } = userData;
            const db = readDB();

            // Find user
            const user = db.users.find(user => user.email === email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.SECRET || 'your_secret_key',
                { expiresIn: '24h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getProfile: async (req, res) => {
        try {
            const db = readDB();
            const user = db.users.find(user => user.id === req.user.userId);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    editProfile: async (req, res) => {
        try {
            const db = readDB();
            const userIndex = db.users.findIndex(user => user.id === req.user.userId);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user data
            db.users[userIndex] = { ...db.users[userIndex], ...req.body };
            writeDB(db);

            res.status(200).json({
                message: 'Profile updated successfully',
                user: { id: db.users[userIndex].id, email: db.users[userIndex].email }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};