# Test Users

These test users have been created in the database for testing purposes.

## Login Credentials

### User 1: Anal
- **Email:** `anal@trineo.com`
- **Password:** `anal@123`

### User 2: Fayiz
- **Email:** `fayiz@trineo.com`
- **Password:** `fayiz@123`

### User 3: Noel
- **Email:** `noel@trineo.com`
- **Password:** `noel@123`

## How to Create These Users

Run the seed script to create these users in your database:

```bash
npm run seed
```

This will:
- Connect to your MongoDB database
- Create the three test users with hashed passwords
- Skip any users that already exist

## Notes

- Passwords are automatically hashed using bcrypt
- Users are created with the email format: `{name}@trineo.com`
- If a user already exists, the script will skip creating them
- Make sure your MongoDB is running and the connection string in `.env` is correct


