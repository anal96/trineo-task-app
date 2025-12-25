# Fix Your MongoDB Connection String

## Your Current Connection String (Has Issues):
```
mongodb+srv://trineouser:anal@123@cluster1.5ll7az7.mongodb.net/?appName=Cluster1
```

## Problems:
1. ❌ Password `anal@123` contains `@` which conflicts with the `@` separator
2. ❌ Missing database name (should end with `/trineo-tasks`)
3. ❌ Has `?appName=Cluster1` which is not needed

## ✅ Fixed Connection String:

### Step 1: URL-encode the password
- `anal@123` → `anal%40123` (the `@` becomes `%40`)

### Step 2: Add database name
- Add `/trineo-tasks` before the query parameters

### Step 3: Use proper query parameters
- Use `?retryWrites=true&w=majority` instead of `?appName=Cluster1`

## ✅ Correct Format:
```
mongodb+srv://trineouser:anal%40123@cluster1.5ll7az7.mongodb.net/trineo-tasks?retryWrites=true&w=majority
```

## Update Your .env File:

Replace your `MONGODB_URI` line with:
```env
MONGODB_URI=mongodb+srv://trineouser:anal%40123@cluster1.5ll7az7.mongodb.net/trineo-tasks?retryWrites=true&w=majority
```

## URL Encoding Reference:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

## After Updating:
1. Save your `.env` file
2. Restart the server: `npm start`
3. You should see: `✅ Connected to MongoDB`

