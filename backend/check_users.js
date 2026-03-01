const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'email role name');
    console.log('--- Registered Users ---');
    users.forEach(u => {
      console.log(`Email: ${u.email} | Role: ${u.role} | Name: ${u.name}`);
    });
    console.log('------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
