# Kill any processes using port 8080
$processes = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
foreach ($proc in $processes) {
    Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
}