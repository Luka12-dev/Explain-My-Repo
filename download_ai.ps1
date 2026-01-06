# AI Model Download Script for Explain My Repo
# Author: Luka
# This script downloads AI models for repository analysis

param(
    [Parameter(Mandatory=$false)]
    [int]$ModelChoice
)

$ModelsDir = Join-Path $PSScriptRoot "models"
$ErrorActionPreference = "whStop"

# Model definitions
$Models = @(
    @{
        ID = 1
        Name = "Code Llama 7B"
        Size = "3.8 GB"
        URL = "https://huggingface.co/TheBloke/CodeLlama-7B-GGUF/resolve/main/codellama-7b.Q4_K_M.gguf"
        Filename = "codellama-7b.gguf"
        Description = "Fast and efficient code analysis model"
    },
    @{
        ID = 2
        Name = "Code Llama 13B"
        Size = "7.3 GB"
        URL = "https://huggingface.co/TheBloke/CodeLlama-13B-GGUF/resolve/main/codellama-13b.Q4_K_M.gguf"
        Filename = "codellama-13b.gguf"
        Description = "Advanced code analysis with deeper understanding"
    },
    @{
        ID = 3
        Name = "Code Llama 34B"
        Size = "19 GB"
        URL = "https://huggingface.co/TheBloke/CodeLlama-34B-GGUF/resolve/main/codellama-34b.Q4_K_M.gguf"
        Filename = "codellama-34b.gguf"
        Description = "Professional-grade analysis with comprehensive insights"
    },
    @{
        ID = 4
        Name = "StarCoder 15B"
        Size = "8.5 GB"
        URL = "https://huggingface.co/TheBloke/starcoder-GGUF/resolve/main/starcoder-15b.Q4_K_M.gguf"
        Filename = "starcoder-15b.gguf"
        Description = "Specialized for multi-language code understanding"
    },
    @{
        ID = 5
        Name = "WizardCoder 15B"
        Size = "8.2 GB"
        URL = "https://huggingface.co/TheBloke/WizardCoder-15B-GGUF/resolve/main/wizardcoder-15b.Q4_K_M.gguf"
        Filename = "wizardcoder-15b.gguf"
        Description = "High-performance code comprehension"
    },
    @{
        ID = 6
        Name = "DeepSeek Coder 6.7B"
        Size = "3.5 GB"
        URL = "https://huggingface.co/TheBloke/deepseek-coder-6.7b-GGUF/resolve/main/deepseek-coder-6.7b.Q4_K_M.gguf"
        Filename = "deepseek-coder-6.7b.gguf"
        Description = "Efficient and accurate code analysis"
    },
    @{
        ID = 7
        Name = "Phi-2 2.7B"
        Size = "1.5 GB"
        URL = "https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf"
        Filename = "phi-2.gguf"
        Description = "Compact model for fast analysis"
    },
    @{
        ID = 8
        Name = "Mistral 7B Instruct"
        Size = "4.1 GB"
        URL = "https://huggingface.co/TheBloke/Mistral-7B-Instruct-GGUF/resolve/main/mistral-7b-instruct.Q4_K_M.gguf"
        Filename = "mistral-7b-instruct.gguf"
        Description = "General-purpose with strong code understanding"
    },
    @{
        ID = 9
        Name = "Llama 2 7B"
        Size = "3.8 GB"
        URL = "https://huggingface.co/TheBloke/Llama-2-7B-GGUF/resolve/main/llama-2-7b.Q4_K_M.gguf"
        Filename = "llama-2-7b.gguf"
        Description = "Versatile model for code analysis"
    },
    @{
        ID = 10
        Name = "Granite Code 8B"
        Size = "4.5 GB"
        URL = "https://huggingface.co/TheBloke/granite-code-8b-GGUF/resolve/main/granite-code-8b.Q4_K_M.gguf"
        Filename = "granite-code-8b.gguf"
        Description = "Enterprise-grade code analysis"
    }
)

