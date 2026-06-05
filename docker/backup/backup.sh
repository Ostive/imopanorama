#!/bin/bash
# ============================================
# ImoPanorama - Automated Backup Script
# PostgreSQL et Redis sont natifs sur le VPS
# Run via cron: 0 3 * * * /chemin/vers/backup.sh
# ============================================

set -euo pipefail

BACKUP_DIR="/backups/imopanorama"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"; }

mkdir -p "${BACKUP_PATH}"

# =====================
# 1. PostgreSQL (natif)
# =====================
log "Backup PostgreSQL..."
for DB in db_imo umami; do
    if sudo -u postgres pg_dump -d "${DB}" --format=custom > "${BACKUP_PATH}/postgres_${DB}_${TIMESTAMP}.dump" 2>/dev/null; then
        log "  ✓ ${DB}"
    else
        warn "  ✗ ${DB} (n'existe peut-être pas)"
    fi
done

# =====================
# 2. Redis (natif)
# =====================
log "Backup Redis..."
if redis-cli BGSAVE > /dev/null 2>&1; then
    sleep 2
    cp /var/lib/redis/dump.rdb "${BACKUP_PATH}/redis_${TIMESTAMP}.rdb" 2>/dev/null || warn "Copie Redis échouée"
    log "  ✓ Redis"
else
    warn "  ✗ Redis"
fi

# =====================
# 3. Cleanup
# =====================
log "Nettoyage des backups > ${RETENTION_DAYS} jours..."
find "${BACKUP_DIR}" -maxdepth 1 -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} + 2>/dev/null || true

# =====================
# Résumé
# =====================
BACKUP_SIZE=$(du -sh "${BACKUP_PATH}" | cut -f1)
log "Backup terminé ! Taille: ${BACKUP_SIZE} → ${BACKUP_PATH}"
