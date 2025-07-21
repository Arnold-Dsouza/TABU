@echo off
echo Pushing changes to GitHub main branch...
git add .
git commit -m "Update from %date% %time%"
git push origin main
echo Done!
pause
