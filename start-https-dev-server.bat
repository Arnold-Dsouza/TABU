@echo off
echo Starting HTTPS development server for PWA testing...
echo.
echo This requires a local SSL certificate - will be generated if needed
echo.

:: Check if mkcert is installed
where mkcert >nul 2>&1
if %errorlevel% neq 0 (
  echo mkcert not found. Please install mkcert first:
  echo https://github.com/FiloSottile/mkcert#windows
  echo.
  echo You can install it via: choco install mkcert
  echo or download from: https://github.com/FiloSottile/mkcert/releases
  exit /b 1
)

:: Create certificates directory if it doesn't exist
if not exist .\certificates mkdir .\certificates

:: Generate certificates if they don't exist
if not exist .\certificates\localhost.pem (
  echo Generating certificates...
  mkcert -install
  mkcert -cert-file .\certificates\localhost.pem -key-file .\certificates\localhost-key.pem localhost 127.0.0.1 ::1
) else (
  echo Using existing certificates.
)

:: Start Next.js development server with HTTPS
echo Starting Next.js with HTTPS...
set NODE_ENV=development
set HTTPS=true
set SSL_CRT_FILE=.\certificates\localhost.pem
set SSL_KEY_FILE=.\certificates\localhost-key.pem

:: Create a new next.config.mjs file with HTTPS configuration
echo const { createServer } = require('https'); > .\next-https-config.js
echo const { parse } = require('url'); >> .\next-https-config.js
echo const next = require('next'); >> .\next-https-config.js
echo const fs = require('fs'); >> .\next-https-config.js
echo. >> .\next-https-config.js
echo const dev = process.env.NODE_ENV !== 'production'; >> .\next-https-config.js
echo const app = next({ dev }); >> .\next-https-config.js
echo const handle = app.getRequestHandler(); >> .\next-https-config.js
echo. >> .\next-https-config.js
echo const httpsOptions = { >> .\next-https-config.js
echo   key: fs.readFileSync('./certificates/localhost-key.pem'), >> .\next-https-config.js
echo   cert: fs.readFileSync('./certificates/localhost.pem') >> .\next-https-config.js
echo }; >> .\next-https-config.js
echo. >> .\next-https-config.js
echo app.prepare().then(() => { >> .\next-https-config.js
echo   createServer(httpsOptions, (req, res) => { >> .\next-https-config.js
echo     const parsedUrl = parse(req.url, true); >> .\next-https-config.js
echo     handle(req, res, parsedUrl); >> .\next-https-config.js
echo   }).listen(9002, (err) => { >> .\next-https-config.js
echo     if (err) throw err; >> .\next-https-config.js
echo     console.log('> Ready on https://localhost:9002'); >> .\next-https-config.js
echo   }); >> .\next-https-config.js
echo }); >> .\next-https-config.js

:: Run the HTTPS server
node .\next-https-config.js
