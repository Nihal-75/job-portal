const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'pandeynihal716@gmail.com';
    const user = await User.findOne({ email });
    
    if (user) {
      user.password = 'password123';
      await user.save();
      console.log(`Password for ${email} has been reset to: password123`);
    } else {
      console.log(`User ${email} not found.`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetPassword();
