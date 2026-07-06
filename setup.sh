#!/bin/bash

echo "=============================================="
echo " Trustlist Service Setup Script (Local Node.js)"
echo "=============================================="
echo

# 1. Install dependencies
echo "Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install npm dependencies."
    exit 1
fi

# 2. Create .env from .env.example if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "[SUCCESS] .env created. Please configure PRIV_KEY in .env."
else
    echo ".env already exists."
fi


# 3. Setup data-repo and connect to git
echo "Setting up data-repo..."
if [ ! -d data-repo ]; then
    mkdir data-repo
fi

cd data-repo
if [ ! -d .git ]; then
    echo "Initializing git repository in data-repo..."
    git init
    git remote add origin https://github.com/NattawitMana/Trust-List-JSON.git
    git branch -M main
    echo "Pulling from remote main..."
    git pull origin main
else
    echo "Git repository already initialized in data-repo."
    git remote remove origin 2>/dev/null || true
    git remote add origin https://github.com/NattawitMana/Trust-List-JSON.git
    git branch -M main
    echo "Pulling latest changes..."
    git pull origin main
fi
cd ..

echo "=============================================="
echo " Setup Completed Successfully!"
echo " You can start the local server with: npm run dev"
echo "=============================================="
exit 0
