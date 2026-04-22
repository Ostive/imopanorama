
import { syncAllPropertiesToQdrant } from '@/lib/qdrant/sync';

async function main() {
    console.log('🚀 Starting property sync to Qdrant...');
    try {
        const result = await syncAllPropertiesToQdrant();
        console.log('✨ Sync completed successfully!');
        console.log(`Summary: ${result.synced} synced, ${result.failed} failed out of ${result.total} total.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

main();
