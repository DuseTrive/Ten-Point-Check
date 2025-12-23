# Simple PowerShell Web Server with Auto-Browser Launch (Corporate-Safe)
# Save as: Start-WebServer.ps1
# 
# Usage Examples:
#   .\Start-WebServer.ps1                           # Default: port 8080, auto-open browser
#   .\Start-WebServer.ps1 -Port 3000                # Custom port, auto-open browser
#   .\Start-WebServer.ps1 -OpenBrowser:$false       # Don't auto-open browser
#   .\Start-WebServer.ps1 -Path "C:\my\website"     # Custom folder path

param(
    [int]$Port = 8080,
    [string]$Path = (Get-Location).Path,
    [switch]$OpenBrowser = $true
)

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

$url = "http://localhost:$Port"
Write-Host "Web server started at: $url" -ForegroundColor Green
Write-Host "Serving files from: $Path" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Red

# Auto-open browser if requested (Corporate-Safe Methods Only)
if ($OpenBrowser) {
    Write-Host "Opening browser..." -ForegroundColor Cyan
    Start-Sleep -Milliseconds 1500
    
    $browserOpened = $false
    
    # Method 1: Pure PowerShell Start-Process
    if (-not $browserOpened) {
        try {
            Start-Process -FilePath $url -ErrorAction Stop
            $browserOpened = $true
            Write-Host "Browser launched successfully (PowerShell method)" -ForegroundColor Green
        }
        catch {
            Write-Host "Method 1 failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Method 2: .NET Process.Start()
    if (-not $browserOpened) {
        try {
            Add-Type -AssemblyName System.Diagnostics
            [System.Diagnostics.Process]::Start($url) | Out-Null
            $browserOpened = $true
            Write-Host "Browser launched successfully (.NET method)" -ForegroundColor Green
        }
        catch {
            Write-Host "Method 2 failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Method 3: Explorer.exe method
    if (-not $browserOpened) {
        try {
            Start-Process -FilePath "explorer.exe" -ArgumentList $url -ErrorAction Stop
            $browserOpened = $true
            Write-Host "Browser launched successfully (explorer method)" -ForegroundColor Green
        }
        catch {
            Write-Host "Method 3 failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # If all methods failed
    if (-not $browserOpened) {
        Write-Host ""
        Write-Host "===============================================" -ForegroundColor Yellow
        Write-Host "MANUAL BROWSER OPENING REQUIRED" -ForegroundColor White -BackgroundColor Red
        Write-Host "===============================================" -ForegroundColor Yellow
        Write-Host "Corporate security policies prevent auto-browser opening." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please manually:" -ForegroundColor Cyan
        Write-Host "1. Open your web browser (Chrome, Edge, Firefox)" -ForegroundColor White
        Write-Host "2. Copy this URL: $url" -ForegroundColor Green
        Write-Host "3. Paste it in the address bar and press Enter" -ForegroundColor White
        Write-Host ""
        
        # Try to copy URL to clipboard
        try {
            Set-Clipboard -Value $url
            Write-Host "URL copied to clipboard! Just paste (Ctrl+V) in browser." -ForegroundColor Green
        }
        catch {
            Write-Host "Could not copy to clipboard due to security restrictions." -ForegroundColor Yellow
            Write-Host "Please manually type: $url" -ForegroundColor White
        }
        Write-Host "===============================================" -ForegroundColor Yellow
    }
}

Write-Host ("-" * 60) -ForegroundColor Gray

try {
    while ($listener.IsListening) {
        # Wait for request
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $requestedPath = $request.Url.LocalPath.TrimStart('/')
        if ($requestedPath -eq "") { $requestedPath = "index.html" }
        
        $filePath = Join-Path $Path $requestedPath
        
        Write-Host "Request: $($request.HttpMethod) $($request.Url.LocalPath)" -ForegroundColor Cyan
        
        if (Test-Path $filePath -PathType Leaf) {
            # File exists - serve it
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Set content type based on file extension
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($extension) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".json" { $response.ContentType = "application/json" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "text/plain" }
            }
            
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "Served: $requestedPath" -ForegroundColor Green
        }
        else {
            # File not found
            $response.StatusCode = 404
            $errorContent = [System.Text.Encoding]::UTF8.GetBytes("File not found: $requestedPath")
            $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
            Write-Host "Not found: $requestedPath" -ForegroundColor Red
        }
        
        $response.OutputStream.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host ("-" * 60) -ForegroundColor Gray
    Write-Host "Server stopped" -ForegroundColor Red
    Write-Host "You can now close your browser tab" -ForegroundColor Yellow
}