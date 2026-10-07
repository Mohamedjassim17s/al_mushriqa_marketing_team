import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getDashboardStatsApi } from '../services/api';
import { Users, CheckSquare, Clock, Loader2, CheckCircle2, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data } = await getDashboardStatsApi();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--text-muted)', gap: '12px' }}>
        <Loader2 className="animate-spin" size={28} color="var(--accent-primary)" />
        <span>Loading Real-time Metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Employees',
      count: stats?.totalEmployees || 0,
      icon: Users,
      color: '#000000',
      bg: 'transparent',
      border: '#000000',
      subtitle: 'Active staff members'
    },
    {
      title: 'Total Tasks',
      count: stats?.totalTasks || 0,
      icon: CheckSquare,
      color: '#000000',
      bg: 'transparent',
      border: '#000000',
      subtitle: 'Created across teams'
    },
    {
      title: 'Pending',
      count: stats?.pendingTasks || 0,
      icon: Clock,
      color: '#000000',
      bg: 'transparent',
      border: '#000000',
      subtitle: 'Awaiting start'
    },
    {
      title: 'In Progress',
      count: stats?.inProgressTasks || 0,
      icon: Loader2,
      color: '#000000',
      bg: 'transparent',
      border: '#000000',
      subtitle: 'Being actively worked on'
    },
    {
      title: 'Completed',
      count: stats?.completedTasks || 0,
      icon: CheckCircle2,
      color: '#000000',
      bg: 'transparent',
      border: '#000000',
      subtitle: 'Finished tasks'
    }
  ];

  const barData = [
    { name: 'May', completed: 12 },
    { name: 'Jun', completed: 19 },
    { name: 'Jul', completed: 15 },
    { name: 'Aug', completed: 22 },
    { name: 'Sep', completed: 28 },
    { name: 'Oct', completed: stats?.completedTasks || 10 },
  ];

  const pieData = [
    { name: 'Pending', value: stats?.pendingTasks || 1, color: '#f59e0b' },
    { name: 'In Progress', value: stats?.inProgressTasks || 1, color: '#4f46e5' },
    { name: 'Completed', value: stats?.completedTasks || 1, color: '#10b981' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <Header
        title="Operations Dashboard"
        subtitle="Real-time summary of employees, assigned workloads, and task progress."
      />

      <div className="page-padding" style={{ padding: '32px' }}>
        {/* Top Metric Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="glass-panel stat-card"
                style={{
                  padding: '20px',
                  border: `1px solid ${card.border}`,
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (card.title === 'Employees') navigate('/employees');
                  else navigate('/tasks');
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Icon size={28} color={card.color} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1 }}>
                  {card.count}
                </h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: card.color, marginTop: '8px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {card.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* Bar Chart Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Completion Trends
              </h3>
              <span className="badge badge-completed">
                ↑ 12% vs last month
              </span>
            </div>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <RechartsTooltip cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="completed" fill="var(--accent-orange)" radius={[6, 6, 6, 6]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Panel */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, marginBottom: '24px' }}>
              Task Distribution
            </h3>
            <div style={{ height: '180px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{stats?.totalTasks || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks</div>
              </div>
            </div>
          </div>

        </div>

        {/* Two Column Layout: Recent Activity & Quick Actions */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Recent Tasks List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Recent Tasks Activity
              </h3>
              <button onClick={() => navigate('/tasks')} className="btn btn-sm btn-secondary">
                View All Tasks
              </button>
            </div>

            {stats?.recentTasks?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent task activity recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats?.recentTasks?.map((task) => (
                  <div key={task._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Assigned to: <strong style={{ color: '#cbd5e1' }}>{task.assignedEmployee?.name || 'Unassigned'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge badge-${
                        task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'progress' : 'pending'
                      }`}>
                        {task.status}
                      </span>
                      <span className={`badge badge-${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Quick Operations
            </h3>

            <button
              onClick={() => navigate('/employees')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '14px 16px' }}
            >
              <Plus size={20} />
              <span>Manage & Add Employees</span>
            </button>

            <button
              onClick={() => navigate('/tasks')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '14px 16px', borderColor: 'rgba(249, 115, 22, 0.4)' }}
            >
              <CheckSquare size={20} color="var(--accent-orange)" />
              <span>Create & Assign Tasks</span>
            </button>

            <div style={{
              marginTop: 'auto',
              padding: '16px',
              background: 'rgba(249, 115, 22, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(249, 115, 22, 0.25)'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                💡 Admin Tip
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Changing task status directly from the Tasks table immediately updates your real-time completion metrics!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
