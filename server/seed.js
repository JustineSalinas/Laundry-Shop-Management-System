const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedAdmin() {
    try {
        const pool = require('./config/db');
        const hash = await bcrypt.hash('admin123', 10);
        
        await pool.query(
            "INSERT IGNORE INTO staff (username, password_hash, role) VALUES ('admin', ?, 'admin')",
            [hash]
        );
        console.log('Admin user seeded successfully. Username: admin | Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
