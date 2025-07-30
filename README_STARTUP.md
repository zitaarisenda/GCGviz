# 🚀 POS GCG Document Hub - Quick Start Guide

## 📁 File yang Dibuat

### 🎯 Script Utama (Pilih Salah Satu)

#### Option 1: Batch Script (Windows CMD)
- **`🚀 START APP.bat`** - Menjalankan aplikasi dengan CMD
- **`🛑 STOP APP.bat`** - Menghentikan aplikasi dengan CMD

#### Option 2: PowerShell Script (Modern Windows)
- **`🚀 START (PowerShell).ps1`** - Menjalankan aplikasi dengan PowerShell
- **`🛑 STOP (PowerShell).ps1`** - Menghentikan aplikasi dengan PowerShell

#### Option 3: Script Standar
- **`start-app.bat`** - Script batch standar
- **`stop-app.bat`** - Script stop standar
- **`start-app.ps1`** - Script PowerShell standar

## 🎯 Cara Penggunaan

### ⚡ Cara Paling Mudah
1. **Double-click** file `🚀 START APP.bat` atau `🚀 START (PowerShell).ps1`
2. Tunggu hingga semua proses selesai (akan ada progress bar)
3. Browser akan terbuka otomatis ke aplikasi

### 🛑 Menghentikan Aplikasi
1. **Double-click** file `🛑 STOP APP.bat` atau `🛑 STOP (PowerShell).ps1`
2. Semua proses akan dihentikan

## 📋 Prasyarat

Sebelum menggunakan script ini, pastikan:
- ✅ **Node.js** sudah terinstall (versi 16 atau lebih baru)
- ✅ **npm** sudah terinstall (biasanya otomatis dengan Node.js)
- ✅ **Koneksi internet** untuk download dependencies

## 🔧 Troubleshooting

### ❌ Jika Node.js belum terinstall:
1. Download dari https://nodejs.org/
2. Install dengan default settings
3. Restart komputer
4. Jalankan kembali script startup

### ❌ Jika ada error "port already in use":
1. Jalankan script stop terlebih dahulu
2. Jalankan kembali script startup

### ❌ Jika browser tidak terbuka otomatis:
1. Buka browser manual
2. Kunjungi `http://localhost:8080`

### ❌ Jika PowerShell tidak bisa dijalankan:
1. Buka PowerShell sebagai Administrator
2. Jalankan: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Coba jalankan script PowerShell lagi

## 🌐 Port yang Digunakan

- **Frontend**: `http://localhost:8080`
- **Backend**: `http://localhost:3000`

## 📊 Fitur Script

### ✅ Yang Dilakukan Otomatis:
- Memeriksa instalasi Node.js dan npm
- Menginstall dependencies frontend dan backend (jika belum ada)
- Menjalankan backend server di port 3000
- Menjalankan frontend development server di port 8080
- Membuka browser secara otomatis
- Menampilkan progress dan status

### 🛡️ Error Handling:
- Pengecekan prasyarat
- Handling error instalasi
- Handling port conflicts
- Informasi error yang jelas

## 💡 Tips & Tricks

### 🚀 Untuk Development:
- Script akan menginstall dependencies secara otomatis saat pertama kali
- Jika sudah pernah diinstall, script akan langsung menjalankan aplikasi
- Semua output server akan ditampilkan di window terpisah untuk monitoring

### 🔄 Restart Aplikasi:
1. Jalankan script stop
2. Jalankan script start
3. Atau gunakan kombinasi `Ctrl+C` di terminal server

### 📝 Monitoring:
- Frontend server: Window dengan judul "Frontend Server"
- Backend server: Window dengan judul "Backend Server"
- Main script: Window dengan judul "POS GCG Document Hub"

## 🎨 Perbedaan Script

| Fitur | Batch (.bat) | PowerShell (.ps1) |
|-------|--------------|-------------------|
| Kompatibilitas | Windows CMD | Windows PowerShell |
| Warna Output | Basic | Full color support |
| Error Handling | Basic | Advanced |
| Performance | Fast | Slightly slower |
| Modern Features | Limited | Full support |

## 📁 Struktur Project

```
pos-gcg-document-hub/
├── 🚀 START APP.bat              # Script startup utama
├── 🛑 STOP APP.bat               # Script stop utama
├── 🚀 START (PowerShell).ps1     # PowerShell startup
├── 🛑 STOP (PowerShell).ps1      # PowerShell stop
├── start-app.bat                 # Script standar
├── stop-app.bat                  # Script stop standar
├── start-app.ps1                 # PowerShell standar
├── README_STARTUP.md             # Panduan ini
├── STARTUP_GUIDE.md              # Panduan singkat
├── package.json                  # Frontend dependencies
├── backend/
│   └── src/
│       ├── package.json          # Backend dependencies
│       └── index.js              # Backend server
└── src/                          # Frontend React code
```

## 🎉 Keuntungan Menggunakan Script Ini

1. **⚡ One-Click Start** - Hanya perlu double-click
2. **🔧 Auto Setup** - Install dependencies otomatis
3. **🌐 Auto Browser** - Browser terbuka otomatis
4. **🛡️ Error Safe** - Handling error yang baik
5. **📊 Progress Info** - Informasi progress yang jelas
6. **🔄 Easy Restart** - Mudah restart aplikasi

---
**Dibuat untuk memudahkan development POS GCG Document Hub** 🎉

*Jika ada masalah, cek troubleshooting di atas atau hubungi developer* 