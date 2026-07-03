@echo off
SETLOCAL EnableDelayedExpansion
echo ==============================================
echo  Trustlist Service Setup Script (Local Node.js)
echo ==============================================

:: 1. Install dependencies
echo Installing npm dependencies...
call npm install
if !ERRORLEVEL! neq 0 (
    echo [ERROR] Failed to install npm dependencies.
    pause
    exit /b !ERRORLEVEL!
)

:: 2. Create .env from .env.example if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [SUCCESS] .env created. Please configure PRIV_KEY in .env.
) else (
    echo .env already exists.
)

:: 2b. Check and generate keys
set GENERATE_KEYS=false
if not exist private_key.pem set GENERATE_KEYS=true
if not exist public_key.pem set GENERATE_KEYS=true

if "!GENERATE_KEYS!"=="true" (
    where node >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo Generating private_key.pem and public_key.pem...
        node generateKey.js
    ) else (
        echo [WARNING] Node.js is not installed. Creating empty placeholder files...
        if not exist private_key.pem type nul > private_key.pem
        if not exist public_key.pem type nul > public_key.pem
    )
)

:: 3. Setup data-repo and connect to git
echo Setting up data-repo...
if not exist data-repo (
    mkdir data-repo
)

cd data-repo
if not exist .git (
    echo Initializing git repository in data-repo...
    git init
    git remote add origin https://github.com/NattawitMana/Trust-List-JSON.git
    git branch -M main
    echo Pulling from remote main...
    git pull origin main
) else (
    echo Git repository already initialized in data-repo.
    git remote remove origin >nul 2>&1
    git remote add origin https://github.com/NattawitMana/Trust-List-JSON.git
    git branch -M main
    echo Pulling latest changes...
    git pull origin main
)
cd ..

echo ==============================================
echo  Setup Completed Successfully!
echo  You can start the local server with: npm run dev
echo ==============================================
pause
exit /b 0
