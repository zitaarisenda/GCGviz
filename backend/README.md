<<<<<<< HEAD
# PenilaianGCG API Backend

FastAPI backend for integrating the PenilaianGCG web interface with POS Data Cleaner processing.

## 🎯 Purpose

This API serves as a bridge between:
- **Frontend**: React TypeScript PenilaianGCG page (`/penilaian-gcg`)
- **Backend**: POS Data Cleaner Python processing system

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd api/
pip install -r requirements.txt
```

### 2. Run the API Server
```bash
python main.py
```

The API will be available at: `http://localhost:8000`

### 3. API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## 📡 Endpoints

### `POST /api/process-gcg`
Upload and process GCG files (Excel, PDF, Images).

**Request:**
- `file`: Multipart file upload
- Supported formats: `.xlsx`, `.xls`, `.pdf`, `.png`, `.jpg`, `.jpeg`

**Response:**
```json
{
  "success": true,
  "message": "File processed successfully. Extracted 42 rows.",
  "data": [
    {
      "id": "1",
      "aspek": "I",
      "deskripsi": "Komitmen terhadap implementasi GCG...",
      "jumlah_parameter": 6,
      "bobot": 100,
      "skor": 85,
      "capaian": 85,
      "penjelasan": "Baik"
    }
  ],
  "filename": "Penilaian BPKP 2022.xlsx",
  "processing_info": {
    "file_type": "EXCEL",
    "extracted_points": 42,
    "year": "2022",
    "penilai": "Eksternal: BPKP"
  }
}
```

## 🔧 Integration

### Frontend Integration
Update your React frontend to call the real API:

```typescript
const response = await fetch('http://localhost:8000/api/process-gcg', {
  method: 'POST',
  body: formData
});
```

### CORS Configuration
The API is configured to accept requests from:
- `http://localhost:8080` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)

## 🏗️ Architecture

```
Web Interface (React) → FastAPI → POS Data Cleaner → Processed Results
     ↑                     ↑            ↑                    ↓
File Upload          File Processing  Extraction Logic    JSON Response
```

## 📊 Data Flow

1. **Upload**: User uploads file via web interface
2. **Processing**: FastAPI saves file temporarily and calls `POSDataCleaner`
3. **Extraction**: POS system extracts 42 individual indicators (not subtotals)
4. **Conversion**: Results converted to PenilaianRow format for frontend
5. **Response**: JSON data sent back to populate the table

## 🔍 Features

- ✅ **Direct Integration**: Imports `POSDataCleaner` class directly
- ✅ **Full Format Support**: Excel, PDF, Image processing
- ✅ **Enhanced Extraction**: 42 indicators from detailed sheets
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Automatic Cleanup**: Temporary files cleaned up after processing
- ✅ **Logging**: Detailed processing logs
- ✅ **Type Safety**: Full type hints and validation

## 🛠️ Development

### Testing the API
```bash
# Test health check
curl http://localhost:8000/

# Test file upload (replace with actual file)
curl -X POST "http://localhost:8000/api/process-gcg" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@test_file.xlsx"
```

### Adding New Features
- Add new endpoints in `main.py`
- Update data conversion in `convert_to_frontend_format()`
- Add new dependencies to `requirements.txt`
=======
# 🚀 GCG Document Hub Backend

Backend API untuk aplikasi GCG Document Hub yang dibangun dengan Node.js, Express.js, dan PostgreSQL.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth dengan role-based access control
- 📁 **Document Management** - Upload, download, dan manajemen dokumen GCG
- 👥 **User Management** - CRUD operations untuk users, admin, dan super admin
- 🏢 **Organizational Structure** - Manajemen direktorat, subdirektorat, dan divisi
- 📊 **Metadata Management** - Pengelolaan aspek GCG dan klasifikasi
- 🔍 **Advanced Search** - Full-text search dengan filter dan pagination
- 📈 **Audit Logging** - Tracking semua aktivitas dan akses dokumen
- 🚀 **Real-time Updates** - WebSocket support untuk real-time notifications
- 🛡️ **Security** - Rate limiting, CORS, Helmet, dan input validation

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma (optional)
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **Validation:** Zod + express-validator
- **Testing:** Jest
- **Linting:** ESLint

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** 18.0.0 atau lebih baru
- **npm** 8.0.0 atau lebih baru
- **PostgreSQL** 12.0 atau lebih baru
- **Git** untuk version control

## 🚀 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd pos-gcg-document-hub/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env file sesuai konfigurasi Anda
nano .env
```

### 4. Database Setup
```bash
# Buat database PostgreSQL
createdb gcg_document_hub

# Jalankan migration
npm run db:migrate

# Seed data (optional)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## ⚙️ Configuration

### Environment Variables

Buat file `.env` berdasarkan `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/gcg_document_hub"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=gcg_document_hub
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png
```

## 🗄️ Database Setup

### 1. PostgreSQL Installation

**Windows:**
- Download dari [postgresql.org](https://www.postgresql.org/download/windows/)
- Install dengan default settings

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database & User

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE gcg_document_hub;

-- Create user (optional)
CREATE USER gcg_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gcg_document_hub TO gcg_user;

-- Exit
\q
```

### 3. Run Migrations

```bash
# Run initial migration
npm run db:migrate

# Check migration status
npm run db:status

# Reset database (careful!)
npm run db:reset
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "direktoratId": "uuid-here"
}
```

#### POST /auth/refresh
```json
{
  "refreshToken": "your-refresh-token"
}
```

### Document Endpoints

#### GET /documents
```
GET /api/documents?page=1&limit=10&search=keyword&year=2024
```

#### POST /documents/upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

file: [file]
aspectId: "uuid-here"
year: 2024
```

#### GET /documents/:id
```
GET /api/documents/uuid-here
Authorization: Bearer <token>
```

### User Management Endpoints

#### GET /users
```
GET /api/users?role=admin&direktoratId=uuid-here
Authorization: Bearer <token>
```

#### PUT /users/:id
```json
{
  "name": "Updated Name",
  "role": "admin",
  "direktoratId": "new-uuid"
}
```

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (careful!)

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
```

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Main server file
├── database/
│   ├── migrations/      # Database migrations
│   ├── seeds/           # Database seeders
│   └── schema.sql       # Database schema
├── uploads/             # File upload directory
├── logs/                # Application logs
├── tests/               # Test files
├── package.json
├── tsconfig.json
└── README.md
```

### Code Style

Project menggunakan ESLint dengan konfigurasi TypeScript:

```bash
# Check code style
npm run lint

# Fix automatically fixable issues
npm run lint:fix
```

## 🚀 Deployment

### Production Build

```bash
# Build application
npm run build

# Start production server
npm start
```

### Environment Variables

Pastikan semua environment variables production sudah diset dengan benar:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
```

### PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start dist/index.js --name "gcg-backend"

# Monitor application
pm2 monit

# View logs
pm2 logs gcg-backend
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Pastikan PostgreSQL berjalan
   - Check database credentials di `.env`
   - Verify database exists

2. **Port Already in Use**
   - Change port di `.env`
   - Kill process using port: `lsof -ti:3001 | xargs kill -9`

3. **JWT Token Invalid**
   - Check JWT_SECRET di `.env`
   - Verify token expiration
   - Check token format

### Logs

Application logs tersimpan di `./logs/app.log`:

```bash
# View real-time logs
tail -f logs/app.log

# Search for errors
grep "ERROR" logs/app.log
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

- Create issue di GitHub
- Contact development team
- Check documentation

---

**Happy Coding! 🎉**
>>>>>>> upstream/progres-3
