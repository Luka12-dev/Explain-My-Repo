@echo off
setlocal enabledelayedexpansion

REM AI Model Download Script for Explain My Repo
REM Author: Luka
REM This script downloads AI models for repository analysis

set "MODELS_DIR=%~dp0models"
set "SCRIPT_DIR=%~dp0"

:banner
echo.
echo ================================================================
echo            Explain My Repo - AI Model Downloader
echo                       by Luka
echo ================================================================
echo.
goto :show_models

:show_models
echo Available AI Models:
echo.
echo  [1] Code Llama 7B (3.8 GB)
echo      Fast and efficient code analysis model
echo.
echo  [2] Code Llama 13B (7.3 GB)
echo      Advanced code analysis with deeper understanding
echo.
echo  [3] Code Llama 34B (19 GB)
echo      Professional-grade analysis with comprehensive insights
echo.
echo  [4] StarCoder 15B (8.5 GB)
echo      Specialized for multi-language code understanding
echo.
echo  [5] WizardCoder 15B (8.2 GB)
echo      High-performance code comprehension
echo.
echo  [6] DeepSeek Coder 6.7B (3.5 GB)
echo      Efficient and accurate code analysis
echo.
echo  [7] Phi-2 2.7B (1.5 GB)
echo      Compact model for fast analysis
echo.
echo  [8] Mistral 7B Instruct (4.1 GB)
echo      General-purpose with strong code understanding
echo.
echo  [9] Llama 2 7B (3.8 GB)
echo      Versatile model for code analysis
echo.
echo  [10] Granite Code 8B (4.5 GB)
echo       Enterprise-grade code analysis
echo.

set /p "choice=Enter model number (1-10) to download, or 0 to exit: "

if "%choice%"=="0" (
    echo Exiting...
    goto :eof
)

if "%choice%"=="1" call :download_model "Code Llama 7B" "3.8 GB" "https://huggingface.co/TheBloke/CodeLlama-7B-GGUF/resolve/main/codellama-7b.Q4_K_M.gguf" "codellama-7b.gguf"
if "%choice%"=="2" call :download_model "Code Llama 13B" "7.3 GB" "https://huggingface.co/TheBloke/CodeLlama-13B-GGUF/resolve/main/codellama-13b.Q4_K_M.gguf" "codellama-13b.gguf"
if "%choice%"=="3" call :download_model "Code Llama 34B" "19 GB" "https://huggingface.co/TheBloke/CodeLlama-34B-GGUF/resolve/main/codellama-34b.Q4_K_M.gguf" "codellama-34b.gguf"
if "%choice%"=="4" call :download_model "StarCoder 15B" "8.5 GB" "https://huggingface.co/TheBloke/starcoder-GGUF/resolve/main/starcoder-15b.Q4_K_M.gguf" "starcoder-15b.gguf"
if "%choice%"=="5" call :download_model "WizardCoder 15B" "8.2 GB" "https://huggingface.co/TheBloke/WizardCoder-15B-GGUF/resolve/main/wizardcoder-15b.Q4_K_M.gguf" "wizardcoder-15b.gguf"
if "%choice%"=="6" call :download_model "DeepSeek Coder 6.7B" "3.5 GB" "https://huggingface.co/TheBloke/deepseek-coder-6.7b-GGUF/resolve/main/deepseek-coder-6.7b.Q4_K_M.gguf" "deepseek-coder-6.7b.gguf"
if "%choice%"=="7" call :download_model "Phi-2 2.7B" "1.5 GB" "https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf" "phi-2.gguf"
if "%choice%"=="8" call :download_model "Mistral 7B Instruct" "4.1 GB" "https://huggingface.co/TheBloke/Mistral-7B-Instruct-GGUF/resolve/main/mistral-7b-instruct.Q4_K_M.gguf" "mistral-7b-instruct.gguf"
if "%choice%"=="9" call :download_model "Llama 2 7B" "3.8 GB" "https://huggingface.co/TheBloke/Llama-2-7B-GGUF/resolve/main/llama-2-7b.Q4_K_M.gguf" "llama-2-7b.gguf"
if "%choice%"=="10" call :download_model "Granite Code 8B" "4.5 GB" "https://huggingface.co/TheBloke/granite-code-8b-GGUF/resolve/main/granite-code-8b.Q4_K_M.gguf" "granite-code-8b.gguf"

if not "%choice%" geq "1" if not "%choice%" leq "10" (
    echo Invalid choice. Please enter a number between 1 and 10.
    timeout /t 2 >nul
    goto :show_models
)

echo.
set /p "continue=Download another model? (y/n): "
if /i "%continue%"=="y" goto :show_models
goto :eof

:download_model
set "model_name=%~1"
set "model_size=%~2"
set "model_url=%~3"
set "model_filename=%~4"

echo.
echo Downloading: %model_name%
echo Size: %model_size%
echo.

if not exist "%MODELS_DIR%" mkdir "%MODELS_DIR%"

set "output_path=%MODELS_DIR%\%model_filename%"

if exist "%output_path%" (
    echo Model already exists at: %output_path%
    set /p "overwrite=Do you want to re-download? (y/n): "
    if /i not "!overwrite!"=="y" (
        echo Download cancelled.
        goto :eof
    )
)

echo Starting download...
echo URL: %model_url%
echo.

where curl >nul 2>&1
if %errorlevel% equ 0 (
    curl -L "%model_url%" -o "%output_path%" --progress-bar
) else (
    where powershell >nul 2>&1
    if %errorlevel% equ 0 (
        powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%model_url%' -OutFile '%output_path%' -UseBasicParsing}"
    ) else (
        echo Error: Neither curl nor PowerShell is available.
        echo Please install curl or use PowerShell to download models.
        goto :eof
    )
)

if %errorlevel% equ 0 (
    echo.
    echo Download completed successfully!
    echo Model saved to: %output_path%
    echo.
) else (
    echo.
    echo Download failed!
    echo.
    if exist "%output_path%" del /f "%output_path%"
)

goto :eof
