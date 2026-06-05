import 'dotenv/config'
import { prisma } from '../infrastructure/database/prisma'

async function main() {
  console.log('Extensions disponibles vs installées:')
  const ext = await prisma.$queryRaw<any[]>`
    SELECT name, installed_version, default_version
    FROM pg_available_extensions
    WHERE name IN ('vector','pg_trgm','unaccent')
    ORDER BY name
  `
  console.table(ext)

  console.log('Colonnes de Property:')
  const cols = await prisma.$queryRaw<any[]>`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_name='Property' ORDER BY ordinal_position
  `
  console.table(cols.filter(c => ['id','title','embedding','createdAt'].includes(c.column_name)))

  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
