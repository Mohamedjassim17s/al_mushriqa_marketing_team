const Employee = require('../models/Employee');
const Task = require('../models/Task');

// @desc    Get all employees with task counts
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    
    // Attach task count breakdown for each employee
    const employeesWithStats = await Promise.all(
      employees.map(async (emp) => {
        const totalTasks = await Task.countDocuments({ assignedEmployee: emp._id });
        const activeTasks = await Task.countDocuments({ 
          assignedEmployee: emp._id, 
          status: { $in: ['Pending', 'In Progress'] } 
        });
        const completedTasks = await Task.countDocuments({ 
          assignedEmployee: emp._id, 
          status: 'Completed' 
        });

        return {
          ...emp.toObject(),
          totalTasks,
          activeTasks,
          completedTasks
        };
      })
    );

    return res.json(employeesWithStats);
  } catch (error) {
    console.error('Error getting employees:', error);
    return res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
  try {
    const { name, email, position, department, avatarUrl } = req.body;

    if (!name || !email || !position) {
      return res.status(400).json({ message: 'Name, email, and position are required' });
    }

    const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email: email.toLowerCase(),
      position,
      department: department || 'General',
      avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });

    return res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({ message: 'Failed to create employee' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const { name, email, position, department, avatarUrl } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await Employee.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use by another employee' });
      }
      employee.email = email.toLowerCase();
    }

    if (name) employee.name = name;
    if (position) employee.position = position;
    if (department) employee.department = department;
    if (avatarUrl !== undefined) employee.avatarUrl = avatarUrl;

    const updatedEmployee = await employee.save();
    return res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({ message: 'Failed to update employee' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Remove tasks associated with deleted employee
    await Task.deleteMany({ assignedEmployee: req.params.id });
    await Employee.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Employee and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Failed to delete employee' });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
