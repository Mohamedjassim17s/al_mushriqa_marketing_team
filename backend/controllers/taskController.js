const Task = require('../models/Task');
const Employee = require('../models/Employee');

// @desc    Get tasks (with filtering by employee, status, priority, and search)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { employee, status, priority, search } = req.query;
    let query = {};

    if (employee && employee !== 'All') {
      query.assignedEmployee = employee;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignedEmployee', 'name email position department avatarUrl')
      .sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, assignedEmployee, priority, dueDate, status } = req.body;

    if (!title || !assignedEmployee || !dueDate) {
      return res.status(400).json({ message: 'Title, assigned employee, and due date are required' });
    }

    const employeeExists = await Employee.findById(assignedEmployee);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Assigned employee does not exist' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      assignedEmployee,
      priority: priority || 'Medium',
      dueDate,
      status: status || 'Pending'
    });

    const populatedTask = await Task.findById(task._id).populate(
      'assignedEmployee',
      'name email position department avatarUrl'
    );

    return res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, assignedEmployee, priority, dueDate, status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (assignedEmployee) {
      const employeeExists = await Employee.findById(assignedEmployee);
      if (!employeeExists) {
        return res.status(404).json({ message: 'Assigned employee does not exist' });
      }
      task.assignedEmployee = assignedEmployee;
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate(
      'assignedEmployee',
      'name email position department avatarUrl'
    );

    return res.json(populatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
