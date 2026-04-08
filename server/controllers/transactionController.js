const db = require('../config/db');

// Pricing Constants (Placeholders - can be updated later)
const RATES = {
    'Wash': 35,          // PHP per kg
    'Wash and Dry': 65,  // PHP per kg
    'Fold': 20,          // PHP per kg
    'Comforter': 150     // PHP per piece
};

exports.createTransaction = async (req, res) => {
    try {
        const { customer_name, contact_number, service_type, weight, quantity } = req.body;

        if (!customer_name || !service_type) {
            return res.status(400).json({ message: 'Customer name and service type are required.' });
        }

        let total_cost = 0;

        // Pricing Logic
        if (service_type === 'Comforter') {
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Quantity is required for Comforters.' });
            }
            total_cost = quantity * RATES['Comforter'];
        } else {
            // Wash, Wash and Dry, Fold
            if (!weight || weight <= 0) {
                return res.status(400).json({ message: 'Weight is required for this service.' });
            }
            total_cost = weight * RATES[service_type];
        }

        const query = `
            INSERT INTO transactions 
            (customer_name, contact_number, service_type, weight, quantity, total_cost) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            customer_name, 
            contact_number || null, 
            service_type, 
            weight || null, 
            quantity || null, 
            total_cost
        ];

        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Transaction created successfully',
            transactionId: result.insertId,
            total_cost
        });

    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ message: 'Failed to create transaction' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM transactions ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
