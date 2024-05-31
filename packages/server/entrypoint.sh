#!/bin/sh

# Run migrations
./dist/bin/streampot.js migrate

# Start the server
./dist/bin/streampot.js serve --port=3000 --host=0.0.0.0
