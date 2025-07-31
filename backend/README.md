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