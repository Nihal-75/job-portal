$ErrorActionPreference = "Stop"

Write-Host "--- TEST: Application System & Nodemailer ---"

Write-Host "1. Registering Employer..."
$employerBody = @{
    name = "Microsoft HR"
    email = "hr@microsoft123.com"
    password = "password123"
    role = "company"
    companyName = "Microsoft"
} | ConvertTo-Json

$employerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $employerBody
$employerToken = $employerResponse.token
Write-Host "Employer registered."

Write-Host "2. Creating a Job..."
$jobBody = @{
    title = "Senior Cloud Architect"
    description = "Design Azure solutions."
    salary = 180000
    location = "Seattle, WA"
    category = "Engineering"
} | ConvertTo-Json

$jobResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method POST -Headers @{Authorization="Bearer $employerToken"} -ContentType "application/json" -Body $jobBody
$jobId = $jobResponse._id
Write-Host "Job created with ID $jobId"

Write-Host "3. Registering Job Seeker..."
$seekerBody = @{
    name = "Alex Seeker"
    email = "alex@seeker123.com"
    password = "password123"
    role = "user"
} | ConvertTo-Json

$seekerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $seekerBody
$seekerToken = $seekerResponse.token
Write-Host "Job Seeker registered."

Write-Host "4. Seeker Applying to Job..."
$applyBody = @{
    jobId = $jobId
    resumeUrl = "https://example.com/alex-resume.pdf"
} | ConvertTo-Json

$applyResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/applications" -Method POST -Headers @{Authorization="Bearer $seekerToken"} -ContentType "application/json" -Body $applyBody
Write-Host "Application created with Status: $($applyResponse.status)"

Write-Host "5. Fetching Seeker's Applications..."
$apps = Invoke-RestMethod -Uri "http://localhost:5000/api/applications" -Method GET -Headers @{Authorization="Bearer $seekerToken"}
Write-Host "Total Applications for Seeker: $($apps.Length)"
Write-Host "First application job title: $($apps[0].jobId.title) at $($apps[0].jobId.companyId.companyName)"

Write-Host "--- ALL TESTS PASSED! Check terminal for Email Sent logs! ---"
