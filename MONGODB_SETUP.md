# MongoDB Setup Guide

## MongoDB Atlas (Cloud) - Recommended for Production

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free tier available)

### Step 2: Create Database User
1. Go to **Database Access** in left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password (save these!)
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

### Step 3: Whitelist IP Address
1. Go to **Network Access** in left sidebar
2. Click **Add IP Address**
3. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add your server's IP address
5. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Clusters** in left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `trineo-tasks` (or your preferred name)

### Step 5: Update .env File
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trineo-tasks?retryWrites=true&w=majority
```

**Important:** 
- Replace `username` with your database username
- Replace `password` with your database password (URL-encode special characters)
- Replace `cluster0.xxxxx` with your actual cluster address

## Local MongoDB Setup

### Step 1: Install MongoDB
- **Windows:** Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- **Mac:** `brew install mongodb-community`
- **Linux:** Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

### Step 2: Start MongoDB
```bash
# Windows (if installed as service, it starts automatically)
# Or run: mongod

# Mac/Linux
mongod
```

### Step 3: Update .env File
```env
MONGODB_URI=mongodb://localhost:27017/trineo-tasks
```

## Common Connection String Formats

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Local MongoDB (No Auth)
```
mongodb://localhost:27017/trineo-tasks
```

### Local MongoDB (With Auth)
```
mongodb://username:password@localhost:27017/trineo-tasks?authSource=admin
```

## Troubleshooting

### Error: "authentication failed"
**Solutions:**
1. ✅ Verify username and password are correct
2. ✅ Check password doesn't contain special characters (or URL-encode them)
3. ✅ Ensure database user has proper permissions
4. ✅ Verify IP address is whitelisted (MongoDB Atlas)

### Error: "connection timeout"
**Solutions:**
1. ✅ Check internet connection
2. ✅ Verify MongoDB Atlas cluster is running
3. ✅ Check firewall settings
4. ✅ Verify IP address is whitelisted

### Error: "bad auth"
**Solutions:**
1. ✅ Double-check username/password in connection string
2. ✅ Ensure password is URL-encoded if it contains special characters
3. ✅ Try creating a new database user
4. ✅ Verify user has read/write permissions

### URL Encoding Special Characters
If your password contains special characters, encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

Example:
```
Password: p@ssw:rd
Encoded: p%40ssw%3Ard
```

## Testing Connection

### Using MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Paste your connection string
3. Click **Connect**

### Using Command Line
```bash
# Test connection
mongosh "your-connection-string"
```

## Security Best Practices

1. ✅ Use strong passwords
2. ✅ Whitelist only necessary IP addresses
3. ✅ Use MongoDB Atlas network peering for production
4. ✅ Enable MongoDB Atlas encryption at rest
5. ✅ Regularly rotate database passwords
6. ✅ Use environment variables (never commit connection strings)

## Quick Test

After setting up, test your connection:
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
```

If you see an error, check the troubleshooting section above.

