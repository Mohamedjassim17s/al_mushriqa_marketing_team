const Employee = require('../models/Employee');
const Task = require('../models/Task');

// @desc    Get dashboard metrics & summary
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({});
    const totalTasks = await Task.countDocuments({});
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    // Recent tasks feed
    const recentTasks = await Task.find({})
      .populate('assignedEmployee', 'name avatarUrl position')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Upcoming tasks feed (tasks due soon that are not completed)
    const upcomingTasks = await Task.find({ status: { $ne: 'Completed' } })
      .populate('assignedEmployee', 'name avatarUrl position')
      .sort({ dueDate: 1 })
      .limit(5);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.json({
      totalEmployees,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      completionRate,
      recentTasks,
      upcomingTasks
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
  }
};

module.exports = {
  getDashboardStats
};
