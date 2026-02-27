const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

console.log('Generating Ethereal email account...');
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }
    
    console.log('Ethereal account created:', account.user);
    
    const envPath = path.join(__dirname, '.env');
    let envConfig = fs.readFileSync(envPath, 'utf8');
    
    envConfig = envConfig.replace(/SMTP_USER=.*/, `SMTP_USER=${account.user}`);
    envConfig = envConfig.replace(/SMTP_PASS=.*/, `SMTP_PASS=${account.pass}`);
    
    fs.writeFileSync(envPath, envConfig);
    console.log('.env file updated with Ethereal credentials.');
});
