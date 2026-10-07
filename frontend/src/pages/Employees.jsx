import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EmployeeModal from '../components/EmployeeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  getEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi
} from '../services/api';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  Mail,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modal states
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await getEmployeesApi();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateOrUpdateEmployee = async (formData) => {
    if (selectedEmployee) {
      await updateEmployeeApi(selectedEmployee._id, formData);
    } else {
      await createEmployeeApi(formData);
    }
    fetchEmployees();
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteEmployeeApi(employeeToDelete._id);
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <Header
        title="Employee Directory"
        subtitle="View team members, roles, and assigned task workloads."
      />

      <div className="page-padding" style={{ padding: '32px' }}>
        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Search employees by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Department Filter Dropdown */}
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Analytics">Analytics</option>
              <option value="Marketing">Marketing</option>
              <option value="General">General</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <UserPlus size={18} />
            <span>+ Add Employee</span>
          </button>
        </div>

        {/* Employees Table Container */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text-muted)', gap: '12px' }}>
              <Loader2 className="animate-spin" size={24} color="var(--accent-primary)" />
              <span>Fetching team members...</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={48} color="#475569" style={{ marginBottom: '12px' }} />
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>No Employees Found</h4>
              <p style={{ fontSize: '0.85rem' }}>Try adjusting your search query or department filter.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Position / Dept</th>
                    <th>Active Tasks</th>
                    <th>Completed</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6366f1&color=fff`}
                            alt={emp.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{emp.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {emp._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          <Mail size={14} />
                          <span>{emp.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>{emp.position}</div>
                        <span className="badge badge-low" style={{ marginTop: '4px' }}>{emp.department}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="#fbbf24" />
                          <span style={{ fontWeight: 700, color: '#fbbf24' }}>{emp.activeTasks || 0} pending</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} color="#34d399" />
                          <span style={{ fontWeight: 700, color: '#34d399' }}>{emp.completedTasks || 0} done</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setIsEmployeeModalOpen(true);
                            }}
                            className="btn-icon"
                            title="Edit Employee"
                          >
                            <Edit2 size={16} color="var(--accent-secondary)" />
                          </button>
                          <button
                            onClick={() => {
                              setEmployeeToDelete(emp);
                              setIsDeleteModalOpen(true);
                            }}
                            className="btn-icon"
                            title="Delete Employee"
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

      {/* Add / Edit Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleCreateOrUpdateEmployee}
        employee={selectedEmployee}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to remove ${employeeToDelete?.name}? All associated tasks will also be unassigned/removed.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Employees;
