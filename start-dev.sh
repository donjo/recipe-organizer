#!/bin/bash

echo "🚀 Starting Recipe Organizer Development Environment"
echo ""
echo "Starting API server (Deno + PostgreSQL)..."
deno task api &
API_PID=$!

echo "Waiting for API server to start..."
sleep 3

echo "Starting frontend (Vite + React)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "📡 API Server: http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait