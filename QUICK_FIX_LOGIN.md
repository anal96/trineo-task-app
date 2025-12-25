# Quick Fix for Login Issue

## Problem
"Invalid credentials" error when trying to login.

## Solution

The seed script was double-hashing passwords. I've fixed it. Now you need to:

### Step 1: Run the seed script again
```bash
npm run seed
```

This will:
- Delete existing test users (Anal, Fayiz, Noel)
- Create them again with correctly hashed passwords

### Step 2: Try logging in again

Use these credentials:
- **Email:** `anal@trineo.com`
- **Password:** `anal@123`

Or:
- **Email:** `fayiz@trineo.com`
- **Password:** `fayiz@123`

Or:
- **Email:** `noel@trineo.com`
- **Password:** `noel@123`

## What Was Fixed

The seed script was manually hashing passwords, but the User model also hashes them automatically. This caused double-hashing, making passwords incorrect. Now the seed script lets the User model handle password hashing automatically.

## Verify It Works

After running `npm run seed`, you should see:
```
✅ Created user: Anal (anal@trineo.com)
✅ Created user: Fayiz (fayiz@trineo.com)
✅ Created user: Noel (noel@trineo.com)
```

Then try logging in - it should work now!


