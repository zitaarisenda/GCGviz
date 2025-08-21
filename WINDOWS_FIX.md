# 🪟 WINDOWS UNICODE FIX

## 🎯 **PROBLEMS FIXED**

1. **Unicode Error**: Windows console can't display emoji characters (🚀📁🔗)
2. **Encoding Issue**: Python trying to print Unicode to cp1252 console

## ✅ **SOLUTION APPLIED**

- Removed all emoji characters from backend startup messages
- Created Windows-specific batch file for easier startup

## 🚀 **WINDOWS DEPLOYMENT OPTIONS**

### Option 1: Use the batch file (RECOMMENDED)
```cmd
double-click start-windows.bat
```

### Option 2: Manual startup (if batch doesn't work)
```cmd
# Terminal 1
python backend/app.py

# Terminal 2 (new window)
npm run dev:frontend
```

### Option 3: Fix encoding then use npm
```cmd
chcp 65001
npm run dev
```

## 📊 **EXPECTED OUTPUT**

When working correctly, you should see:
```
Starting POS Data Cleaner 2 Web API
Upload folder: C:\path\to\uploads
Output folder: C:\path\to\outputs  
CORS enabled for React frontend
Production system integrated
Server starting on http://localhost:5001
```

## 🌐 **ACCESS POINTS**

- **Frontend**: http://localhost:8081/penilaian-gcg
- **Backend**: http://localhost:5001/api/health

---

**Note**: Windows console encoding issues are common. The batch file sets UTF-8 encoding automatically.