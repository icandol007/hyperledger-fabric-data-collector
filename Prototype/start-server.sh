#!/bin/bash
# Stop the server if it's running
if lsof -i :3001 > /dev/null; then
  echo "Stopping existing server..."
  lsof -i :3001 -t | xargs kill -9
else
  echo "No server running on port 3001"
fi

# Start the server
echo "Starting the server..."
node server.js
