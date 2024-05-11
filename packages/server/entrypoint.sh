#!/bin/sh

# Run migrations
./dist/cli.js migrate

# Start the server
./dist/cli.js serve --port=3000 --host=0.0.0.0
