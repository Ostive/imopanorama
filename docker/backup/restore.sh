#!/bin/bash
# ============================================
# ImoPanorama - Restore Script (services natifs)
# Usage: sudo bash restore.sh /backups/imopanorama/20260321_030000
# ============================================

set -euo pipefail

BACKUP_PATH="${1:?Usage: sudo bash restore.sh /backups/imopanorama/YYYYMMDD_HHMMSS}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[RESTORE]${NC} $1"; }
warn() { echo -e "${YELLOW}[RESTORE]${NC} $1"; }

if [ ! -d "${BACKUP_PATH}" ]; then
    echo -e "${RED}Dossier introuvable: ${BACKUP_PATH}${NC}"
    exit 1
fi

echo -e "${YELLOW}==============================${NC}"
echo -e "${YELLOW} ImoPanorama - Restauration${NC}"
echo -e "${YELLOW}==============================${NC}"
echo ""
echo "Backup: ${BACKUP_PATH}"
ls -lh "${BACKUP_PATH}/"
echo ""
read -p "Restaurer ? Cela ECRASERA les données actuelles. (yes/no): " CONFIRM
if [ "${CONFIRM}" != "yes" ]; then
    echo "Annulé."
    exit 0
fi

# PostgreSQL
for DUMP in "${BACKUP_PATH}"/postgres_*.dump; do
    [ -f "$DUMP" ] || continue
    DB=$(echo "$DUMP" | grep -oP 'postgres_\K[^_]+')
    log "Restauration PostgreSQL: ${DB}..."
    sudo -u postgres pg_restore -d "${DB}" --clean --if-exists "$DUMP" 2>/dev/null || warn "Warnings PostgreSQL (normal)"
    log "  ✓ ${DB}"
done

# Redis
REDIS_DUMP=$(find "${BACKUP_PATH}" -name "redis_*.rdb" | head -1)
if [ -n "${REDIS_DUMP}" ]; then
    log "Restauration Redis..."
    systemctl stop redis-server
    cp "${REDIS_DUMP}" /var/lib/redis/dump.rdb
    chown redis:redis /var/lib/redis/dump.rdb
    systemctl start redis-server
    log "  ✓ Redis"
fi

echo ""
log "Restauration terminée ! Vérifiez vos données."
log "Relancez l'app si besoin : pm2 restart imopanorama"
