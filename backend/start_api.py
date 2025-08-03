#!/usr/bin/env python3
"""
Simple startup script for PenilaianGCG API
"""

import uvicorn
import sys
import os

def main():
    print("🚀 Starting PenilaianGCG API Backend...")
    print("📡 API will be available at: http://localhost:8000")
    print("📖 Documentation at: http://localhost:8000/docs")
    print("🔄 Processing endpoint: http://localhost:8000/api/process-gcg")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "main:app", 
            host="0.0.0.0", 
            port=8000,
            reload=True,  # Auto-reload on code changes
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 API server stopped by user")
    except Exception as e:
        print(f"❌ Error starting API server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()