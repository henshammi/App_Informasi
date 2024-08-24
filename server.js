//TONG DIOTAKATIK!
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');  // Untuk hashing password
require('dotenv').config();

// Konfigurasi Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// Endpoint Registrasi
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // input ke db
        const { data: user, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword }])
            .single();

        if (error) {
            console.error('Error creating user:', error.message);
            return res.status(500).json({ error: 'Error creating user.' });
        }

        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (err) {
        console.error('Internal server error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint Login 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Login successful.', userId: user.id, userName: user.name });
    } catch (err) {
        console.error('Internal server error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
