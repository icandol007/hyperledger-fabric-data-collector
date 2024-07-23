#!/bin/bash
# Stop the server if it's running
if lsof -i :3000 > /dev/null; then
  echo "Stopping existing server..."
  lsof -i :3000 -t | xargs kill -9
else
  echo "No server running on port 3000"
fi

# Start the server
echo "Starting the server..."
node server.js
