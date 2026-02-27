const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const biharCities = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 
  'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui', 
  'Jehanabad', 'Kaimur (Bhabua)', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 
  'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 
  'Purnia', 'Rohtas (Sasaram)', 'Saharsa', 'Samastipur', 'Saran (Chhapra)', 
  'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 
  'West Champaran (Bettiah)'
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
            name: 'Bihar Tech Solutions Admin',
            email: 'admin@bihartechsolutions.com',
            password: 'password123',
            role: 'company'
        });
    }

    let companyProfile = await Company.findOne({ userId: user._id });
    if (!companyProfile) {
        console.log('No company profile found for user. Creating one...');
        companyProfile = await Company.create({
            userId: user._id,
            companyName: 'Bihar Tech Solutions',
            description: 'Leading provider of tech and digital jobs across Bihar.'
        });
    }

    // Do NOT clear previously seeded jobs

    // Create 2 jobs for each city
    console.log(`Seeding jobs across ${biharCities.length} Bihar cities for company: ${companyProfile.companyName}...`);
    
    const jobsToInsert = [];

    for (const city of biharCities) {
        for(let i=0; i<2; i++) {
            const locationStr = `${city}, Bihar`;

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
                minSalary = 150000; maxSalary = 400000;
            } else {
                minSalary = 300000; maxSalary = 1200000;
            }
            const salary = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;

            jobsToInsert.push({
                companyId: companyProfile._id,
                status: 'Approved',
                title: title,
                description: `We are actively hiring for the position of ${title} in our ${city} branch. We are looking for dedicated professionals to join our dynamic team in Bihar.`,
                salary: salary,
                location: locationStr,
                category: categoryObj.category,
                skills: jobSkills
            });
        }
    }

    await Job.insertMany(jobsToInsert);
    console.log(`Successfully inserted ${jobsToInsert.length} jobs across Bihar!`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding DB: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
