import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  getEmployeesApi
} from '../services/api';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  User,
  Loader2
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksRes, empRes] = await Promise.all([
        getTasksApi({
          employee: employeeFilter,
          status: statusFilter,
          priority: priorityFilter,
          search
        }),
        getEmployeesApi()
      ]);
      setTasks(tasksRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error('Error loading task data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [employeeFilter, statusFilter, priorityFilter, search]);

  const handleCreateOrUpdateTask = async (formData) => {
    if (selectedTask) {
      await updateTaskApi(selectedTask._id, formData);
    } else {
      await createTaskApi(formData);
    }
    fetchInitialData();
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskApi(taskId, { status: newStatus });
      fetchInitialData();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteTaskApi(taskToDelete._id);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchInitialData();
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <Header
        title="Task Management & Assignments"
        subtitle="Create tasks, assign them to team members, update progress, and apply filters."
      />

      <div className="page-padding" style={{ padding: '32px' }}>
        {/* Filter Controls Row */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Employee Filter */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Employee Filter
              </label>
              <select
                className="form-select"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
              >
                <option value="All">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Status Filter
              </label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Priority Filter
              </label>
              <select
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Create Task Button */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ width: '100%', height: '42px' }}
              >
                <Plus size={18} />
                <span>+ Create Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Table View */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text-muted)', gap: '12px' }}>
              <Loader2 className="animate-spin" size={24} color="var(--accent-primary)" />
              <span>Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckSquare size={48} color="#475569" style={{ marginBottom: '12px' }} />
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>No Tasks Found</h4>
              <p style={{ fontSize: '0.85rem' }}>Try clearing filters or create a new task above.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Task Title & Description</th>
                    <th>Assigned Employee</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{task.title}</div>
                        {task.description && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td>
                        {task.assignedEmployee ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={task.assignedEmployee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedEmployee.name)}&background=random`}
                              alt={task.assignedEmployee.name}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                {task.assignedEmployee.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {task.assignedEmployee.position}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${task.priority?.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <Calendar size={14} />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </td>
                      <td>
                        {/* Quick Status Change Dropdown */}
                        <select
                          className={`form-select badge-${
                            task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'progress' : 'pending'
                          }`}
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            width: '140px',
                            cursor: 'pointer'
                          }}
                          value={task.status}
                          onChange={(e) => handleQuickStatusChange(task._id, e.target.value)}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="In Progress">⚡ In Progress</option>
                          <option value="Completed">✅ Completed</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setIsTaskModalOpen(true);
                            }}
                            className="btn-icon"
                            title="Edit Task"
                          >
                            <Edit2 size={16} color="var(--accent-secondary)" />
                          </button>
                          <button
                            onClick={() => {
                              setTaskToDelete(task);
                              setIsDeleteModalOpen(true);
                            }}
                            className="btn-icon"
                            title="Delete Task"
                          >
                            <Trash2 size={16} color="#f87171" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        task={selectedTask}
        employees={employees}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Tasks;
