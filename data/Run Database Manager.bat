@echo off
title Device Database Manager
echo Starting Device Database Manager...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0DeviceDatabaseManager.ps1"
pause