function Show-Banner {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host "           Explain My Repo - AI Model Downloader                " -ForegroundColor Cyan
    Write-Host "                      by Luka                                   " -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Models {
    Write-Host "Available AI Models:" -ForegroundColor Green
    Write-Host ""
    
    foreach ($Model in $Models) {
        $Status = "Not Downloaded"
        $StatusColor = "Yellow"
        
        $ModelPath = Join-Path $ModelsDir $Model.Filename
        if (Test-Path $ModelPath) {
            $Status = "Downloaded"
            $StatusColor = "Green"
        }
        
        Write-Host (" [{0}] " -f $Model.ID) -NoNewline -ForegroundColor Cyan
        Write-Host $Model.Name -NoNewline -ForegroundColor White
        Write-Host (" ({0})" -f $Model.Size) -NoNewline -ForegroundColor Gray
        Write-Host " - " -NoNewline
        Write-Host $Status -ForegroundColor $StatusColor
        Write-Host ("     {0}" -f $Model.Description) -ForegroundColor DarkGray
        Write-Host ""
    }
}

function Download-Model {
    param($Model)
    
    Write-Host ""
    Write-Host "Downloading: $($Model.Name)" -ForegroundColor Green
    Write-Host "Size: $($Model.Size)" -ForegroundColor Gray
    Write-Host ""
    
    if (-not (Test-Path $ModelsDir)) {
        New-Item -ItemType Directory -Path $ModelsDir | Out-Null
    }
    
    $OutputPath = Join-Path $ModelsDir $Model.Filename
    
    if (Test-Path $OutputPath) {
        Write-Host "Model already exists at: $OutputPath" -ForegroundColor Yellow
        $Overwrite = Read-Host "Do you want to re-download? (y/n)"
        if ($Overwrite -ne "y") {
            Write-Host "Download cancelled." -ForegroundColor Yellow
            return
        }
    }
    
    try {
        Write-Host "Starting download..." -ForegroundColor Cyan
        Write-Host "URL: $($Model.URL)" -ForegroundColor DarkGray
        Write-Host ""
        
        # Use Invoke-WebRequest for reliable downloads
        # Note: BITS transfer can cause MUI cache errors on some systems
        $ProgressPreference = 'Continue'
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $Model.URL -OutFile $OutputPath -UseBasicParsing
        
        Write-Host ""
        Write-Host "Download completed successfully!" -ForegroundColor Green
        Write-Host "Model saved to: $OutputPath" -ForegroundColor Cyan
        Write-Host ""
        
    } catch {
        Write-Host ""
        Write-Host "Download failed: $_" -ForegroundColor Red
        Write-Host ""
        
        if (Test-Path $OutputPath) {
            Remove-Item $OutputPath -Force
        }
    }
}

function Main {
    Show-Banner
    
    if ($ModelChoice) {
        $SelectedModel = $Models | Where-Object { $_.ID -eq $ModelChoice }
        if ($SelectedModel) {
            Download-Model -Model $SelectedModel
        } else {
            Write-Host "Invalid model choice: $ModelChoice" -ForegroundColor Red
            Write-Host "Please choose a number between 1 and 10." -ForegroundColor Yellow
        }
        return
    }
    
    Show-Models
    
    Write-Host "Enter model number (1-10) to download, or 0 to exit:" -ForegroundColor Cyan
    $Choice = Read-Host "Your choice"
    
    if ($Choice -eq "0") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        return
    }
    
    $SelectedModel = $Models | Where-Object { $_.ID -eq [int]$Choice }
    
    if ($SelectedModel) {
        Download-Model -Model $SelectedModel
        
        Write-Host ""
        $Continue = Read-Host "Download another model? (y/n)"
        if ($Continue -eq "y") {
            Main
        }
    } else {
        Write-Host "Invalid choice. Please enter a number between 1 and 10." -ForegroundColor Red
        Start-Sleep -Seconds 2
        Main
    }
}

# Run the script
Main
