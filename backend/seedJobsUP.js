const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const upCities = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 
  'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 
  'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 
  'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 
  'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 
  'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 
  'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri (Lakhimpur)', 'Kushinagar', 'Lalitpur', 
  'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 
  'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 
  'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 
  'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
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
            name: 'UP Tech Solutions Admin',
            email: 'admin@uptechsolutions.com',
            password: 'password123',
            role: 'company'
        });
    }

    let companyProfile = await Company.findOne({ userId: user._id });
    if (!companyProfile) {
        console.log('No company profile found for user. Creating one...');
        companyProfile = await Company.create({
            userId: user._id,
            companyName: 'UP Tech Solutions',
            description: 'Leading provider of tech and digital jobs across Uttar Pradesh.'
        });
    }

    // Do NOT clear previously seeded jobs, as requested "jo pahle ka add hu hai usko rahne diiye"

    // Create 2 jobs for each of the 75 cities (150 jobs total)
    console.log(`Seeding 150 jobs across 75 Uttar Pradesh cities for company: ${companyProfile.companyName}...`);
    
    const jobsToInsert = [];

    for (const city of upCities) {
        for(let i=0; i<2; i++) {
            const locationStr = `${city}, Uttar Pradesh`;

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
                description: `We are actively hiring for the position of ${title} in our ${city} branch. We are looking for dedicated professionals to join our dynamic team in Uttar Pradesh.`,
                salary: salary,
                location: locationStr,
                category: categoryObj.category,
                skills: jobSkills
            });
        }
    }

    await Job.insertMany(jobsToInsert);
    console.log(`Successfully inserted ${jobsToInsert.length} jobs across Uttar Pradesh!`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding DB: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
