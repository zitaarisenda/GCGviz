# 🚀 Panduan Startup POS GCG Document Hub

## File yang Dibuat

### 1. `start-app.bat` - Script untuk Menjalankan Aplikasi
File ini akan secara otomatis:
- ✅ Memeriksa instalasi Node.js dan npm
- ✅ Menginstall dependencies frontend dan backend (jika belum ada)
- ✅ Menjalankan backend server di port 3000
- ✅ Menjalankan frontend development server di port 8080
- ✅ Membuka browser secara otomatis ke `http://localhost:8080`

### 2. `stop-app.bat` - Script untuk Menghentikan Aplikasi
File ini akan menghentikan semua proses aplikasi yang sedang berjalan.

## 🎯 Cara Penggunaan

### Menjalankan Aplikasi
1. **Double-click** file `start-app.bat`
2. Tunggu hingga semua proses selesai
3. Browser akan terbuka otomatis ke aplikasi

### Menghentikan Aplikasi
1. **Double-click** file `stop-app.bat`
2. Semua proses akan dihentikan

## 📋 Prasyarat

Sebelum menggunakan script ini, pastikan:
- ✅ Node.js sudah terinstall (versi 16 atau lebih baru)
- ✅ npm sudah terinstall
- ✅ Koneksi internet untuk download dependencies

## 🔧 Troubleshooting

### Jika Node.js belum terinstall:
1. Download dari https://nodejs.org/
2. Install dengan default settings
3. Restart komputer
4. Jalankan kembali `start-app.bat`

### Jika ada error "port already in use":
1. Jalankan `stop-app.bat` terlebih dahulu
2. Jalankan kembali `start-app.bat`

### Jika browser tidak terbuka otomatis:
1. Buka browser manual
2. Kunjungi `http://localhost:8080`

## 📁 Struktur Aplikasi

```
pos-gcg-document-hub/
├── start-app.bat          # Script startup
├── stop-app.bat           # Script stop
├── package.json           # Frontend dependencies
├── backend/
│   └── src/
│       ├── package.json   # Backend dependencies
│       └── index.js       # Backend server
└── src/                   # Frontend React code
```

## 🌐 Port yang Digunakan

- **Frontend**: `http://localhost:8080`
- **Backend**: `http://localhost:3000`

## 💡 Tips

- Script akan menginstall dependencies secara otomatis saat pertama kali dijalankan
- Jika sudah pernah diinstall, script akan langsung menjalankan aplikasi
- Gunakan `stop-app.bat` sebelum menjalankan `start-app.bat` jika ada masalah
- Semua output server akan ditampilkan di window terpisah untuk monitoring

---
**Dibuat untuk memudahkan development POS GCG Document Hub** 🎉 