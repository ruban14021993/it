echo "InfinityMind Tech - Start Script"
echo "--------------------------------"
echo ""
echo "Before running this script, ensure you have created the PostgreSQL database:"
echo "CREATE USER infinity_user WITH PASSWORD 'infinity_pass';"
echo "CREATE DATABASE infinitydb OWNER infinity_user;"
echo ""

echo "1. Creating Python virtual environment..."
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo "2. Seeding database..."
python seed.py

echo "3. Starting FastAPI backend (port 8000)..."
start cmd /c "call venv\Scripts\activate && uvicorn app.main:app --reload"

echo "4. Installing frontend dependencies..."
cd ../frontend
call npm install

echo "5. Starting Next.js frontend (port 3000)..."
start cmd /c "npm run dev"

echo ""
echo "Services are starting in new windows."
echo "Backend API: http://localhost:8000/api/docs"
echo "Frontend site: http://localhost:3000"
echo "Admin dashboard: http://localhost:3000/admin"
echo ""
pause
