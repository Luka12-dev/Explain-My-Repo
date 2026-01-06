#!/bin/bash

# AI Model Download Script for Explain My Repo
# Author: Luka
# This script downloads AI models for repository analysis

MODELS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/models"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Model definitions
declare -A MODEL_NAMES=(
    [1]="Code Llama 7B"
    [2]="Code Llama 13B"
    [3]="Code Llama 34B"
    [4]="StarCoder 15B"
    [5]="WizardCoder 15B"
    [6]="DeepSeek Coder 6.7B"
    [7]="Phi-2 2.7B"
    [8]="Mistral 7B Instruct"
    [9]="Llama 2 7B"
    [10]="Granite Code 8B"
)

declare -A MODEL_SIZES=(
    [1]="3.8 GB"
    [2]="7.3 GB"
    [3]="19 GB"
    [4]="8.5 GB"
    [5]="8.2 GB"
    [6]="3.5 GB"
    [7]="1.5 GB"
    [8]="4.1 GB"
    [9]="3.8 GB"
    [10]="4.5 GB"
)

declare -A MODEL_URLS=(
    [1]="https://huggingface.co/TheBloke/CodeLlama-7B-GGUF/resolve/main/codellama-7b.Q4_K_M.gguf"
    [2]="https://huggingface.co/TheBloke/CodeLlama-13B-GGUF/resolve/main/codellama-13b.Q4_K_M.gguf"
    [3]="https://huggingface.co/TheBloke/CodeLlama-34B-GGUF/resolve/main/codellama-34b.Q4_K_M.gguf"
    [4]="https://huggingface.co/TheBloke/starcoder-GGUF/resolve/main/starcoder-15b.Q4_K_M.gguf"
    [5]="https://huggingface.co/TheBloke/WizardCoder-15B-GGUF/resolve/main/wizardcoder-15b.Q4_K_M.gguf"
    [6]="https://huggingface.co/TheBloke/deepseek-coder-6.7b-GGUF/resolve/main/deepseek-coder-6.7b.Q4_K_M.gguf"
    [7]="https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf"
    [8]="https://huggingface.co/TheBloke/Mistral-7B-Instruct-GGUF/resolve/main/mistral-7b-instruct.Q4_K_M.gguf"
    [9]="https://huggingface.co/TheBloke/Llama-2-7B-GGUF/resolve/main/llama-2-7b.Q4_K_M.gguf"
    [10]="https://huggingface.co/TheBloke/granite-code-8b-GGUF/resolve/main/granite-code-8b.Q4_K_M.gguf"
)

declare -A MODEL_FILENAMES=(
    [1]="codellama-7b.gguf"
    [2]="codellama-13b.gguf"
    [3]="codellama-34b.gguf"
    [4]="starcoder-15b.gguf"
    [5]="wizardcoder-15b.gguf"
    [6]="deepseek-coder-6.7b.gguf"
    [7]="phi-2.gguf"
    [8]="mistral-7b-instruct.gguf"
    [9]="llama-2-7b.gguf"
    [10]="granite-code-8b.gguf"
)

declare -A MODEL_DESCRIPTIONS=(
    [1]="Fast and efficient code analysis model"
    [2]="Advanced code analysis with deeper understanding"
    [3]="Professional-grade analysis with comprehensive insights"
    [4]="Specialized for multi-language code understanding"
    [5]="High-performance code comprehension"
    [6]="Efficient and accurate code analysis"
    [7]="Compact model for fast analysis"
    [8]="General-purpose with strong code understanding"
    [9]="Versatile model for code analysis"
    [10]="Enterprise-grade code analysis"
)

show_banner() {
    echo ""
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${CYAN}           Explain My Repo - AI Model Downloader              ${NC}"
    echo -e "${CYAN}                      by Luka                                  ${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo ""
}

show_models() {
    echo -e "${GREEN}Available AI Models:${NC}"
    echo ""
    
    for i in {1..10}; do
        local status="${YELLOW}Not Downloaded${NC}"
        local model_path="${MODELS_DIR}/${MODEL_FILENAMES[$i]}"
        
        if [ -f "$model_path" ]; then
            status="${GREEN}Downloaded${NC}"
        fi
        
        echo -e " ${CYAN}[$i]${NC} ${MODEL_NAMES[$i]} ${GRAY}(${MODEL_SIZES[$i]})${NC} - $status"
        echo -e "     ${GRAY}${MODEL_DESCRIPTIONS[$i]}${NC}"
        echo ""
    done
}

download_model() {
    local choice=$1
    local model_name="${MODEL_NAMES[$choice]}"
    local model_size="${MODEL_SIZES[$choice]}"
    local model_url="${MODEL_URLS[$choice]}"
    local model_filename="${MODEL_FILENAMES[$choice]}"
    
    echo ""
    echo -e "${GREEN}Downloading: $model_name${NC}"
    echo -e "${GRAY}Size: $model_size${NC}"
    echo ""
    
    mkdir -p "$MODELS_DIR"
    
    local output_path="${MODELS_DIR}/${model_filename}"
    
    if [ -f "$output_path" ]; then
        echo -e "${YELLOW}Model already exists at: $output_path${NC}"
        read -p "Do you want to re-download? (y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            echo -e "${YELLOW}Download cancelled.${NC}"
            return
        fi
    fi
    
    echo -e "${CYAN}Starting download...${NC}"
    echo -e "${GRAY}URL: $model_url${NC}"
    echo ""
    
    if command -v wget &> /dev/null; then
        wget -c "$model_url" -O "$output_path" --progress=bar:force 2>&1
    elif command -v curl &> /dev/null; then
        curl -L "$model_url" -o "$output_path" --progress-bar
    else
        echo -e "${RED}Error: Neither wget nor curl is available.${NC}"
        echo -e "${YELLOW}Please install wget or curl to download models.${NC}"
        return 1
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}Download completed successfully!${NC}"
        echo -e "${CYAN}Model saved to: $output_path${NC}"
        echo ""
    else
        echo ""
        echo -e "${RED}Download failed!${NC}"
        echo ""
        [ -f "$output_path" ] && rm -f "$output_path"
        return 1
    fi
}

main() {
    show_banner
    
    if [ $# -eq 1 ]; then
        if [[ $1 =~ ^[1-9]$|^10$ ]]; then
            download_model $1
            exit 0
        else
            echo -e "${RED}Invalid model choice: $1${NC}"
            echo -e "${YELLOW}Please choose a number between 1 and 10.${NC}"
            exit 1
        fi
    fi
    
    show_models
    
    echo -e "${CYAN}Enter model number (1-10) to download, or 0 to exit:${NC}"
    read -p "Your choice: " choice
    
    if [ "$choice" == "0" ]; then
        echo -e "${YELLOW}Exiting...${NC}"
        exit 0
    fi
    
    if [[ $choice =~ ^[1-9]$|^10$ ]]; then
        download_model $choice
        
        echo ""
        read -p "Download another model? (y/n): " continue
        if [ "$continue" == "y" ]; then
            main
        fi
    else
        echo -e "${RED}Invalid choice. Please enter a number between 1 and 10.${NC}"
        sleep 2
        main
    fi
}

main "$@"
