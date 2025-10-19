// api/employees/[id].js
// ⚠️ זה שיתוף של אותו מערך - לא אידיאלי אבל עובד לדמו
let employees = [
    { id: 1, name: "John Smith", role: "Senior Software Engineer", isActive: true, salary: 120000 },
    { id: 2, name: "Sarah Johnson", role: "Project Manager", isActive: true, salary: 95000 },
    { id: 3, name: "Michael Chen", role: "UI/UX Designer", isActive: true, salary: 85000 },
    { id: 4, name: "Emily Davis", role: "Backend Developer", isActive: true, salary: 110000 },
    { id: 5, name: "David Wilson", role: "QA Engineer", isActive: true, salary: 80000 },
    { id: 6, name: "Jessica Martinez", role: "DevOps Engineer", isActive: true, salary: 115000 },
    { id: 7, name: "Robert Taylor", role: "Frontend Developer", isActive: false, salary: 100000 },
    { id: 8, name: "Amanda Brown", role: "Data Analyst", isActive: true, salary: 90000 },
    { id: 9, name: "Christopher Lee", role: "Security Specialist", isActive: true, salary: 125000 },
    { id: 10, name: "Lisa Anderson", role: "Product Owner", isActive: true, salary: 105000 },
    { id: 11, name: "James Garcia", role: "Machine Learning Engineer", isActive: true, salary: 130000 },
    { id: 12, name: "Maria Rodriguez", role: "Business Analyst", isActive: true, salary: 88000 },
    { id: 13, name: "Kevin Thompson", role: "Cloud Architect", isActive: true, salary: 135000 },
    { id: 14, name: "Rachel White", role: "Technical Writer", isActive: false, salary: 75000 },
    { id: 15, name: "Daniel Harris", role: "Mobile Developer", isActive: true, salary: 108000 },
    { id: 16, name: "Sophie Martin", role: "HR Manager", isActive: true, salary: 92000 },
    { id: 17, name: "Matthew Jackson", role: "Full Stack Developer", isActive: true, salary: 112000 },
    { id: 18, name: "Olivia Clark", role: "Marketing Manager", isActive: true, salary: 89000 },
    { id: 19, name: "Brandon Lewis", role: "Systems Administrator", isActive: true, salary: 98000 },
    { id: 20, name: "Megan Walker", role: "Solutions Architect", isActive: true, salary: 128000 }
];

export default function handler(req, res) {
    // הגדרת CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;
    const employeeId = parseInt(id);

    try {
        // GET - Fetch single employee by ID
        if (req.method === 'GET') {
            const employee = employees.find(e => e.id === employeeId);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            return res.status(200).json(employee);
        }

        // PATCH - Update employee
        if (req.method === 'PATCH') {
            const { name, role, isActive, salary } = req.body;
            const employeeIndex = employees.findIndex(e => e.id === employeeId);

            if (employeeIndex === -1) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            if (name !== undefined) {
                employees[employeeIndex].name = name.trim();
            }
            if (role !== undefined) {
                employees[employeeIndex].role = role.trim();
            }
            if (isActive !== undefined) {
                employees[employeeIndex].isActive = isActive;
            }
            if (salary !== undefined) {
                employees[employeeIndex].salary = parseInt(salary);
            }

            return res.status(200).json(employees[employeeIndex]);
        }

        // DELETE - Delete employee
        if (req.method === 'DELETE') {
            const employeeIndex = employees.findIndex(e => e.id === employeeId);

            if (employeeIndex === -1) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            const deletedEmployee = employees.splice(employeeIndex, 1);
            return res.status(200).json({
                message: 'Employee deleted successfully',
                deleted: deletedEmployee[0]
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}