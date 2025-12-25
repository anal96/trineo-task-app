# Quick Fix: MongoDB Connection Error

## Error: `querySrv EBADNAME _mongodb._tcp`

This error means your MongoDB connection string is **malformed** or **invalid**.

## ✅ Quick Fix Options

### Option 1: Use Local MongoDB (Easiest for Testing)

1. **Install MongoDB locally** (if not installed):
   - Download: https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:7`

2. **Update your `.env` file**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/trineo-tasks
   ```

3. **Restart the server**:
   ```bash
   npm start
   ```

### Option 2: Fix MongoDB Atlas Connection String

Your connection string should look like this:

**Correct Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trineo-tasks?retryWrites=true&w=majority
```

**Common Mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Wrong cluster hostname
- ❌ Missing database name
- ❌ Special characters in password not URL-encoded

**Steps to Fix:**

1. **Get correct connection string from MongoDB Atlas:**
   - Login to [MongoDB Atlas](https://cloud.mongodb.com)
   - Go to **Clusters** → Click **Connect**
   - Choose **Connect your application**
   - Copy the connection string

2. **Replace placeholders:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
   
   Replace:
   - `<username>` → Your database username
   - `<password>` → Your database password (URL-encode special chars!)
   - `<dbname>` → `trineo-tasks`

3. **URL-encode password if it has special characters:**
   - `@` → `%40`
   - `:` → `%3A`
   - `/` → `%2F`
   - `?` → `%3F`
   - `#` → `%23`
   - `[` → `%5B`
   - `]` → `%5D`

   **Example:**
   ```
   Password: p@ssw:rd
   Encoded:  p%40ssw%3Ard
   ```

4. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://myuser:p%40ssw%3Ard@cluster0.abc123.mongodb.net/trineo-tasks?retryWrites=true&w=majority
   ```

### Option 3: Check Your Current Connection String

1. **Check your `.env` file:**
   ```bash
   # Windows PowerShell
   Get-Content .env | Select-String MONGODB_URI
   
   # Or just open .env file and check
   ```

2. **Look for these issues:**
   - Does it start with `mongodb://` or `mongodb+srv://`?
   - Is the hostname correct?
   - Are username/password correct?
   - Is there any extra text or malformed parts?

## 🔍 Debug Your Connection String

### Test Format (without connecting):
```javascript
// Valid formats:
✅ mongodb://localhost:27017/trineo-tasks
✅ mongodb+srv://user:pass@cluster.mongodb.net/dbname
✅ mongodb://user:pass@host:27017/dbname

// Invalid formats:
❌ mongodb://_mongodb._tcp.123
❌ mongodb://cluster.mongodb.net (missing protocol details)
❌ just a hostname without mongodb://
```

## 🚀 Quick Test

1. **Create/Update `.env` file:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trineo-tasks
   JWT_SECRET=your-secret-key
   ```

2. **Start MongoDB locally** (if using local):
   ```bash
   # Windows (if installed as service, it's already running)
   # Or start manually if needed
   
   # Mac/Linux
   mongod
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **You should see:**
   ```
   ✅ Connected to MongoDB
   ```

## 📝 Example .env File

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB - Local
MONGODB_URI=mongodb://localhost:27017/trineo-tasks

# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/trineo-tasks?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS (optional)
# ALLOWED_ORIGINS=http://localhost:5173
```

## 🆘 Still Having Issues?

1. **Check MongoDB is running:**
   ```bash
   # Test local MongoDB
   mongosh mongodb://localhost:27017
   ```

2. **Verify connection string format:**
   - Copy your MONGODB_URI from .env
   - Check it matches the correct format above

3. **Try MongoDB Compass:**
   - Download: https://www.mongodb.com/products/compass
   - Paste your connection string
   - See if it connects

4. **Check server logs:**
   - Look for the detailed error message
   - The server now provides specific tips based on error type

## ✅ Success Indicators

When it works, you'll see:
```
🚀 Server running on port 5000
📦 Environment: production
🌐 Serving static files from dist/
✅ Connected to MongoDB
```

If you see this, your MongoDB connection is working! 🎉

