#!/bin/bash

echo "=============================================="
echo " Trustlist Service Setup Script"
echo "=============================================="
echo

echo "Select setup option:"
echo "[1] Setup and run with Docker (Recommended)"
echo "[2] Setup and run with Local Node.js"
echo
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo
    echo "=============================================="
    echo " Setting up with Docker..."
    echo "=============================================="
    
    # 1. Create .env from .env.example if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file from .env.example..."
        cp .env.example .env
        echo "[SUCCESS] .env created. Please configure PRIV_KEY in .env."
    else
        echo ".env already exists."
    fi

    # 1b. Check and generate keys
    GENERATE_KEYS=false
    if [ ! -f private_key.pem ] || [ ! -f public_key.pem ]; then
        GENERATE_KEYS=true
    fi

    if [ "$GENERATE_KEYS" = "true" ]; then
        if command -v node >/dev/null 2>&1; then
            echo "Generating private_key.pem and public_key.pem..."
            node generateKey.js
        else
            echo "[WARNING] Node.js is not installed. Creating empty placeholder files to prevent Docker mount errors..."
            if [ ! -f private_key.pem ]; then
                touch private_key.pem
            fi
            if [ ! -f public_key.pem ]; then
                touch public_key.pem
            fi
        fi
    fi

    # 2. Setup data-repo and connect to git
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

    # 3. Run with Docker Compose
    echo "Building and starting Docker container..."
    docker compose up --build -d
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to start Docker containers."
        exit 1
    fi
    echo "=============================================="
    echo " Setup Completed Successfully!"
    echo " Docker container is running at http://localhost:3000"
    echo "=============================================="
    exit 0

elif [ "$choice" = "2" ]; then
    echo
    echo "=============================================="
    echo " Setting up with Local Node.js..."
    echo "=============================================="
    
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

    # 2b. Check and generate keys
    GENERATE_KEYS=false
    if [ ! -f private_key.pem ] || [ ! -f public_key.pem ]; then
        GENERATE_KEYS=true
    fi

    if [ "$GENERATE_KEYS" = "true" ]; then
        if command -v node >/dev/null 2>&1; then
            echo "Generating private_key.pem and public_key.pem..."
            node generateKey.js
        else
            echo "[WARNING] Node.js is not installed. Creating empty placeholder files..."
            if [ ! -f private_key.pem ]; then
                touch private_key.pem
            fi
            if [ ! -f public_key.pem ]; then
                touch public_key.pem
            fi
        fi
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

else
    echo "Invalid choice. Exiting..."
    exit 1
fi
