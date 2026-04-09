const bcrypt = require('bcrypt');
const db = require('../config/db');

// Helper function to extract user data safely from req.user
// Note: We need to implement an authMiddleware that decodes the JWT and attaches it to req.user before hitting these routes.
// We'll write the auth middleware logic in a separate file.

exports.getStaff = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, role, created_at FROM staff ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching staff:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

        const hash = await bcrypt.hash(password, 10);
        const userRole = role === 'admin' ? 'admin' : 'staff';

        const [result] = await db.query(
            'INSERT INTO staff (username, password_hash, role) VALUES (?, ?, ?)',
            [username, hash, userRole]
        );

        res.status(201).json({ message: 'Staff created successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username already exists' });
        console.error('Error creating staff:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;
        const userRole = role === 'admin' ? 'admin' : 'staff';
        
        let query = 'UPDATE staff SET username=?, role=? WHERE id=?';
        let values = [username, userRole, id];

        if (password && password.trim() !== '') {
            const hash = await bcrypt.hash(password, 10);
            query = 'UPDATE staff SET username=?, password_hash=?, role=? WHERE id=?';
            values = [username, hash, userRole, id];
        }

        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Staff member not found' });

        res.status(200).json({ message: 'Staff updated successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username already exists' });
        console.error('Error updating staff:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM staff WHERE id=?', [id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Staff member not found' });
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (err) {
        console.error('Error deleting staff:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
