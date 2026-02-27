const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const targetedCities = [
  'Gorakhpur, Uttar Pradesh',
  'Lucknow, Uttar Pradesh',
  'Noida, Uttar Pradesh',
  'Mumbai, Maharashtra',
  'Delhi, NCR'
];

const jobCategories = [
  {
    category: 'IT & Software',
    titles: ['Software Developer', 'Web Developer', 'App Developer', 'Data Analyst', 'Cyber Security Expert', 'Cloud Engineer']
  },
  {
    category: 'Office & Admin',
    titles: ['Data Entry Operator', 'Computer Operator', 'MIS Executive', 'Back Office Executive']
  },
  {
    category: 'Digital Marketing',
    titles: ['Digital Marketing', 'SEO Executive', 'Social Media Manager', 'Content Writer']
  },
  {
    category: 'Design & Media',
    titles: ['Graphic Designer', 'UI/UX Designer', 'Video Editor']
  }
];

const skillsPool = [
  'MS Office', 'Typing', 'Data Management', 'Communication', 'Tally', 'Photoshop',
  'Illustrator', 'Premiere Pro', 'SEO', 'Google Ads', 'Social Media Marketing',
  'Content Creation', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB'
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    let user = await User.findOne({ role: 'company' });
    if (!user) {
        user = await User.create({
            name: 'Targeted Tech Solutions Admin',
            email: 'admin@targetedtech.com',
            password: 'password123',
            role: 'company'
        });
    }

    let companyProfile = await Company.findOne({ userId: user._id });
    if (!companyProfile) {
        companyProfile = await Company.create({
            userId: user._id,
            companyName: 'Targeted Tech Solutions',
            description: 'A premium agency hiring extensively across Gorakhpur, Lucknow, Noida, Mumbai, and Delhi.'
        });
    }

    // Create 20 jobs for EACH of the 5 targeted cities (100 jobs total)
    console.log(`Seeding jobs across the requested 5 target cities for ${companyProfile.companyName}...`);
    
    const jobsToInsert = [];

    for (const locationStr of targetedCities) {
        for(let i=0; i<20; i++) {
            // Pick random category and title
            const categoryObj = jobCategories[Math.floor(Math.random() * jobCategories.length)];
            const title = categoryObj.titles[Math.floor(Math.random() * categoryObj.titles.length)];
            
            // Pick 3 to 5 random skills
            const numSkills = Math.floor(Math.random() * 3) + 3;
            const jobSkills = [];
            for(let j=0; j<numSkills; j++){
                 const skill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
                 // Prevent duplicate skills
                 if(!jobSkills.includes(skill)) jobSkills.push(skill);
            }

            let minSalary, maxSalary;
            if (categoryObj.category === 'Office & Admin' || categoryObj.category === 'Digital Marketing') {
                minSalary = 200000; maxSalary = 500000;
            } else {
                minSalary = 400000; maxSalary = 1500000;
            }
            const salary = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;

            jobsToInsert.push({
                companyId: companyProfile._id,
                status: 'Approved',
                title: title,
                description: `URGENT HIRING: We are actively looking for a skilled ${title} in ${locationStr.split(',')[0]}. Join our fast-growing hub and accelerate your career!`,
                salary: salary,
                location: locationStr,
                category: categoryObj.category,
                skills: jobSkills
            });
        }
    }

    await Job.insertMany(jobsToInsert);
    console.log(`Successfully inserted ${jobsToInsert.length} targeted jobs for Gorakhpur, Lucknow, Noida, Mumbai, and Delhi!`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding DB: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
