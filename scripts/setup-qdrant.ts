import { register } from 'tsconfig-paths';
import { resolve } from 'path';

const tsConfig = require('../tsconfig.json');
register({
    baseUrl: resolve(__dirname, '..'),
    paths: tsConfig.compilerOptions.paths,
});

import { initializeQdrantCollection } from '../infrastructure/search/qdrant/setup';
import { syncAllPropertiesToQdrant } from '../infrastructure/search/qdrant/sync';

async function main() {
    console.log('Starting Qdrant setup...');

    try {
        console.log('Initializing collection...');
        await initializeQdrantCollection();

        console.log('Syncing properties...');
        const result = await syncAllPropertiesToQdrant();

        console.log('Qdrant setup complete!');
        console.log(`Summary: ${result.synced} synced, ${result.failed} failed`);
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

main();
