# Explain My Repo - Automated Run Script
# Author: Luka
# This script automatically starts both frontend and backend servers

param(
    [Parameter(Mandatory=$false)]
    [switch]$Dev,
    
    [Parameter(Mandatory=$false)]
    [switch]$Build,
    
    [Parameter(Mandatory=$false)]
    [switch]$Production,
    
    [Parameter(Mandatory=$false)]
    [switch]$Install,
    
    [Parameter(Mandatory=$false)]
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$SrcDir = Join-Path $PSScriptRoot "src"
$ServerDir = Join-Path $SrcDir "server"

function Show-Banner {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host "                    Explain My Repo                            " -ForegroundColor Cyan
    Write-Host "              AI-Powered Repository Analysis                   " -ForegroundColor Cyan
    Write-Host "                      by Luka                                  " -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Test-NodeInstalled {
    try {
        $null = Get-Command node -ErrorAction Stop
        $null = Get-Command npm -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Green
    Write-Host ""
    
    if (-not (Test-Path $SrcDir)) {
        Write-Host "Error: Source directory not found at $SrcDir" -ForegroundColor Red
        exit 1
    }
    
    Push-Location $SrcDir
    try {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
        npm install
        
        if ($LASTEXITCODE -ne 0) {
            throw "Frontend dependencies installation failed"
        }
        
        Write-Host ""
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "Error installing dependencies: $_" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

function Build-Application {
    Write-Host "Building application..." -ForegroundColor Green
    Write-Host ""
    
    Push-Location $SrcDir
    try {
        Write-Host "Building Next.js application..." -ForegroundColor Cyan
        npm run build
        
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed"
        }
        
        Write-Host ""
        Write-Host "Build completed successfully!" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "Error building application: $_" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

function Clean-Build {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
    Write-Host ""
    
    $CleanPaths = @(
        (Join-Path $SrcDir ".next"),
        (Join-Path $SrcDir "node_modules"),
        (Join-Path $SrcDir "package-lock.json")
    )
    
    foreach ($Path in $CleanPaths) {
        if (Test-Path $Path) {
            Write-Host "Removing: $Path" -ForegroundColor Gray
            Remove-Item -Recurse -Force $Path
        }
    }
    
    Write-Host ""
    Write-Host "Clean completed!" -ForegroundColor Green
    Write-Host ""
}

function Start-DevServers {
    Write-Host "Starting development servers..." -ForegroundColor Green
    Write-Host ""
    
    # Check if dependencies are installed
    if (-not (Test-Path (Join-Path $SrcDir "node_modules"))) {
        Write-Host "Dependencies not found. Installing..." -ForegroundColor Yellow
        Install-Dependencies
    }
    
    Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
    $BackendJob = Start-Job -ScriptBlock {
        param($ServerDir)
        Set-Location $ServerDir
        node index.js
    } -ArgumentList $ServerDir
    
    Start-Sleep -Seconds 2
    
    Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
    $FrontendJob = Start-Job -ScriptBlock {
        param($SrcDir)
        Set-Location $SrcDir
        npm run dev
    } -ArgumentList $SrcDir
    
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "  Servers Started Successfully!                                " -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Press Ctrl+C to stop all servers" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    
    # Monitor jobs
    try {
        while ($true) {
            Start-Sleep -Seconds 1
            
            if ($BackendJob.State -eq "Failed") {
                Write-Host "Backend server failed!" -ForegroundColor Red
                break
            }
            
            if ($FrontendJob.State -eq "Failed") {
                Write-Host "Frontend server failed!" -ForegroundColor Red
                break
            }
            
            # Show output from jobs
            Receive-Job -Job $BackendJob -ErrorAction SilentlyContinue | Write-Host
            Receive-Job -Job $FrontendJob -ErrorAction SilentlyContinue | Write-Host
        }
    } catch {
        Write-Host "Shutting down servers..." -ForegroundColor Yellow
    } finally {
        Stop-Job -Job $BackendJob -ErrorAction SilentlyContinue
        Stop-Job -Job $FrontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $BackendJob -Force -ErrorAction SilentlyContinue
        Remove-Job -Job $FrontendJob -Force -ErrorAction SilentlyContinue
        Write-Host "Servers stopped." -ForegroundColor Yellow
    }
}

function Start-ProductionServers {
    Write-Host "Starting production servers..." -ForegroundColor Green
    Write-Host ""
    
    # Check if build exists
    if (-not (Test-Path (Join-Path $SrcDir ".next"))) {
        Write-Host "Build not found. Building application..." -ForegroundColor Yellow
        Build-Application
    }
    
    Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
    $BackendJob = Start-Job -ScriptBlock {
        param($ServerDir)
        Set-Location $ServerDir
        node index.js
    } -ArgumentList $ServerDir
    
    Start-Sleep -Seconds 2
    
    Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
    $FrontendJob = Start-Job -ScriptBlock {
        param($SrcDir)
        Set-Location $SrcDir
        npm start
    } -ArgumentList $SrcDir
    
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "  Production Servers Started!                                  " -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Press Ctrl+C to stop all servers" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    
    # Monitor jobs
    try {
        while ($true) {
            Start-Sleep -Seconds 1
            
            if ($BackendJob.State -eq "Failed") {
                Write-Host "Backend server failed!" -ForegroundColor Red
                break
            }
            
            if ($FrontendJob.State -eq "Failed") {
                Write-Host "Frontend server failed!" -ForegroundColor Red
                break
            }
        }
    } catch {
        Write-Host "Shutting down servers..." -ForegroundColor Yellow
    } finally {
        Stop-Job -Job $BackendJob -ErrorAction SilentlyContinue
        Stop-Job -Job $FrontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $BackendJob -Force -ErrorAction SilentlyContinue
        Remove-Job -Job $FrontendJob -Force -ErrorAction SilentlyContinue
        Write-Host "Servers stopped." -ForegroundColor Yellow
    }
}

function Show-Help {
    Write-Host "Usage: .\run.ps1 [OPTIONS]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Green
    Write-Host "  -Dev          Start development servers (default)" -ForegroundColor White
    Write-Host "  -Build        Build the application" -ForegroundColor White
    Write-Host "  -Production   Start production servers" -ForegroundColor White
    Write-Host "  -Install      Install dependencies" -ForegroundColor White
    Write-Host "  -Clean        Clean build artifacts" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\run.ps1                  # Start development servers" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Install         # Install dependencies" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Build           # Build application" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Production      # Start production servers" -ForegroundColor Gray
    Write-Host "  .\run.ps1 -Clean           # Clean build artifacts" -ForegroundColor Gray
    Write-Host ""
}

# Main execution
Show-Banner

# Check if Node.js is installed
if (-not (Test-NodeInstalled)) {
    Write-Host "Error: Node.js and npm are required but not installed." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

$NodeVersion = node --version
$NpmVersion = npm --version
Write-Host "Node.js Version: $NodeVersion" -ForegroundColor Gray
Write-Host "npm Version: $NpmVersion" -ForegroundColor Gray
Write-Host ""

# Handle commands
if ($Clean) {
    Clean-Build
    exit 0
}

if ($Install) {
    Install-Dependencies
    exit 0
}

if ($Build) {
    Build-Application
    exit 0
}

if ($Production) {
    Start-ProductionServers
    exit 0
}

# Default: Start dev servers
if ($Dev -or (-not $Production -and -not $Build -and -not $Install -and -not $Clean)) {
    Start-DevServers
    exit 0
}

Show-Help
