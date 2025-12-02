#!/bin/bash

set -a
source .env
set +a

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-create"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

# Set your connection string
CONNECTION_URL="$DATABASE_URL"

# Create the new database
psql "$CONNECTION_URL" -c "CREATE DATABASE gym_management_db;"