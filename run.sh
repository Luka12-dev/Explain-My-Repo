#!/bin/bash

# Explain My Repo - Automated Run Script
# Author: Luka
# This script automatically starts both frontend and backend servers

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
SERVER_DIR="$SRC_DIR/server"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m'

show_banner() {
    echo ""
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${CYAN}                    Explain My Repo                            ${NC}"
    echo -e "${CYAN}              AI-Powered Repository Analysis                   ${NC}"
    echo -e "${CYAN}                      by Luka                                  ${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo ""
}

check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed.${NC}"
        echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed.${NC}"
        echo -e "${YELLOW}Please install npm${NC}"
        exit 1
    fi
}

install_dependencies() {
    echo -e "${GREEN}Installing dependencies...${NC}"
    echo ""
    
    if [ ! -d "$SRC_DIR" ]; then
        echo -e "${RED}Error: Source directory not found at $SRC_DIR${NC}"
        exit 1
    fi
    
    cd "$SRC_DIR" || exit 1
    
    echo -e "${CYAN}Installing frontend dependencies...${NC}"
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Frontend dependencies installation failed${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}Dependencies installed successfully!${NC}"
    echo ""
}

build_application() {
    echo -e "${GREEN}Building application...${NC}"
    echo ""
    
    cd "$SRC_DIR" || exit 1
    
    echo -e "${CYAN}Building Next.js application...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Build failed${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}Build completed successfully!${NC}"
    echo ""
}

clean_build() {
    echo -e "${YELLOW}Cleaning build artifacts...${NC}"
    echo ""
    
    local paths=("$SRC_DIR/.next" "$SRC_DIR/node_modules" "$SRC_DIR/package-lock.json")
    
    for path in "${paths[@]}"; do
        if [ -e "$path" ]; then
            echo -e "${GRAY}Removing: $path${NC}"
            rm -rf "$path"
        fi
    done
    
    echo ""
    echo -e "${GREEN}Clean completed!${NC}"
    echo ""
}

start_dev_servers() {
    echo -e "${GREEN}Starting development servers...${NC}"
    echo ""
    
    # Check if dependencies are installed
    if [ ! -d "$SRC_DIR/node_modules" ]; then
        echo -e "${YELLOW}Dependencies not found. Installing...${NC}"
        install_dependencies
    fi
    
    # Trap to handle cleanup
    trap 'kill $(jobs -p) 2>/dev/null; echo -e "\n${YELLOW}Servers stopped.${NC}"; exit' INT TERM
    
    echo -e "${CYAN}Starting Backend Server (Port 5000)...${NC}"
    cd "$SERVER_DIR" && node index.js &
    BACKEND_PID=$!
    
    sleep 2
    
    echo -e "${CYAN}Starting Frontend Server (Port 3000)...${NC}"
    cd "$SRC_DIR" && npm run dev &
    FRONTEND_PID=$!
    
    sleep 3
    
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}  Servers Started Successfully!                                ${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "  Frontend: ${CYAN}http://localhost:3000${NC}"
    echo -e "  Backend:  ${CYAN}http://localhost:5000${NC}"
    echo ""
    echo -e "  ${YELLOW}Press Ctrl+C to stop all servers${NC}"
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    
    # Wait for processes
    wait $BACKEND_PID $FRONTEND_PID
}

start_production_servers() {
    echo -e "${GREEN}Starting production servers...${NC}"
    echo ""
    
    # Check if build exists
    if [ ! -d "$SRC_DIR/.next" ]; then
        echo -e "${YELLOW}Build not found. Building application...${NC}"
        build_application
    fi
    
    # Trap to handle cleanup
    trap 'kill $(jobs -p) 2>/dev/null; echo -e "\n${YELLOW}Servers stopped.${NC}"; exit' INT TERM
    
    echo -e "${CYAN}Starting Backend Server (Port 5000)...${NC}"
    cd "$SERVER_DIR" && node index.js &
    BACKEND_PID=$!
    
    sleep 2
    
    echo -e "${CYAN}Starting Frontend Server (Port 3000)...${NC}"
    cd "$SRC_DIR" && npm start &
    FRONTEND_PID=$!
    
    sleep 3
    
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}  Production Servers Started!                                  ${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "  Frontend: ${CYAN}http://localhost:3000${NC}"
    echo -e "  Backend:  ${CYAN}http://localhost:5000${NC}"
    echo ""
    echo -e "  ${YELLOW}Press Ctrl+C to stop all servers${NC}"
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    
    # Wait for processes
    wait $BACKEND_PID $FRONTEND_PID
}

show_help() {
    echo -e "${CYAN}Usage: ./run.sh [OPTIONS]${NC}"
    echo ""
    echo -e "${GREEN}Options:${NC}"
    echo -e "  ${NC}dev          Start development servers (default)${NC}"
    echo -e "  ${NC}build        Build the application${NC}"
    echo -e "  ${NC}production   Start production servers${NC}"
    echo -e "  ${NC}install      Install dependencies${NC}"
    echo -e "  ${NC}clean        Clean build artifacts${NC}"
    echo -e "  ${NC}help         Show this help message${NC}"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo -e "  ${GRAY}./run.sh              # Start development servers${NC}"
    echo -e "  ${GRAY}./run.sh install      # Install dependencies${NC}"
    echo -e "  ${GRAY}./run.sh build        # Build application${NC}"
    echo -e "  ${GRAY}./run.sh production   # Start production servers${NC}"
    echo -e "  ${GRAY}./run.sh clean        # Clean build artifacts${NC}"
    echo ""
}

# Main execution
show_banner

# Check if Node.js is installed
check_node

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo -e "${GRAY}Node.js Version: $NODE_VERSION${NC}"
echo -e "${GRAY}npm Version: $NPM_VERSION${NC}"
echo ""

# Handle commands
case "${1:-dev}" in
    clean)
        clean_build
        ;;
    install)
        install_dependencies
        ;;
    build)
        build_application
        ;;
    production)
        start_production_servers
        ;;
    dev)
        start_dev_servers
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
