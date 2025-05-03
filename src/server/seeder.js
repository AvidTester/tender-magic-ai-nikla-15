
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'AU',
  },
  {
    name: 'Vendor Company',
    email: 'vendor@example.com',
    password: 'password123',
    role: 'vendor',
    avatar: 'VC',
  },
  {
    name: 'Evaluator One',
    email: 'evaluator1@example.com',
    password: 'password123',
    role: 'evaluator',
    avatar: 'EO',
  },
  {
    name: 'Evaluator Two',
    email: 'evaluator2@example.com',
    password: 'password123',
    role: 'evaluator',
    avatar: 'ET',
  },
];

const importData = async () => {
  try {
    // Clear all data
    await User.deleteMany();

    // Insert users
    await User.insertMany(users);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all data
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
