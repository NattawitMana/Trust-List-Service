@echo off
SETLOCAL EnableDelayedExpansion
echo ==============================================
echo  Trustlist Service Setup Script
echo ==============================================

:: Choose setup type
echo Select setup option:
echo [1] Setup and run with Docker (Recommended)
echo [2] Setup and run with Local Node.js
echo.
set /p choice="Enter choice (1 or 2): "

if "!choice!"=="1" goto DOCKER_SETUP
if "!choice!"=="2" goto LOCAL_SETUP
echo Invalid choice. Exiting...
pause
exit /b 1

:DOCKER_SETUP
echo.
echo ==============================================
echo  Setting up with Docker...
echo ==============================================
:: 1. Create .env from .env.example if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [SUCCESS] .env created. Please configure PRIV_KEY in .env.
) else (
    echo .env already exists.
)

:: 1b. Check and generate keys
set GENERATE_KEYS=false
if not exist private_key.pem set GENERATE_KEYS=true
if not exist public_key.pem set GENERATE_KEYS=true

if "!GENERATE_KEYS!"=="true" (
    where node >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo Generating private_key.pem and public_key.pem...
        node generateKey.js
    ) else (
        echo [WARNING] Node.js is not installed. Creating empty placeholder files to prevent Docker mount errors...
        if not exist private_key.pem type nul > private_key.pem
        if not exist public_key.pem type nul > public_key.pem
    )
)

:: 2. Setup data-repo and connect to git
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

:: 3. Run with Docker Compose
echo Building and starting Docker container...
docker compose up --build -d
if !ERRORLEVEL! neq 0 (
    echo [ERROR] Failed to start Docker containers.
    pause
    exit /b !ERRORLEVEL!
)
echo ==============================================
echo  Setup Completed Successfully!
echo  Docker container is running at http://localhost:3000
echo ==============================================
pause
exit /b 0


:LOCAL_SETUP
echo.
echo ==============================================
echo  Setting up with Local Node.js...
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
