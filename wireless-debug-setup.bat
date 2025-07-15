@echo off
echo ================================================================
echo           TABU 2 - Wireless Debugging Setup
echo ================================================================
echo.
echo 📱 STEP 1: On your Android device
echo --------------------------------
echo 1. Go to Settings ^> About phone
echo 2. Tap "Build number" 7 times to enable Developer options
echo 3. Go to Settings ^> System ^> Developer options
echo 4. Enable "USB debugging"
echo 5. Enable "Wireless debugging"
echo 6. Tap "Wireless debugging" ^> "Pair device with pairing code"
echo 7. Note the IP address, port, and 6-digit pairing code
echo.
echo 💻 STEP 2: On your computer
echo ---------------------------
echo.
set /p device_ip="Enter your device's IP address: "
set /p pairing_port="Enter the pairing port: "
set /p pairing_code="Enter the 6-digit pairing code: "
echo.
echo Pairing with device...
"%ANDROID_HOME%\platform-tools\adb.exe" pair %device_ip%:%pairing_port%
echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Device paired successfully!
    echo.
    set /p debug_port="Enter the debugging port (usually 5555): "
    echo Connecting to device...
    "%ANDROID_HOME%\platform-tools\adb.exe" connect %device_ip%:%debug_port%
    echo.
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Connected successfully!
        echo.
        echo 🚀 Now you can deploy your app wirelessly:
        echo    npx cap run android
        echo.
        echo 📱 Your connected devices:
        "%ANDROID_HOME%\platform-tools\adb.exe" devices
    ) else (
        echo ❌ Connection failed. Please check the debugging port.
    )
) else (
    echo ❌ Pairing failed. Please check the IP, port, and pairing code.
)
echo.
pause
