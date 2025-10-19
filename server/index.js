import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const __filename = __filename;
const __dirname = __dirname;

const app = express();
const dbPath = path.join(__dirname, 'db.json');
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Read database file
const readDb = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        throw error;
    }
};

// Write to database file
const writeDb = async (data) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to database:', error);
        throw error;
    }
};

// GET - Fetch all employees
app.get('/employees', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// GET - Fetch single employee by ID
app.get('/employees/:id', async (req, res) => {
    try {
        const db = await readDb();
        const employee = db.employees.find(e => e.id === parseInt(req.params.id));

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// POST - Create new employee
app.post('/employees', async (req, res) => {
    try {
        const { name, role, isActive, salary } = req.body;

        // Validation
        if (!name || !role || salary === undefined) {
            return res.status(400).json({ error: 'Missing required fields: name, role, salary' });
        }

        const db = await readDb();

        // Generate new ID
        const newId = db.employees.length > 0
            ? Math.max(...db.employees.map(e => e.id)) + 1
            : 1;

        const newEmployee = {
            id: newId,
            name: name.trim(),
            role: role.trim(),
            isActive: isActive !== undefined ? isActive : true,
            salary: parseInt(salary)
        };

        db.employees.push(newEmployee);
        await writeDb(db);

        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// PATCH - Update employee
app.patch('/employees/:id', async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const { name, role, isActive, salary } = req.body;

        const db = await readDb();
        const employeeIndex = db.employees.findIndex(e => e.id === employeeId);

        if (employeeIndex === -1) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Update only provided fields
        if (name !== undefined) {
            db.employees[employeeIndex].name = name.trim();
        }
        if (role !== undefined) {
            db.employees[employeeIndex].role = role.trim();
        }
        if (isActive !== undefined) {
            db.employees[employeeIndex].isActive = isActive;
        }
        if (salary !== undefined) {
            db.employees[employeeIndex].salary = parseInt(salary);
        }

        await writeDb(db);
        res.json(db.employees[employeeIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// DELETE - Delete employee
app.delete('/employees/:id', async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const db = await readDb();

        const employeeIndex = db.employees.findIndex(e => e.id === employeeId);

        if (employeeIndex === -1) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const deletedEmployee = db.employees.splice(employeeIndex, 1);
        await writeDb(db);

        res.json({ message: 'Employee deleted successfully', deleted: deletedEmployee[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Employee Server running on http://localhost:${PORT}`);
    console.log(`📊 Database file: ${dbPath}`);
});