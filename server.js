require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); 

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB Atlas yang dioptimalkan untuk Vercel Serverless
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://setiabagja5_db_user:20Mei2007@bagja20.12rzmtn.mongodb.net/afex_db?retryWrites=true&w=majority");
        isConnected = true;
        console.log("Berhasil terhubung ke MongoDB Atlas!");
    } catch (err) {
        console.error("Koneksi MongoDB gagal:", err);
    }
}

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Endpoint Tes Server
app.get('/', (req, res) => {
    res.json({ success: true, message: "AFEX Backend is running!" });
});

// Endpoint untuk mendaftar / menyimpan user baru
app.post('/api/users', async (req, res) => {
    try {
        const { telegramId, username } = req.body;
        
        let user = await User.findOne({ telegramId });
        if (user) {
            return res.status(200).json({ success: true, message: "User sudah terdaftar", user });
        }

        user = new User({ telegramId, username });
        await user.save();
        
        res.status(201).json({ success: true, message: "User berhasil disimpan!", user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Ekspor app untuk Vercel Serverless
module.exports = app;