#!/bin/bash
# ============================================
# ImoPanorama - VPS Setup Script
# Installe PostgreSQL 16, Redis 7, Node 22, PM2
# Compatible Ubuntu 22.04 / 24.04
# Usage: sudo bash scripts/setup-vps.sh
# ============================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[SETUP]${NC} $1"; }
warn() { echo -e "${YELLOW}[SETUP]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then
  echo "Ce script doit être lancé en root : sudo bash scripts/setup-vps.sh"
  exit 1
fi

# =====================
# 1. Mise à jour système
# =====================
log "Mise à jour du système..."
apt update && apt upgrade -y
apt install -y curl wget gnupg2 lsb-release software-properties-common build-essential git

# =====================
# 2. PostgreSQL 16
# =====================
log "Installation de PostgreSQL 16..."
if ! command -v psql &> /dev/null; then
  sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
  apt update
  apt install -y postgresql-16 postgresql-client-16
  systemctl enable postgresql
  systemctl start postgresql

  # Créer les bases de données
  sudo -u postgres psql -c "CREATE DATABASE db_imo;" 2>/dev/null || warn "db_imo existe déjà"
  sudo -u postgres psql -c "CREATE DATABASE umami;" 2>/dev/null || warn "umami existe déjà"

  # Autoriser les connexions Docker (pour Umami)
  PG_HBA=$(sudo -u postgres psql -t -c "SHOW hba_file;" | xargs)
  if ! grep -q "172.16.0.0/12" "$PG_HBA"; then
    echo "host    all    all    172.16.0.0/12    md5" >> "$PG_HBA"
    systemctl reload postgresql
    log "PostgreSQL configuré pour accepter les connexions Docker"
  fi

  log "PostgreSQL 16 installé et configuré"
else
  warn "PostgreSQL déjà installé, skip"
fi

# =====================
# 3. Redis 7
# =====================
log "Installation de Redis 7..."
if ! command -v redis-server &> /dev/null; then
  curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
  echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" > /etc/apt/sources.list.d/redis.list
  apt update
  apt install -y redis-server

  # Config de base
  sed -i 's/^# maxmemory .*/maxmemory 512mb/' /etc/redis/redis.conf
  sed -i 's/^# maxmemory-policy .*/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
  sed -i 's/^appendonly no/appendonly yes/' /etc/redis/redis.conf

  systemctl enable redis-server
  systemctl restart redis-server
  log "Redis 7 installé et configuré (512MB, LRU, AOF)"
else
  warn "Redis déjà installé, skip"
fi

# =====================
# 4. Node.js 22 (via nvm)
# =====================
log "Installation de Node.js 22..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y nodejs
  log "Node.js $(node -v) installé"
else
  warn "Node.js $(node -v) déjà installé"
fi

# =====================
# 5. PM2 (Process Manager)
# =====================
log "Installation de PM2..."
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
  pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
  log "PM2 installé et configuré au démarrage"
else
  warn "PM2 déjà installé"
fi

# =====================
# 6. Docker (pour Qdrant, Umami, Grafana, etc.)
# =====================
log "Installation de Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $SUDO_USER
  systemctl enable docker
  systemctl start docker
  log "Docker installé. Re-login nécessaire pour le groupe docker."
else
  warn "Docker déjà installé"
fi

# =====================
# Résumé
# =====================
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN} Setup VPS terminé !${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Services natifs installés :"
echo "  - PostgreSQL 16 : localhost:5432 (bases: db_imo, umami)"
echo "  - Redis 7       : localhost:6379 (512MB, AOF)"
echo "  - Node.js $(node -v)"
echo "  - PM2 (process manager)"
echo "  - Docker $(docker --version 2>/dev/null | cut -d' ' -f3 || echo 'installé')"
echo ""
echo "Prochaines étapes :"
echo "  1. cd /votre/projet"
echo "  2. npm install"
echo "  3. cp .env.exemple .env && nano .env"
echo "  4. npx prisma migrate deploy"
echo "  5. npm run build"
echo "  6. pm2 start ecosystem.config.js"
echo "  7. cd docker && docker compose up -d"
echo ""
