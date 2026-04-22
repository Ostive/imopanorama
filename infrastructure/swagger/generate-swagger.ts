import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';
import fs from 'fs';
import path from 'path';

const spec = swaggerJsdoc(swaggerOptions);
fs.writeFileSync(path.join(process.cwd(), 'public', 'swagger.json'), JSON.stringify(spec, null, 2));
console.log('Swagger generated successfully in public/swagger.json');
