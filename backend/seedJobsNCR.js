const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const ncrHubs = [
  'Nehru Place, Delhi', 
  'Okhla Phase 1, Delhi', 
  'Okhla Phase 2, Delhi', 
  'Okhla Phase 3, Delhi', 
  'Noida Sector 62, Uttar Pradesh', 
  'Noida Sector 63, Uttar Pradesh', 
  'Gurgaon Cyber City, Haryana'
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

    console.log('Fetching an existing company user...');
    
    let user = await User.findOne({ role: 'company' });
    if (!user) {
        console.log('No company user found. Creating one...');
        user = await User.create({
            name: 'NCR Tech Solutions Admin',
            email: 'admin@ncrtechsolutions.com',
            password: 'password123',
            role: 'company'
        });
    }

    let companyProfile = await Company.findOne({ userId: user._id });
    if (!companyProfile) {
        console.log('No company profile found for user. Creating one...');
        companyProfile = await Company.create({
            userId: user._id,
            companyName: 'NCR Tech Solutions',
            description: 'Leading provider of tech and digital jobs across the Delhi NCR region.'
        });
    }

    // Do NOT clear previously seeded jobs

    // Create 4 jobs for each hub to populate them well
    console.log(`Seeding jobs across ${ncrHubs.length} NCR Hubs for company: ${companyProfile.companyName}...`);
    
    const jobsToInsert = [];

    for (const locationStr of ncrHubs) {
        for(let i=0; i<4; i++) {

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

            // Adjust salary based on category loosely
            let minSalary, maxSalary;
            if (categoryObj.category === 'Office & Admin' || categoryObj.category === 'Digital Marketing') {
                minSalary = 200000; maxSalary = 600000;
            } else {
                minSalary = 400000; maxSalary = 1800000;
            }
            const salary = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;

            jobsToInsert.push({
                companyId: companyProfile._id,
                status: 'Approved',
                title: title,
                description: `We are actively hiring for the position of ${title} in our premium ${locationStr.split(',')[0]} office. We are looking for dedicated professionals to join our dynamic team in the National Capital Region.`,
                salary: salary,
                location: locationStr, // Full location string e.g. "Gurgaon Cyber City, Haryana"
                category: categoryObj.category,
                skills: jobSkills
            });
        }
    }

    await Job.insertMany(jobsToInsert);
    console.log(`Successfully inserted ${jobsToInsert.length} jobs across NCR Hubs!`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding DB: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
