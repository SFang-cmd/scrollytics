#!/bin/bash
# Run: bash setup.sh

# Initialize npm project and install dependencies
npm init -y
npm install express pg dotenv cors jsonwebtoken bcryptjs
npm install --save-dev nodemon

# Set up starter files
mkdir routes controllers models middleware
touch index.js .env

# Print success message
echo "Node.js/Express project initialized with dependencies!"
