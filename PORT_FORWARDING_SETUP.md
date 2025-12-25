# Port Forwarding Setup Guide

## Overview

Since you can only port forward port **5173**, all API requests are configured to go through the Vite dev server proxy. This means:

- ✅ Frontend runs on port **5173**
- ✅ Backend runs on port **5000** (internal only)
- ✅ All `/api/*` requests are proxied from 5173 → 5000
- ✅ You only need to forward port **5173**

## How It Works

1. **Frontend (Port 5173)**: Your app runs here
2. **Vite Proxy**: Automatically forwards `/api/*` requests to `http://localhost:5000`
3. **Backend (Port 5000)**: Runs locally, not exposed externally

## Setup Steps

### 1. Start Backend (Terminal 1)
```bash
npm run dev:server
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### 2. Start Frontend (Terminal 2)
```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://0.0.0.0:5173/
```

### 3. Port Forward Port 5173

Forward port **5173** to your local machine. The exact steps depend on your router/network setup.

### 4. Access from Mobile/Remote

Access the app using your public IP and port 5173:
- Example: `http://your-public-ip:5173`
- Or use a service like ngrok: `ngrok http 5173`

## Important Notes

- ✅ **Only forward port 5173** - the backend (5000) stays local
- ✅ All API calls automatically go through the proxy
- ✅ CORS is configured to allow all origins
- ✅ The backend must be running on your local machine

## Testing

1. **Test locally**: http://localhost:5173
2. **Test from mobile**: Use your network IP (e.g., `http://192.168.1.x:5173`)
3. **Test remotely**: Use your public IP or ngrok URL

## Troubleshooting

### Issue: "Cannot connect to server" from mobile
**Solution**: 
- Make sure backend is running on your local machine
- Check that port 5173 is forwarded correctly
- Verify the proxy is working (check Vite console for proxy logs)

### Issue: API requests fail
**Solution**:
- Check browser console for proxy errors
- Verify backend is running on port 5000
- Check Vite dev server logs for proxy messages

### Issue: CORS errors
**Solution**:
- Backend CORS is set to allow all origins
- If still having issues, check server logs

## Alternative: Using ngrok

If port forwarding is complex, use ngrok:

```bash
# Install ngrok
# Then run:
ngrok http 5173
```

This gives you a public URL that tunnels to your local port 5173.


