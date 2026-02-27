$ErrorActionPreference = "Stop"

Write-Host "Registering a new company..."
$body = @{
    name = "Tech Innovations"
    email = "hr@techinnovations.com"
    password = "password123"
    role = "company"
    companyName = "Tech Innovations LLC"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $body
$token = $registerResponse.token
Write-Host "Token received."

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "Creating a job..."
$jobBody = @{
    title = "Senior Frontend Engineer"
    description = "We are looking for an experienced React developer."
    salary = 120000
    location = "Remote"
    category = "Engineering"
    skills = @("React", "Tailwind", "JavaScript")
} | ConvertTo-Json

$jobResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method POST -Headers $headers -ContentType "application/json" -Body $jobBody
$jobId = $jobResponse._id
Write-Host "Job created with ID $jobId"

Write-Host "Fetching all jobs (public)..."
$jobs = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method GET
Write-Host "Total jobs: $($jobs.Length)"

Write-Host "Filtering jobs by Category='Engineering' and minSalary=100000..."
$filteredJobs = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs?category=Engineering&minSalary=100000" -Method GET
Write-Host "Filtered jobs: $($filteredJobs.Length)"

Write-Host "Updating job..."
$updateBody = @{
    salary = 130000
    location = "San Francisco, CA (Hybrid)"
} | ConvertTo-Json
$updateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/$jobId" -Method PUT -Headers $headers -ContentType "application/json" -Body $updateBody
Write-Host "Updated Salary: $($updateResponse.salary)"

Write-Host "Deleting job..."
$deleteResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/$jobId" -Method DELETE -Headers $headers
Write-Host $deleteResponse.message

Write-Host "All tests passed!"
