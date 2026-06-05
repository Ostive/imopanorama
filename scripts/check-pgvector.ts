import 'dotenv/config'
import { prisma } from '../infrastructure/database/prisma'

async function main() {
  const ver = await prisma.$queryRaw<any[]>`SELECT version() AS v, current_database() AS db, inet_server_port() AS port`
  console.log('SERVER:', ver[0])

  const avail = await prisma.$queryRaw<any[]>`
    SELECT name, installed_version, default_version
    FROM pg_available_extensions
    WHERE name IN ('vector','pg_trgm','unaccent','fuzzystrmatch','cube','earthdistance','btree_gin')
    ORDER BY name
  `
  console.log('\nEXTENSIONS:')
  console.table(avail)

  const cols = await prisma.$queryRaw<any[]>`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name='Property'
    ORDER BY ordinal_position
  `
  console.log(`\nProperty columns (${cols.length}):`)
  console.table(cols)

  const idx = await prisma.$queryRaw<any[]>`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'Property'
  `
  console.log('\nProperty indexes:')
  console.table(idx)

  const count = await prisma.$queryRaw<any[]>`SELECT COUNT(*)::int AS n FROM "Property"`
  console.log('\nProperty rows:', count[0]?.n)

  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
