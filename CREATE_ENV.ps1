# PowerShell script to create .env file
# Run: .\CREATE_ENV.ps1

Write-Host "Creating .env file..." -ForegroundColor Green

$envContent = @"
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Option 1: Local MongoDB (recommended for testing)
MONGODB_URI=mongodb://localhost:27017/trineo-tasks

# Option 2: MongoDB Atlas (uncomment and fill in your details)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trineo-tasks?retryWrites=true&w=majority

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration (optional)
# ALLOWED_ORIGINS=http://localhost:5173
"@

$envContent | Out-File -FilePath .env -Encoding utf8

Write-Host "✅ .env file created!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file and update MONGODB_URI if needed" -ForegroundColor White
Write-Host "2. For local MongoDB: Make sure MongoDB is running" -ForegroundColor White
Write-Host "3. For MongoDB Atlas: Update connection string with your credentials" -ForegroundColor White
Write-Host "4. Run: npm start" -ForegroundColor White

