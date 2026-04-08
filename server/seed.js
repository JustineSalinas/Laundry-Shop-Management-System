const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDatabase() {
    try {
        const pool = require('./config/db');
        
        // 1. Ensure staff table exists (assuming it might but good to enforce if seed is main init)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'staff',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Create the transactions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(100) NOT NULL,
                contact_number VARCHAR(20),
                service_type ENUM('Wash', 'Wash and Dry', 'Fold', 'Comforter') NOT NULL,
                weight DECIMAL(5,2),
                quantity INT,
                total_cost DECIMAL(10,2) NOT NULL,
                order_status ENUM('Pending', 'Processing', 'Ready', 'Completed') DEFAULT 'Pending',
                payment_status ENUM('Unpaid', 'Paid') DEFAULT 'Unpaid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database tables verified/created successfully.');

        // 3. Seed Admin user
        const hash = await bcrypt.hash('admin123', 10);
        await pool.query(
            "INSERT IGNORE INTO staff (username, password_hash, role) VALUES ('admin', ?, 'admin')",
            [hash]
        );
        console.log('Admin user seeded successfully. Username: admin | Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
