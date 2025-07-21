@echo off
echo Pushing changes to GitHub...
git add .
git commit -m "Update from %date% %time%"
git push
echo Done!
pause
