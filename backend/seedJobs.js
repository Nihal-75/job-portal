const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const capitals = [
  { state: 'Andhra Pradesh', city: 'Amaravati' },
  { state: 'Arunachal Pradesh', city: 'Itanagar' },
  { state: 'Assam', city: 'Dispur' },
  { state: 'Bihar', city: 'Patna' },
  { state: 'Chhattisgarh', city: 'Raipur' },
  { state: 'Goa', city: 'Panaji' },
  { state: 'Gujarat', city: 'Gandhinagar' },
  { state: 'Haryana', city: 'Chandigarh' },
  { state: 'Himachal Pradesh', city: 'Shimla' },
  { state: 'Jharkhand', city: 'Ranchi' },
  { state: 'Karnataka', city: 'Bengaluru' },
  { state: 'Kerala', city: 'Thiruvananthapuram' },
  { state: 'Madhya Pradesh', city: 'Bhopal' },
  { state: 'Maharashtra', city: 'Mumbai' },
  { state: 'Manipur', city: 'Imphal' },
  { state: 'Meghalaya', city: 'Shillong' },
  { state: 'Mizoram', city: 'Aizawl' },
  { state: 'Nagaland', city: 'Kohima' },
  { state: 'Odisha', city: 'Bhubaneswar' },
  { state: 'Punjab', city: 'Chandigarh' },
  { state: 'Rajasthan', city: 'Jaipur' },
  { state: 'Sikkim', city: 'Gangtok' },
  { state: 'Tamil Nadu', city: 'Chennai' },
  { state: 'Telangana', city: 'Hyderabad' },
  { state: 'Tripura', city: 'Agartala' },
  { state: 'Uttar Pradesh', city: 'Lucknow' },
  { state: 'Uttarakhand', city: 'Dehradun' },
  { state: 'West Bengal', city: 'Kolkata' }
];

const jobTitles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 
  'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 
  'Cloud Architect', 'Machine Learning Engineer', 'UI/UX Designer', 
  'Mobile App Developer', 'Cyber Security Analyst', 'System Administrator',
  'Database Administrator', 'QA Tester', 'Product Manager'
];

const skillsPool = [
  'React', 'Node.js', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'Kubernetes',
  'MongoDB', 'SQL', 'Git', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Angular',
  'Vue.js', 'Ruby on Rails', 'PHP', 'Django', 'Flask', 'Spring Boot'
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    console.log('Fetching an existing company user...');
    
    // Create a generic test company if none exists
    let user = await User.findOne({ role: 'company' });
    if (!user) {
        console.log('No company user found. Creating one...');
        user = await User.create({
            name: 'Generic Company Admin',
            email: 'admin@genericcompany.com',
            password: 'password123',
            role: 'company'
        });
    }

    let companyProfile = await Company.findOne({ userId: user._id });
    if (!companyProfile) {
        console.log('No company profile found for user. Creating one...');
        companyProfile = await Company.create({
            userId: user._id,
            companyName: 'National Tech Solutions',
            description: 'A leading provider of nationwide technology solutions.'
        });
    }

    // Clear previously seeded jobs from this company to avoid massive duplicates 
    await Job.deleteMany({ companyId: companyProfile._id });
    console.log(`Cleared previous jobs for ${companyProfile.companyName}`);

    // Create 2 jobs for each capital (28 * 2 = 56 jobs absolute minimum 50)
    console.log(`Seeding 56 jobs across 28 Capitals for company: ${companyProfile.companyName}...`);
    
    const jobsToInsert = [];

    for (const capitalObj of capitals) {
        for(let i=0; i<2; i++) {
            const locationStr = `${capitalObj.city}, ${capitalObj.state}`;

            // Pick random title and details
            const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
            
            // Pick 3 to 5 random skills
            const numSkills = Math.floor(Math.random() * 3) + 3;
            const jobSkills = [];
            for(let j=0; j<numSkills; j++){
                 const skill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
                 // Prevent duplicate skills
                 if(!jobSkills.includes(skill)) jobSkills.push(skill);
            }

            const salary = Math.floor(Math.random() * (1500000 - 300000 + 1)) + 300000; // Between 3L and 15L INR

            jobsToInsert.push({
                companyId: companyProfile._id,
                status: 'Approved',
                title: title,
                description: `We are looking for a highly skilled ${title} to join our growing team in ${locationStr}. The ideal candidate will have strong problem-solving skills and a passion for technology.`,
                salary: salary,
                location: locationStr,
                category: 'Engineering',
                skills: jobSkills
            });
        }
    }

    await Job.insertMany(jobsToInsert);
    console.log('Successfully inserted 56 jobs across all 28 Indian Capitals!');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding DB: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
