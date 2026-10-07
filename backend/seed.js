const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Employee = require('./models/Employee');
const Task = require('./models/Task');

const seedData = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_task_db';

  try {
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
      console.log('Connected to MongoDB for seeding.');
    } catch (err) {
      console.log('Connecting to MongoMemoryServer for seeding...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    }

    // Clear existing collections
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Task.deleteMany({});

    console.log('Cleared existing database records.');

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Admin Manager',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log(`Created Admin user: ${admin.email}`);

    // 2. Create Sample Employees
    const employees = await Employee.create([
      {
        name: 'Ahmed Al-Mansoor',
        email: 'ahmed@company.com',
        position: 'Frontend Developer',
        department: 'Engineering',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Sara Khan',
        email: 'sara@company.com',
        position: 'UI/UX Designer',
        department: 'Design',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'John Miller',
        email: 'john@company.com',
        position: 'Product Manager',
        department: 'Product',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Fatima Zahra',
        email: 'fatima@company.com',
        position: 'Data Analyst',
        department: 'Analytics',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Michael Chen',
        email: 'michael@company.com',
        position: 'Backend Developer',
        department: 'Engineering',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      }
    ]);

    console.log(`Created ${employees.length} employees.`);

    // 3. Create Sample Tasks
    const today = new Date();
    const addDays = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const tasks = [
      {
        title: 'Build company landing page',
        description: 'Create responsive, modern UI for corporate landing page using React & CSS Grid.',
        assignedEmployee: employees[0]._id, // Ahmed
        priority: 'High',
        dueDate: addDays(3),
        status: 'In Progress'
      },
      {
        title: 'Design mobile app wireframes',
        description: 'Prepare high-fidelity Figma prototypes for employee onboarding flow.',
        assignedEmployee: employees[1]._id, // Sara
        priority: 'Medium',
        dueDate: addDays(5),
        status: 'Pending'
      },
      {
        title: 'Create Q4 strategy report',
        description: 'Aggregate metrics and draft executive summary report for board meeting.',
        assignedEmployee: employees[2]._id, // John
        priority: 'Low',
        dueDate: addDays(1),
        status: 'Completed'
      },
      {
        title: 'Optimize Database Indexing',
        description: 'Audit MongoDB query performance and optimize collection indexes.',
        assignedEmployee: employees[4]._id, // Michael
        priority: 'High',
        dueDate: addDays(2),
        status: 'In Progress'
      },
      {
        title: 'Customer churn analytics dataset',
        description: 'Prepare data pipeline and export user retention metrics for sales team.',
        assignedEmployee: employees[3]._id, // Fatima
        priority: 'Medium',
        dueDate: addDays(4),
        status: 'Pending'
      },
      {
        title: 'Fix CRM Auth Token refresh bug',
        description: 'Resolve issue where JWT token expires silently on admin dashboard.',
        assignedEmployee: employees[0]._id, // Ahmed
        priority: 'High',
        dueDate: addDays(-1),
        status: 'Completed'
      },
      {
        title: 'Design System component audit',
        description: 'Review color tokens, button variants, and modal components for consistency.',
        assignedEmployee: employees[1]._id, // Sara
        priority: 'Low',
        dueDate: addDays(7),
        status: 'Pending'
      }
    ];

    await Task.create(tasks);
    console.log(`Created ${tasks.length} sample tasks.`);

    console.log('\n✅ Database seeding complete!');
    console.log('--------------------------------------------------');
    console.log('Default Admin Login Credentials:');
    console.log('Email:    admin@company.com');
    console.log('Password: password123');
    console.log('--------------------------------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
