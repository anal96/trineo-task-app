# Install Git on Windows

## Quick Installation

### Option 1: Download Installer (Recommended)
1. Go to: https://git-scm.com/download/win
2. Download the installer (64-bit)
3. Run the installer
4. Use default settings (click Next through all steps)
5. **Restart your terminal/PowerShell** after installation

### Option 2: Using winget (Windows Package Manager)
```powershell
winget install Git.Git
```

### Option 3: Using Chocolatey (if installed)
```powershell
choco install git
```

## After Installation

1. **Close and reopen PowerShell** (important!)
2. **Verify installation:**
   ```powershell
   git --version
   ```
   You should see something like: `git version 2.xx.x`

3. **Configure Git (first time only):**
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Then Continue with GitHub Push

After Git is installed, you can continue:
```powershell
git init
git add .
git commit -m "Initial commit: Trineo Tasks Mobile App"
```

## Alternative: Use GitHub Desktop (GUI)

If you prefer a visual interface:

1. Download: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository" button

No command line needed!

